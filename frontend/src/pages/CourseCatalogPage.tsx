import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, BookOpen, X, SlidersHorizontal } from 'lucide-react';
import { Course, Category } from '../types';
import { api } from '../services/api';
import { CourseCard } from '../components/CourseCard';

export const CourseCatalogPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);

  // Filters from URL or state
  const search = searchParams.get('search') || '';
  const categorySlug = searchParams.get('category') || '';
  const level = searchParams.get('level') || '';
  const priceType = searchParams.get('price') || ''; // 'free' | 'paid' | ''
  const ordering = searchParams.get('ordering') || '-created_at';

  const [searchInput, setSearchInput] = useState(search);

  // Fetch categories once
  useEffect(() => {
    api.getCategories()
      .then((res: any) => {
        setCategories(res.results || res || []);
      })
      .catch(() => {});
  }, []);

  // Fetch filtered courses whenever params change
  useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);
      try {
        const params: Record<string, any> = {};
        if (search) params.search = search;
        if (categorySlug) params.category = categorySlug;
        if (level) params.level = level;
        if (priceType === 'free') params.is_free = true;
        if (priceType === 'paid') params.is_free = false;
        if (ordering) params.ordering = ordering;

        const res = await api.getCourses(params);
        setCourses(res.results || []);
        setTotalCount(res.count || (res.results ? res.results.length : 0));
      } catch (err) {
        console.error('Failed to fetch courses:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [search, categorySlug, level, priceType, ordering]);

  const updateParam = (key: string, val: string) => {
    const next = new URLSearchParams(searchParams);
    if (val) {
      next.set(key, val);
    } else {
      next.delete(key);
    }
    setSearchParams(next);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateParam('search', searchInput.trim());
  };

  const clearAllFilters = () => {
    setSearchInput('');
    setSearchParams({});
  };

  const hasActiveFilters = Boolean(search || categorySlug || level || priceType);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Explore Course Catalog
          </h1>
          <p className="text-slate-600 text-sm mt-1">
            Discover in-depth curricula, sharpen your skills, and earn industry-recognized credentials.
          </p>
        </div>

        {/* Search & Ordering Bar */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by title, keyword, technology..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-10 pr-20 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
            />
            <button
              type="submit"
              className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-lg transition-colors"
            >
              Search
            </button>
          </form>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
            <span className="text-xs font-semibold text-slate-500 whitespace-nowrap">Sort by:</span>
            <select
              value={ordering}
              onChange={(e) => updateParam('ordering', e.target.value)}
              className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            >
              <option value="-created_at">Newest First</option>
              <option value="-average_rating">Highest Rated</option>
              <option value="-total_students">Most Popular</option>
              <option value="price">Price: Low to High</option>
              <option value="-price">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs mb-8 space-y-4">
          
          {/* Categories */}
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Category
            </span>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => updateParam('category', '')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                  !categorySlug
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                All Categories
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => updateParam('category', cat.slug)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    categorySlug === cat.slug
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
            
            {/* Level */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Difficulty Level
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'All Levels', value: '' },
                  { label: 'Beginner', value: 'beginner' },
                  { label: 'Intermediate', value: 'intermediate' },
                  { label: 'Advanced', value: 'advanced' },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => updateParam('level', item.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      level === item.value
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Price */}
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
                Pricing
              </span>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: 'All', value: '' },
                  { label: 'Free Courses', value: 'free' },
                  { label: 'Paid Courses', value: 'paid' },
                ].map((item) => (
                  <button
                    key={item.label}
                    onClick={() => updateParam('price', item.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      priceType === item.value
                        ? 'bg-slate-900 text-white'
                        : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Reset Filters */}
          {hasActiveFilters && (
            <div className="pt-2 flex items-center justify-between border-t border-slate-100">
              <span className="text-xs text-slate-500 font-medium">
                Active filters applied
              </span>
              <button
                onClick={clearAllFilters}
                className="text-xs font-semibold text-rose-600 hover:text-rose-700 flex items-center gap-1"
              >
                <X className="w-3.5 h-3.5" />
                <span>Clear all filters</span>
              </button>
            </div>
          )}

        </div>

        {/* Results Counter */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-sm font-semibold text-slate-700">
            Showing <span className="text-indigo-600 font-bold">{courses.length}</span> of {totalCount} courses
          </p>
        </div>

        {/* Course Cards Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-96 rounded-2xl bg-slate-200 animate-pulse" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-12 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-4">
              <BookOpen className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">No courses found</h3>
            <p className="text-xs text-slate-500 mb-6">
              No courses matched your current filter criteria. Try clearing search filters or selecting another category.
            </p>
            <button
              onClick={clearAllFilters}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-colors"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
