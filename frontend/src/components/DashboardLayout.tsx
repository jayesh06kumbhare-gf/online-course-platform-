import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, GraduationCap, Award, Bookmark, Settings,
  BookOpen, PlusCircle, BarChart3, Users, ShieldCheck,
  LogOut, Menu, X, ArrowLeft, Bell, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

interface SidebarItem {
  label: string;
  href: string;
  icon: React.ElementType;
}

export const DashboardLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout, loginAsDemo } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  if (!user) return null;

  let navItems: SidebarItem[] = [];
  let dashboardTitle = 'Student Portal';

  if (user.role === 'student') {
    dashboardTitle = 'Student Dashboard';
    navItems = [
      { label: 'Overview', href: '/dashboard', icon: LayoutDashboard },
      { label: 'My Learning', href: '/my-learning', icon: GraduationCap },
      { label: 'Certificates', href: '/certificates', icon: Award },
      { label: 'Wishlist', href: '/wishlist', icon: Bookmark },
      { label: 'Profile Settings', href: '/profile', icon: Settings },
    ];
  } else if (user.role === 'instructor') {
    dashboardTitle = 'Instructor Studio';
    navItems = [
      { label: 'Dashboard', href: '/instructor', icon: LayoutDashboard },
      { label: 'My Courses', href: '/instructor/courses', icon: BookOpen },
      { label: 'Create Course', href: '/instructor/courses/new', icon: PlusCircle },
      { label: 'Analytics', href: '/instructor/analytics', icon: BarChart3 },
      { label: 'Students', href: '/instructor/students', icon: Users },
      { label: 'Profile Settings', href: '/profile', icon: Settings },
    ];
  } else if (user.role === 'admin') {
    dashboardTitle = 'Admin Console';
    navItems = [
      { label: 'Dashboard Overview', href: '/admin', icon: LayoutDashboard },
      { label: 'Course Approvals', href: '/admin/courses', icon: BookOpen },
      { label: 'User Directory', href: '/admin/users', icon: Users },
      { label: 'Categories', href: '/admin/categories', icon: ShieldCheck },
      { label: 'Platform Analytics', href: '/admin/analytics', icon: BarChart3 },
      { label: 'Settings', href: '/profile', icon: Settings },
    ];
  }

  const SidebarContent = () => (
    <div className="flex flex-col h-full bg-slate-900 text-slate-300">
      {/* Brand */}
      <div className="p-6 border-b border-slate-800">
        <Link to="/" className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white block">
              Learn<span className="text-indigo-400">Sphere</span>
            </span>
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider block">
              {dashboardTitle}
            </span>
          </div>
        </Link>
      </div>

      {/* Nav List */}
      <div className="flex-1 py-6 px-4 space-y-1.5 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setMobileSidebarOpen(false)}
              className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/70'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>

      {/* Demo Switcher Widget */}
      <div className="px-4 py-3 mx-4 my-2 rounded-xl bg-slate-800/80 border border-slate-700/60 text-xs">
        <div className="flex items-center gap-1.5 text-amber-400 font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Switch Demo Role</span>
        </div>
        <div className="grid grid-cols-3 gap-1">
          <button
            onClick={() => loginAsDemo('student')}
            className={`py-1 rounded text-[11px] font-medium transition-colors ${
              user.role === 'student' ? 'bg-indigo-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
            }`}
          >
            Student
          </button>
          <button
            onClick={() => loginAsDemo('instructor')}
            className={`py-1 rounded text-[11px] font-medium transition-colors ${
              user.role === 'instructor' ? 'bg-indigo-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
            }`}
          >
            Teacher
          </button>
          <button
            onClick={() => loginAsDemo('admin')}
            className={`py-1 rounded text-[11px] font-medium transition-colors ${
              user.role === 'admin' ? 'bg-indigo-600 text-white' : 'bg-slate-700 hover:bg-slate-600 text-slate-200'
            }`}
          >
            Admin
          </button>
        </div>
      </div>

      {/* User Card & Logout */}
      <div className="p-4 border-t border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-bold text-xs flex items-center justify-center shrink-0">
            {user.first_name ? user.first_name[0] : user.email[0].toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">
              {user.full_name || user.username}
            </p>
            <p className="text-[11px] text-slate-400 truncate">{user.email}</p>
          </div>
        </div>
        <button
          onClick={logout}
          className="p-2 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors shrink-0"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0 fixed inset-y-0 left-0 z-30">
        <SidebarContent />
      </aside>

      {/* Mobile Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-72 max-w-[80vw] z-50">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 lg:pl-64 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 py-3.5 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100"
            >
              <Menu className="w-5 h-5" />
            </button>
            <Link
              to="/courses"
              className="hidden sm:flex items-center gap-1.5 text-xs font-semibold text-indigo-600 hover:text-indigo-700 bg-indigo-50 px-3 py-1.5 rounded-full"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Browse Catalog</span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            <span className="hidden md:inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-100 text-slate-700 border border-slate-200">
              Role: {user.role}
            </span>
            <Link
              to="/"
              className="text-xs font-semibold text-slate-600 hover:text-indigo-600 px-3 py-1.5 rounded-lg hover:bg-slate-100 transition-colors"
            >
              Public Home
            </Link>
          </div>
        </header>

        {/* Content Body */}
        <main className="flex-1 p-4 sm:p-8 max-w-7xl mx-auto w-full">
          {children}
        </main>
      </div>
    </div>
  );
};
