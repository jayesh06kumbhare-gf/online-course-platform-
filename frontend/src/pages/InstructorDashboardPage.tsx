import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  BookOpen, Users, DollarSign, Star, PlusCircle,
  Clock, TrendingUp, AlertCircle, CheckCircle2, Edit3, Send
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { InstructorAnalytics, Course } from '../types';
import { api } from '../services/api';

export const InstructorDashboardPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<InstructorAnalytics | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [submittingId, setSubmittingId] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [analyticsData, coursesData] = await Promise.all([
        api.getInstructorAnalytics(),
        api.getInstructorCourses(),
      ]);
      setAnalytics(analyticsData);
      setCourses((coursesData as any).results || coursesData || []);
    } catch (err) {
      console.error('Failed to load instructor dashboard:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleSubmitReview = async (courseId: number) => {
    setSubmittingId(courseId);
    try {
      await api.submitCourseForReview(courseId);
      await fetchData();
    } catch (err: any) {
      alert(err.error || 'Failed to submit course.');
    } finally {
      setSubmittingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Chart data
  const chartData = analytics?.course_performance.map((c) => ({
    name: c.title.length > 20 ? `${c.title.slice(0, 18)}...` : c.title,
    students: c.total_students,
    rating: c.average_rating,
  })) || [];

  return (
    <div className="space-y-8">
      
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Instructor Studio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Author courses, organize lesson curricula, track student enrollment numbers, and inspect performance analytics.
          </p>
        </div>
        <Link
          to="/instructor/courses/new"
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 self-start transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Create New Course</span>
        </Link>
      </div>

      {/* Analytics KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Courses</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {analytics?.total_courses || 0}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {analytics?.published_courses || 0} published • {analytics?.pending_courses || 0} pending
          </span>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Students</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {analytics?.total_students || 0}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Across all curricula</span>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Course Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            ${Number(analytics?.total_revenue || 0).toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Lifetime earnings</span>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Instructor Rating</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Star className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {Number(analytics?.average_rating || 0).toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Average student review</span>
        </div>

      </div>

      {/* Performance Chart */}
      {chartData.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Student Enrollment Distribution</h2>
          <p className="text-xs text-slate-500 mb-6">Compare enrollment volume across your authored courses.</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} angle={-15} textAnchor="end" />
                <YAxis tick={{ fontSize: 11, fill: '#64748b' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#0f172a',
                    border: 'none',
                    borderRadius: '12px',
                    color: '#fff',
                    fontSize: '12px',
                  }}
                />
                <Bar dataKey="students" fill="#4f46e5" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* My Courses Table */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <h2 className="text-lg font-bold text-slate-900">My Authored Courses</h2>
          <span className="text-xs text-slate-500 font-medium">
            Total {courses.length} courses
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="bg-slate-50/80 text-slate-500 uppercase tracking-wider text-[11px] border-b border-slate-100 font-bold">
              <tr>
                <th className="px-6 py-4">Course</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Students</th>
                <th className="px-6 py-4">Rating</th>
                <th className="px-6 py-4 text-right">Actions</th>
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
                        {c.category_name} • {c.total_lessons} lessons
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${statusStyles[c.status] || ''}`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">
                      {c.is_free ? 'Free' : `$${Number(c.price).toFixed(2)}`}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {c.total_students}
                    </td>
                    <td className="px-6 py-4 font-medium">
                      ⭐ {Number(c.average_rating || 0).toFixed(1)}
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      {c.status === 'draft' && (
                        <button
                          onClick={() => handleSubmitReview(c.id)}
                          disabled={submittingId === c.id}
                          className="px-3 py-1 bg-amber-50 hover:bg-amber-100 text-amber-800 font-bold rounded-lg text-xs transition-colors"
                        >
                          {submittingId === c.id ? 'Submitting...' : 'Submit Review'}
                        </button>
                      )}
                      <Link
                        to={`/instructor/courses/${c.id}/curriculum`}
                        className="px-3 py-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-lg text-xs transition-colors inline-block"
                      >
                        Curriculum
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
