import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, Heart, BookOpen, Trash2 } from 'lucide-react';
import { api } from '../services/api';
import { Course } from '../types';
import { CourseCard } from '../components/CourseCard';

export const WishlistPage: React.FC = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchBookmarks = async () => {
    setLoading(true);
    try {
      const res: any = await api.getBookmarks();
      const list = res.results || res || [];
      setCourses(list.map((item: any) => ({ ...item.course, is_bookmarked: true })));
    } catch (err) {
      console.error('Failed to load wishlist:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookmarks();
  }, []);

  const handleBookmarkToggle = (courseId: number, isBookmarked: boolean) => {
    if (!isBookmarked) {
      setCourses((prev) => prev.filter((c) => c.id !== courseId));
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          My Saved Wishlist
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Courses you have bookmarked to enroll in later.
        </p>
      </div>

      {courses.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">Your wishlist is empty</h3>
          <p className="text-xs text-slate-500 mb-6">
            Click the heart icon on any course card in the catalog to save it here.
          </p>
          <Link
            to="/courses"
            className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
          >
            Explore Catalog
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <CourseCard
              key={course.id}
              course={course}
              onBookmarkToggle={handleBookmarkToggle}
            />
          ))}
        </div>
      )}
    </div>
  );
};
