import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap, Clock, Award, BookOpen, ArrowRight,
  TrendingUp, Sparkles, Play, CheckCircle2, Star
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { StudentDashboardStats, Course } from '../types';
import { CourseCard } from '../components/CourseCard';

export const StudentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<StudentDashboardStats | null>(null);
  const [recommended, setRecommended] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [dashData, recData] = await Promise.all([
          api.getStudentDashboard(),
          api.getFeaturedCourses(),
        ]);
        setStats(dashData);
        setRecommended((recData as any).results || recData || []);
      } catch (err) {
        console.error('Failed to load dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Active in-progress course to highlight in "Continue Learning"
  const continueEnrollment = stats?.recent_enrollments?.find(
    (e) => e.status === 'active' && Number(e.completion_percentage) < 100
  ) || stats?.recent_enrollments?.[0];

  return (
    <div className="space-y-8">
      
      {/* 1. Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Welcome back to LearnSphere</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            Hello, {user?.first_name || 'Learner'}! 👋
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
            Ready to expand your skillset today? You're making continuous progress toward your engineering and design certifications.
          </p>
        </div>
      </div>

      {/* 2. Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        
        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Enrolled Courses</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {stats?.total_enrolled || 0}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Active curriculum tracks</span>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">In Progress</span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {stats?.in_progress || 0}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Active coursework</span>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Completed Courses</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {stats?.completed || 0}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">100% finished</span>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Learning Hours</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {stats?.total_learning_hours || 0}h
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Tracked activity</span>
        </div>

      </div>

      {/* 3. Continue Learning Spotlight */}
      {continueEnrollment && (
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Play className="w-4 h-4 text-indigo-600 fill-indigo-600" />
              <span>Continue Learning</span>
            </h2>
            <Link to="/my-learning" className="text-xs font-semibold text-indigo-600 hover:underline">
              View all my courses
            </Link>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 p-5 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="space-y-2 flex-1">
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
                {continueEnrollment.course.category_name}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                {continueEnrollment.course.title}
              </h3>
              
              {/* Progress bar */}
              <div className="pt-2 max-w-md">
                <div className="flex justify-between text-xs font-semibold text-slate-600 mb-1.5">
                  <span>Progress</span>
                  <span className="text-indigo-600">{Number(continueEnrollment.completion_percentage).toFixed(0)}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full transition-all duration-300"
                    style={{ width: `${continueEnrollment.completion_percentage}%` }}
                  />
                </div>
              </div>
            </div>

            <Link
              to={`/learn/${continueEnrollment.course.slug}`}
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 shrink-0 transition-colors"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>Resume Lesson</span>
            </Link>
          </div>
        </div>
      )}

      {/* 4. Recommended Courses based on topics */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recommended for You</h2>
            <p className="text-xs text-slate-500 mt-0.5">Explore courses matching popular industry technical demands.</p>
          </div>
          <Link to="/courses" className="text-xs font-semibold text-indigo-600 hover:underline flex items-center gap-1">
            <span>Explore catalog</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommended.slice(0, 3).map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      </div>

    </div>
  );
};
