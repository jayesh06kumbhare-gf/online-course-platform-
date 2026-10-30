import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Users, BookOpen, DollarSign, Award, CheckCircle2,
  XCircle, Clock, AlertCircle, ShieldCheck, ArrowRight, TrendingUp
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { AdminAnalytics, Course } from '../types';
import { api } from '../services/api';

export const AdminDashboardPage: React.FC = () => {
  const [analytics, setAnalytics] = useState<AdminAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<number | null>(null);
  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const data = await api.getAdminAnalytics();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to load admin analytics:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const handleCourseAction = async (courseId: number, action: 'approve' | 'reject') => {
    setActionLoadingId(courseId);
    try {
      await api.updateCourseStatus(courseId, action);
      await fetchAnalytics();
    } catch (err) {
      alert(`Failed to ${action} course.`);
    } finally {
      setActionLoadingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Category distribution chart
  const categoryChartData = analytics?.categories.map((c) => ({
    name: c.name,
    courses: c.course_num,
  })) || [];

  return (
    <div className="space-y-8">

      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Administrator Console
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Global platform governance, curriculum approvals, revenue metrics, and user management.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            to="/admin/courses"
            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition-colors"
          >
            Review Courses
          </Link>
          <Link
            to="/admin/users"
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            Manage Users
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Registered Students</span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {analytics?.total_students || 0}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">Active platform learners</span>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Total Courses</span>
            <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
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
            <span className="text-xs font-semibold text-slate-500">Course Enrollments</span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            {analytics?.total_enrollments || 0}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">
            {analytics?.completed_enrollments || 0} completed
          </span>
        </div>

        <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500">Gross Platform Revenue</span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <DollarSign className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-2">
            ${Number(analytics?.total_revenue || 0).toFixed(2)}
          </div>
          <span className="text-[11px] text-slate-400 mt-1 block">All transactions</span>
        </div>

      </div>

      {/* Pending Course Approvals Queue */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <span>Pending Course Approvals ({analytics?.pending_courses_list?.length || 0})</span>
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Review instructor submissions before publishing to the public catalog.
            </p>
          </div>
          <Link to="/admin/courses" className="text-xs font-bold text-indigo-600 hover:underline">
            View All Courses
          </Link>
        </div>

        {(!analytics?.pending_courses_list || analytics.pending_courses_list.length === 0) ? (
          <div className="p-8 text-center text-xs text-slate-400">
            ✓ All instructor courses have been reviewed. No pending approvals in queue.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {analytics.pending_courses_list.map((c) => (
              <div
                key={c.id}
                className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-slate-50/50"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2 py-0.5 rounded">
                    Under Review
                  </span>
                  <h3 className="font-bold text-slate-900 text-sm mt-1">{c.title}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Instructor: <strong>{c.instructor_name}</strong> • Level: {c.level} • Price: ${Number(c.price).toFixed(2)}
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <button
                    onClick={() => handleCourseAction(c.id, 'approve')}
                    disabled={actionLoadingId === c.id}
                    className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Approve & Publish</span>
                  </button>
                  <button
                    onClick={() => handleCourseAction(c.id, 'reject')}
                    disabled={actionLoadingId === c.id}
                    className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition-colors flex items-center gap-1.5"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Category Distribution Chart & Recent Enrollments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Category Breakdown Chart */}
        <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <h2 className="text-lg font-bold text-slate-900 mb-1">Courses by Category</h2>
          <p className="text-xs text-slate-500 mb-6">Volume of authored curricula per subject domain.</p>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryChartData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} angle={-15} textAnchor="end" />
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
                <Bar dataKey="courses" fill="#6366f1" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Enrollments */}
        <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100">
            <h2 className="text-lg font-bold text-slate-900">Recent Student Activity</h2>
            <p className="text-xs text-slate-500 mt-0.5">Live stream of student course enrollments.</p>
          </div>

          <div className="divide-y divide-slate-100 flex-1 overflow-y-auto">
            {(!analytics?.recent_enrollments || analytics.recent_enrollments.length === 0) ? (
              <p className="p-8 text-center text-xs text-slate-400">No enrollment events recorded yet.</p>
            ) : (
              analytics.recent_enrollments.map((enr) => (
                <div key={enr.id} className="p-4 flex items-center justify-between text-xs hover:bg-slate-50/50">
                  <div className="min-w-0 pr-3">
                    <p className="font-bold text-slate-900 truncate">
                      {enr.student__first_name ? `${enr.student__first_name} ${enr.student__last_name}` : enr.student__email}
                    </p>
                    <p className="text-slate-500 truncate mt-0.5">{enr.course__title}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="font-mono font-bold text-indigo-600 block">
                      ${Number(enr.amount_paid).toFixed(2)}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {Number(enr.completion_percentage).toFixed(0)}% completed
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>

    </div>
  );
};
