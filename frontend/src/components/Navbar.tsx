import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  BookOpen, Search, Bell, User, LogOut, ChevronDown,
  LayoutDashboard, Award, Bookmark, Settings, ShieldCheck,
  GraduationCap, Menu, X, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Notification } from '../types';

export const Navbar: React.FC = () => {
  const { user, logout, loginAsDemo } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [searchQuery, setSearchQuery] = useState('');
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [notifDropdownOpen, setNotifDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (user) {
      api.getNotifications()
        .then((res: any) => {
          const list: Notification[] = res.results || res || [];
          setNotifications(list);
          setUnreadCount(list.filter(n => !n.is_read).length);
        })
        .catch(() => {});
    }
  }, [user, location.pathname]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
      setMobileMenuOpen(false);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch {}
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 via-slate-800 to-indigo-950 bg-clip-text text-transparent">
                  Learn<span className="text-indigo-600">Sphere</span>
                </span>
                <span className="text-[10px] font-medium tracking-wider uppercase text-slate-600 -mt-1">
                  Online Learning
                </span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-1 font-medium text-sm text-slate-600">
              <Link
                to="/courses"
                className={`px-3 py-2 rounded-lg transition-colors hover:text-indigo-600 hover:bg-slate-50 ${
                  location.pathname === '/courses' ? 'text-indigo-600 font-semibold bg-indigo-50/50' : ''
                }`}
              >
                Explore Courses
              </Link>
              <Link
                to="/about"
                className={`px-3 py-2 rounded-lg transition-colors hover:text-indigo-600 hover:bg-slate-50 ${
                  location.pathname === '/about' ? 'text-indigo-600 font-semibold bg-indigo-50/50' : ''
                }`}
              >
                About
              </Link>
              <Link
                to="/contact"
                className={`px-3 py-2 rounded-lg transition-colors hover:text-indigo-600 hover:bg-slate-50 ${
                  location.pathname === '/contact' ? 'text-indigo-600 font-semibold bg-indigo-50/50' : ''
                }`}
              >
                Support
              </Link>
            </nav>
          </div>

          {/* Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="w-4 h-4 text-slate-600 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search courses, skills, technologies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-slate-100/80 border border-slate-200/80 rounded-full text-sm placeholder:text-slate-600 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
              />
            </form>
          </div>

          {/* Right Action Icons / Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Demo Switcher Quick Pill */}
            <div className="hidden xl:flex items-center gap-1.5 px-2.5 py-1 bg-amber-50 border border-amber-200/70 rounded-full text-xs font-medium text-amber-800">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Demo:</span>
              <button
                onClick={() => loginAsDemo('student')}
                className="hover:underline text-indigo-700 font-semibold px-1"
                title="Login as Alex Rivera (Student)"
              >
                Student
              </button>
              <span className="text-amber-300">•</span>
              <button
                onClick={() => loginAsDemo('instructor')}
                className="hover:underline text-indigo-700 font-semibold px-1"
                title="Login as Marcus Vance (Instructor)"
              >
                Instructor
              </button>
              <span className="text-amber-300">•</span>
              <button
                onClick={() => loginAsDemo('admin')}
                className="hover:underline text-indigo-700 font-semibold px-1"
                title="Login as Platform Admin"
              >
                Admin
              </button>
            </div>

            {user ? (
              <>
                {/* Notifications Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setNotifDropdownOpen(!notifDropdownOpen);
                      setProfileDropdownOpen(false);
                    }}
                    className="relative p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                    aria-label="Notifications"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-rose-500 rounded-full ring-2 ring-white animate-pulse" />
                    )}
                  </button>

                  {notifDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 py-3 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="flex items-center justify-between px-4 pb-2 border-b border-slate-100">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-slate-900 text-sm">Notifications</h4>
                          {unreadCount > 0 && (
                            <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-50 text-indigo-600 rounded-full">
                              {unreadCount} new
                            </span>
                          )}
                        </div>
                        {unreadCount > 0 && (
                          <button
                            onClick={handleMarkAllRead}
                            className="text-xs text-indigo-600 hover:underline font-medium"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto divide-y divide-slate-50">
                        {notifications.length === 0 ? (
                          <div className="p-6 text-center text-sm text-slate-600">
                            No notifications yet
                          </div>
                        ) : (
                          notifications.slice(0, 5).map((n) => (
                            <div
                              key={n.id}
                              className={`p-3.5 text-xs transition-colors hover:bg-slate-50 ${
                                !n.is_read ? 'bg-indigo-50/30' : ''
                              }`}
                            >
                              <div className="font-semibold text-slate-900">{n.title}</div>
                              <div className="text-slate-600 mt-0.5 line-clamp-2">{n.message}</div>
                              <div className="text-[10px] text-slate-600 mt-1">
                                {new Date(n.created_at).toLocaleDateString()}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Menu Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      setProfileDropdownOpen(!profileDropdownOpen);
                      setNotifDropdownOpen(false);
                    }}
                    className="flex items-center gap-2 pl-2 pr-1 py-1 rounded-full border border-slate-200 hover:border-slate-300 transition-colors bg-white shadow-xs"
                  >
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-bold text-xs flex items-center justify-center">
                      {user.first_name ? user.first_name[0] : user.email[0].toUpperCase()}
                    </div>
                    <span className="hidden sm:inline-block text-xs font-semibold text-slate-700 max-w-[100px] truncate">
                      {user.first_name || user.username}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-600 mr-1" />
                  </button>

                  {profileDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
                      <div className="px-4 py-2.5 border-b border-slate-100">
                        <p className="text-xs text-slate-600">Signed in as</p>
                        <p className="text-sm font-semibold text-slate-900 truncate">{user.email}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider rounded-md bg-indigo-50 text-indigo-700">
                          {user.role}
                        </span>
                      </div>

                      <div className="py-1 text-sm text-slate-700">
                        {user.role === 'student' && (
                          <>
                            <Link
                              to="/dashboard"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 transition-colors"
                            >
                              <LayoutDashboard className="w-4 h-4 text-slate-600" />
                              <span>Student Dashboard</span>
                            </Link>
                            <Link
                              to="/my-learning"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 transition-colors"
                            >
                              <GraduationCap className="w-4 h-4 text-slate-600" />
                              <span>My Learning</span>
                            </Link>
                            <Link
                              to="/certificates"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 transition-colors"
                            >
                              <Award className="w-4 h-4 text-slate-600" />
                              <span>Certificates</span>
                            </Link>
                            <Link
                              to="/wishlist"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 transition-colors"
                            >
                              <Bookmark className="w-4 h-4 text-slate-600" />
                              <span>Wishlist</span>
                            </Link>
                          </>
                        )}

                        {user.role === 'instructor' && (
                          <>
                            <Link
                              to="/instructor"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 transition-colors"
                            >
                              <LayoutDashboard className="w-4 h-4 text-slate-600" />
                              <span>Instructor Dashboard</span>
                            </Link>
                            <Link
                              to="/instructor/courses"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 transition-colors"
                            >
                              <BookOpen className="w-4 h-4 text-slate-600" />
                              <span>Manage Courses</span>
                            </Link>
                          </>
                        )}

                        {user.role === 'admin' && (
                          <>
                            <Link
                              to="/admin"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 transition-colors"
                            >
                              <ShieldCheck className="w-4 h-4 text-slate-600" />
                              <span>Admin Console</span>
                            </Link>
                            <Link
                              to="/admin/courses"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 transition-colors"
                            >
                              <BookOpen className="w-4 h-4 text-slate-600" />
                              <span>Course Approvals</span>
                            </Link>
                            <Link
                              to="/admin/users"
                              onClick={() => setProfileDropdownOpen(false)}
                              className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 transition-colors"
                            >
                              <User className="w-4 h-4 text-slate-600" />
                              <span>User Management</span>
                            </Link>
                          </>
                        )}

                        <Link
                          to="/profile"
                          onClick={() => setProfileDropdownOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 hover:bg-slate-50 transition-colors"
                        >
                          <Settings className="w-4 h-4 text-slate-600" />
                          <span>Settings & Profile</span>
                        </Link>
                      </div>

                      <div className="pt-1 mt-1 border-t border-slate-100">
                        <button
                          onClick={() => {
                            setProfileDropdownOpen(false);
                            logout();
                          }}
                          className="flex items-center gap-2.5 w-full text-left px-4 py-2 text-sm text-rose-600 hover:bg-rose-50 transition-colors font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-3.5 py-2 text-sm font-semibold text-slate-700 hover:text-indigo-600 transition-colors"
                >
                  Log In
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-xs transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile menu trigger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 bg-white px-4 py-4 space-y-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <Search className="w-4 h-4 text-slate-600 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-100 rounded-lg text-sm focus:outline-none"
            />
          </form>

          <div className="flex flex-col space-y-1 font-medium text-slate-700 pt-2">
            <Link
              to="/courses"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              Explore Courses
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              About LearnSphere
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="px-3 py-2 rounded-lg hover:bg-slate-50"
            >
              Support
            </Link>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <span className="text-xs font-semibold text-slate-600 uppercase">Quick Demo Access</span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => { loginAsDemo('student'); setMobileMenuOpen(false); }}
                className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded-lg text-xs font-semibold"
              >
                Student Demo
              </button>
              <button
                onClick={() => { loginAsDemo('instructor'); setMobileMenuOpen(false); }}
                className="px-3 py-1.5 bg-violet-50 text-violet-700 rounded-lg text-xs font-semibold"
              >
                Instructor Demo
              </button>
              <button
                onClick={() => { loginAsDemo('admin'); setMobileMenuOpen(false); }}
                className="px-3 py-1.5 bg-amber-50 text-amber-800 rounded-lg text-xs font-semibold"
              >
                Admin Demo
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
