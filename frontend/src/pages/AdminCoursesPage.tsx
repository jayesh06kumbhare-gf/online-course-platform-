import React, { useState, useEffect } from 'react';
import { BookOpen, CheckCircle2, XCircle, Clock, Eye, AlertCircle } from 'lucide-react';
import { Course } from '../types';
import { api } from '../services/api';

export const AdminCoursesPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [filter, setFilter] = useState<'all' | 'pending' | 'published' | 'draft' | 'rejected'>('all');
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res: any = await api.getAdminCourses(filter === 'all' ? undefined : filter);
      setCourses(res.results || res || []);
    } catch (err) {
      console.error('Failed to load admin courses:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, [filter]);

  const handleAction = async (courseId: number, action: 'approve' | 'reject' | 'unpublish') => {
    setActionLoadingId(courseId);
    try {
      await api.updateCourseStatus(courseId, action);
      await fetchCourses();
    } catch (err) {
      alert(`Failed to ${action} course.`);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Course Management & Review
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Publish, review, reject, or unpublish courses across all departments.
          </p>
        </div>

        {/* Status filters */}
        <div className="flex items-center p-1 bg-slate-200/60 rounded-xl text-xs font-semibold self-start overflow-x-auto">
          {(['all', 'pending', 'published', 'draft', 'rejected'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setFilter(tab)}
              className={`px-3 py-1.5 rounded-lg capitalize transition-all whitespace-nowrap ${
                filter === tab
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Courses Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : courses.length === 0 ? (
          <div className="p-12 text-center text-xs text-slate-400">
            No courses found under this filter tab.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-100 font-bold">
                <tr>
                  <th className="px-6 py-4">Course Title</th>
                  <th className="px-6 py-4">Instructor</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Students</th>
                  <th className="px-6 py-4 text-right">Moderation Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {courses.map((c) => {
                  const statusStyles: Record<string, string> = {
                    published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
                    pending: 'bg-amber-50 text-amber-700 border-amber-200',
                    draft: 'bg-slate-100 text-slate-700 border-slate-200',
                    rejected: 'bg-rose-50 text-rose-700 border-rose-200',
                  };

                  return (
                    <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-semibold text-slate-900 max-w-xs">
                        <div className="truncate">{c.title}</div>
                        <div className="text-[11px] text-slate-400 font-normal">
                          {c.is_free ? 'Free' : `$${Number(c.price).toFixed(2)}`} • {c.level}
                        </div>
                      </td>
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {c.instructor_name}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {c.category_name || 'General'}
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusStyles[c.status] || ''}`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 font-mono font-medium">
                        {c.total_students}
                      </td>
                      <td className="px-6 py-4 text-right space-x-2">
                        {c.status !== 'published' && (
                          <button
                            onClick={() => handleAction(c.id, 'approve')}
                            disabled={actionLoadingId === c.id}
                            className="px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold rounded-lg text-xs transition-colors"
                          >
                            Approve
                          </button>
                        )}
                        {c.status === 'published' && (
                          <button
                            onClick={() => handleAction(c.id, 'unpublish')}
                            disabled={actionLoadingId === c.id}
                            className="px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg text-xs transition-colors"
                          >
                            Unpublish
                          </button>
                        )}
                        {c.status !== 'rejected' && (
                          <button
                            onClick={() => handleAction(c.id, 'reject')}
                            disabled={actionLoadingId === c.id}
                            className="px-3 py-1 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold rounded-lg text-xs transition-colors"
                          >
                            Reject
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

    </div>
  );
};
