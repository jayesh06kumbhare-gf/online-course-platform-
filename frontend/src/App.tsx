import React from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { ProtectedRoute } from './components/ProtectedRoute';
import { DashboardLayout } from './components/DashboardLayout';

// Pages
import { HomePage } from './pages/HomePage';
import { CourseCatalogPage } from './pages/CourseCatalogPage';
import { CourseDetailPage } from './pages/CourseDetailPage';
import { CourseLearningPage } from './pages/CourseLearningPage';
import { QuizPage } from './pages/QuizPage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { MyLearningPage } from './pages/MyLearningPage';
import { CertificatesPage } from './pages/CertificatesPage';
import { WishlistPage } from './pages/WishlistPage';
import { ProfilePage } from './pages/ProfilePage';
import { InstructorDashboardPage } from './pages/InstructorDashboardPage';
import { InstructorCourseCreatePage } from './pages/InstructorCourseCreatePage';
import { InstructorCourseCurriculumPage } from './pages/InstructorCourseCurriculumPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { AdminCoursesPage } from './pages/AdminCoursesPage';
import { AdminUsersPage } from './pages/AdminUsersPage';
import { AdminCategoriesPage } from './pages/AdminCategoriesPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';

// Public layout wrapper with Navbar & Footer
const PublicLayout: React.FC = () => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);

// Protected Dashboard layout wrapper
const DashboardRouteLayout: React.FC = () => (
  <DashboardLayout>
    <Outlet />
  </DashboardLayout>
);

export const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          
          {/* Public Pages with Standard Header/Footer */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<CourseCatalogPage />} />
            <Route path="/courses/:slug" element={<CourseDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
          </Route>

          {/* Dedicated Learning Player & Quiz (No standard navbar for deep focus) */}
          <Route
            path="/learn/:slug"
            element={
              <ProtectedRoute>
                <CourseLearningPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quiz/:courseSlug"
            element={
              <ProtectedRoute>
                <QuizPage />
              </ProtectedRoute>
            }
          />

          {/* Student Dashboard Routes */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['student', 'admin', 'instructor']}>
                <DashboardRouteLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/dashboard" element={<StudentDashboardPage />} />
            <Route path="/my-learning" element={<MyLearningPage />} />
            <Route path="/certificates" element={<CertificatesPage />} />
            <Route path="/wishlist" element={<WishlistPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Instructor Studio Routes */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['instructor', 'admin']}>
                <DashboardRouteLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/instructor" element={<InstructorDashboardPage />} />
            <Route path="/instructor/courses" element={<InstructorDashboardPage />} />
            <Route path="/instructor/courses/new" element={<InstructorCourseCreatePage />} />
            <Route path="/instructor/courses/:courseId/curriculum" element={<InstructorCourseCurriculumPage />} />
            <Route path="/instructor/analytics" element={<InstructorDashboardPage />} />
            <Route path="/instructor/students" element={<InstructorDashboardPage />} />
          </Route>

          {/* Administrator Routes */}
          <Route
            element={
              <ProtectedRoute allowedRoles={['admin']}>
                <DashboardRouteLayout />
              </ProtectedRoute>
            }
          >
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/admin/courses" element={<AdminCoursesPage />} />
            <Route path="/admin/users" element={<AdminUsersPage />} />
            <Route path="/admin/categories" element={<AdminCategoriesPage />} />
            <Route path="/admin/analytics" element={<AdminDashboardPage />} />
          </Route>

          {/* 404 Fallback */}
          <Route
            path="*"
            element={
              <div className="min-h-screen flex flex-col items-center justify-center p-4 text-center bg-slate-50">
                <h1 className="text-4xl font-extrabold text-slate-900 mb-2">404 - Page Not Found</h1>
                <p className="text-slate-500 text-sm mb-6">The link you followed may be broken or the page has been removed.</p>
                <a href="/" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold">
                  Return Home
                </a>
              </div>
            }
          />

        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
