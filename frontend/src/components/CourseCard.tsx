import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Clock, BookOpen, Bookmark, Heart, Users } from 'lucide-react';
import { Course } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface CourseCardProps {
  course: Course;
  onBookmarkToggle?: (courseId: number, isBookmarked: boolean) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onBookmarkToggle }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [isBookmarked, setIsBookmarked] = useState<boolean>(!!course.is_bookmarked);
  const [isBookmarking, setIsBookmarking] = useState(false);

  const handleBookmarkClick = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      navigate('/login');
      return;
    }

    try {
      setIsBookmarking(true);
      await api.toggleBookmark(course.id, isBookmarked);
      setIsBookmarked(!isBookmarked);
      if (onBookmarkToggle) {
        onBookmarkToggle(course.id, !isBookmarked);
      }
    } catch (err) {
      console.error('Failed to toggle bookmark:', err);
    } finally {
      setIsBookmarking(false);
    }
  };

  const levelColor = {
    beginner: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    intermediate: 'bg-blue-50 text-blue-700 border-blue-200',
    advanced: 'bg-purple-50 text-purple-700 border-purple-200',
    all: 'bg-slate-50 text-slate-700 border-slate-200',
  }[course.level] || 'bg-slate-50 text-slate-700 border-slate-200';

  const thumbnail =
    course.thumbnail_display ||
    course.thumbnail_url ||
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80';

  return (
    <div className="group relative flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-200 overflow-hidden">
      
      {/* Thumbnail Area */}
      <Link to={`/courses/${course.slug}`} className="relative block aspect-[16/9] w-full overflow-hidden bg-slate-100">
        <img
          src={thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent opacity-60" />
        
        {/* Category Pill */}
        {course.category_name && (
          <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur-md text-slate-800 shadow-xs">
            {course.category_name}
          </span>
        )}

        {/* Bookmark Heart Button */}
        <button
          onClick={handleBookmarkClick}
          disabled={isBookmarking}
          className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all shadow-xs ${
            isBookmarked
              ? 'bg-rose-500 text-white'
              : 'bg-white/85 text-slate-700 hover:text-rose-500 hover:bg-white'
          }`}
          aria-label="Bookmark Course"
        >
          <Heart className={`w-4 h-4 ${isBookmarked ? 'fill-current' : ''}`} />
        </button>

        {/* Level badge */}
        <span
          className={`absolute bottom-3 left-3 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider border backdrop-blur-md ${levelColor}`}
        >
          {course.level}
        </span>
      </Link>

      {/* Course Info */}
      <div className="flex flex-col flex-1 p-5">
        <div className="flex items-center gap-1.5 text-xs text-amber-500 font-bold mb-2">
          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
          <span>{Number(course.average_rating || 0).toFixed(1)}</span>
          <span className="text-slate-600 font-normal">
            ({course.total_reviews || 0} reviews)
          </span>
        </div>

        <Link to={`/courses/${course.slug}`} className="group-hover:text-indigo-600 transition-colors">
          <h3 className="font-bold text-slate-900 text-base line-clamp-2 leading-snug">
            {course.title}
          </h3>
        </Link>

        <p className="text-xs text-slate-600 line-clamp-2 mt-1.5 leading-relaxed">
          {course.subtitle}
        </p>

        {/* Instructor */}
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-xs text-slate-600">
          <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
            {course.instructor_name ? course.instructor_name[0] : 'I'}
          </div>
          <span className="truncate font-medium">{course.instructor_name}</span>
        </div>

        {/* Meta Stats & Price */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              {course.duration_hours}h
            </span>
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              {course.total_lessons} lessons
            </span>
          </div>

          <div className="font-extrabold text-sm text-slate-900">
            {course.is_free ? (
              <span className="text-emerald-600 uppercase tracking-wider text-xs">Free</span>
            ) : (
              <span>${Number(course.price).toFixed(2)}</span>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
