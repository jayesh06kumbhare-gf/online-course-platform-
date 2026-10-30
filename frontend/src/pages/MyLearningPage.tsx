import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Play, Award, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { Enrollment } from '../types';
import { api } from '../services/api';

export const MyLearningPage: React.FC = () => {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [filter, setFilter] = useState<'all' | 'in_progress' | 'completed'>('all');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEnrollments = async () => {
      setLoading(true);
      try {
        const res: any = await api.getMyEnrollments();
        setEnrollments(res.results || res || []);
      } catch (err) {
        console.error('Failed to load my enrollments:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchEnrollments();
  }, []);

  const filteredEnrollments = enrollments.filter((e) => {
    if (filter === 'in_progress') return Number(e.completion_percentage) < 100;
    if (filter === 'completed') return Number(e.completion_percentage) >= 100;
    return true;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Page Header & Filter Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            My Learning
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Track and resume your enrolled courses and earned certifications.
          </p>
        </div>

        {/* Filter buttons */}
        <div className="flex items-center p-1 bg-slate-200/60 rounded-xl text-xs font-semibold self-start">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'all'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Courses ({enrollments.length})
          </button>
          <button
            onClick={() => setFilter('in_progress')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'in_progress'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            In Progress
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              filter === 'completed'
                ? 'bg-white text-slate-900 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Completed
          </button>
        </div>
      </div>

      {/* Enrollments Grid */}
      {filteredEnrollments.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No courses found</h3>
          <p className="text-xs text-slate-500 mb-6">
            {filter === 'completed'
              ? 'You have not completed any courses yet. Keep learning to earn your first certificate!'
              : 'You are not currently enrolled in any courses in this category.'}
          </p>
          <Link
            to="/courses"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
          >
            Explore Course Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredEnrollments.map((item) => {
            const isCompleted = Number(item.completion_percentage) >= 100;
            const thumb =
              item.course.thumbnail_display ||
              item.course.thumbnail_url ||
              'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800';

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="p-6">
                  <div className="flex items-start gap-4">
                    <img
                      src={thumb}
                      alt={item.course.title}
                      className="w-20 h-20 rounded-xl object-cover shrink-0 bg-slate-100"
                    />
                    <div className="min-w-0 flex-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-indigo-600">
                        {item.course.category_name}
                      </span>
                      <h3 className="font-bold text-slate-900 text-sm line-clamp-2 mt-0.5">
                        {item.course.title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-1 truncate">
                        By {item.course.instructor_name}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                      <span>Progress</span>
                      <span className={isCompleted ? 'text-emerald-600 font-bold' : 'text-indigo-600 font-bold'}>
                        {Number(item.completion_percentage).toFixed(0)}%
                      </span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-300 ${
                          isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'
                        }`}
                        style={{ width: `${item.completion_percentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Action Buttons */}
                <div className="px-6 py-4 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between gap-3">
                  {isCompleted ? (
                    <Link
                      to="/certificates"
                      className="text-xs font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-lg flex items-center gap-1.5 transition-colors"
                    >
                      <Award className="w-3.5 h-3.5 text-amber-600" />
                      <span>View Certificate</span>
                    </Link>
                  ) : (
                    <span className="text-xs text-slate-500 flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>In Progress</span>
                    </span>
                  )}

                  <Link
                    to={`/learn/${item.course.slug}`}
                    className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-colors"
                  >
                    <Play className="w-3.5 h-3.5 fill-current" />
                    <span>{isCompleted ? 'Review Studio' : 'Resume Lesson'}</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};
