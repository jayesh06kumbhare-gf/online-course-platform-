import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Search, ArrowRight, BookOpen, Users, Award, Shield,
  CheckCircle2, Star, Sparkles, TrendingUp, Play, Laptop,
  Cpu, Code, BarChart2, Palette, Cloud, Lock
} from 'lucide-react';
import { Course, Category } from '../types';
import { api } from '../services/api';
import { CourseCard } from '../components/CourseCard';
import { useAuth } from '../context/AuthContext';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [featuredCourses, setFeaturedCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [coursesRes, catsRes] = await Promise.all([
          api.getFeaturedCourses(),
          api.getCategories(),
        ]);
        const courseList = (coursesRes as any).results || coursesRes || [];
        const catList = (catsRes as any).results || catsRes || [];
        setFeaturedCourses(courseList.slice(0, 6));
        setCategories(catList.slice(0, 6));
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/courses?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const categoryIcons: Record<string, React.ElementType> = {
    'web-development': Code,
    'artificial-intelligence': Cpu,
    'data-science': BarChart2,
    'ui-ux-design': Palette,
    'cloud-devops': Cloud,
    'cybersecurity': Lock,
  };

  return (
    <div className="flex flex-col min-h-screen">
      
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 text-white pt-16 sm:pt-24 pb-20 sm:pb-32">
        {/* Subtle decorative glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/15 blur-[120px] rounded-full pointer-events-none" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-400/20 text-indigo-300 text-xs font-semibold mb-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span>Next-Generation Career Skills & Certification</span>
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight max-w-4xl mx-auto leading-[1.1]">
            Learn New Skills. <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-violet-400 bg-clip-text text-transparent">
              Build Your Future.
            </span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Discover practical courses, learn at your own pace, and turn your ambitions into real-world skills taught by top industry engineering leaders.
          </p>

          {/* Search bar inside Hero */}
          <form onSubmit={handleSearch} className="mt-8 max-w-xl mx-auto relative">
            <div className="flex items-center bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-1.5 shadow-2xl focus-within:bg-white/15 focus-within:border-indigo-400 transition-all">
              <Search className="w-5 h-5 text-slate-400 ml-3 shrink-0" />
              <input
                type="text"
                placeholder="What skill do you want to master today?"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-0 px-3 py-2.5 text-sm text-white placeholder:text-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-semibold rounded-xl shadow-md transition-colors shrink-0"
              >
                Search
              </button>
            </div>
          </form>

          {/* CTAs */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/courses"
              className="px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm shadow-xl shadow-indigo-600/30 hover:-translate-y-0.5 transition-all flex items-center gap-2"
            >
              <span>Explore All Courses</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to={user ? "/dashboard" : "/register?role=instructor"}
              className="px-7 py-3.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-bold text-sm backdrop-blur-xs transition-colors"
            >
              Become an Instructor
            </Link>
          </div>

          {/* Proof metrics */}
          <div className="mt-14 pt-10 border-t border-white/10 grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-4xl mx-auto text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">50,000+</div>
              <div className="text-xs text-slate-400 mt-0.5 font-medium">Active Learners</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">100+</div>
              <div className="text-xs text-slate-400 mt-0.5 font-medium">Expert-Led Courses</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">96%</div>
              <div className="text-xs text-slate-400 mt-0.5 font-medium">Completion Satisfaction</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white">Verified</div>
              <div className="text-xs text-slate-400 mt-0.5 font-medium">Digital Certificates</div>
            </div>
          </div>

        </div>
      </section>

      {/* 2. Popular Learning Categories */}
      <section className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Explore Topics
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Popular Learning Categories
              </h2>
            </div>
            <Link
              to="/courses"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
            >
              <span>View all categories</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((cat) => {
              const Icon = categoryIcons[cat.slug] || Code;
              return (
                <Link
                  key={cat.id}
                  to={`/courses?category=${cat.slug}`}
                  className="group p-6 rounded-2xl border border-slate-200/80 hover:border-indigo-300 hover:shadow-xl hover:-translate-y-1 transition-all bg-white flex items-start gap-4"
                >
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${cat.color}15`, color: cat.color }}
                  >
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors text-base">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                    <span className="inline-block mt-3 text-xs font-semibold text-slate-600">
                      {cat.course_count} courses available
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3. Featured Courses */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-12">
            <div>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
                Top Rated
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
                Featured Courses
              </h2>
              <p className="text-slate-600 text-sm mt-1">
                Hand-picked, high-impact curricula taught by industry-recognized instructors.
              </p>
            </div>
            <Link
              to="/courses"
              className="text-sm font-semibold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group"
            >
              <span>Explore all courses</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div key={n} className="h-80 bg-slate-200 animate-pulse rounded-2xl" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredCourses.map((course) => (
                <CourseCard key={course.id} course={course} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 4. How LearnSphere Works */}
      <section className="py-20 bg-white border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Step-by-Step
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              How LearnSphere Works
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              A structured, human-centered learning model designed to take you from foundational curiosity to demonstrable skill mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
            
            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-600 font-extrabold text-lg flex items-center justify-center mb-4">
                1
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Discover Courses</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Filter by technical domain, difficulty level, and price to find the exact curriculum tailored to your goals.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-indigo-100 text-indigo-600 font-extrabold text-lg flex items-center justify-center mb-4">
                2
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Learn at Your Pace</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Watch curated lessons in our distraction-free learning player with instant resume-from-last-point capabilities.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-600 font-extrabold text-lg flex items-center justify-center mb-4">
                3
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Assess & Practice</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Validate your understanding through interactive module quizzes with instant automated score feedback.
              </p>
            </div>

            <div className="flex flex-col items-center text-center p-6 rounded-2xl bg-slate-50 border border-slate-100">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-600 font-extrabold text-lg flex items-center justify-center mb-4">
                4
              </div>
              <h3 className="font-bold text-slate-900 text-base mb-2">Earn Certificate</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Complete 100% of curriculum lessons to automatically generate your verifiable digital certificate with unique ID.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 5. Authentic Testimonials */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">
              Student Stories
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
              Loved by Ambitious Learners
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Here is what real students say after finishing their courses on LearnSphere.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm italic leading-relaxed">
                  "Marcus's Full-Stack Bootcamp explained JWT rotation and database indexing better than four years of university lectures. I landed my first front-end developer job two months after completing it."
                </p>
              </div>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-sm">
                  AR
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Alex Rivera</h4>
                  <p className="text-xs text-slate-500">Junior Full-Stack Engineer</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm italic leading-relaxed">
                  "Dr. Sarah Chen's PyTorch lessons broke down Transformer attention mechanisms so clearly. The code samples actually worked out of the box without deprecated package bugs."
                </p>
              </div>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-violet-100 text-violet-700 font-bold flex items-center justify-center text-sm">
                  PP
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Priya Patel</h4>
                  <p className="text-xs text-slate-500">Data & ML Analyst</p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-1 text-amber-400 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-current" />
                  ))}
                </div>
                <p className="text-slate-700 text-sm italic leading-relaxed">
                  "The UI/UX course by Elena helped me transition from pure graphic design into product design. The certificate with verifiable UUID gave my portfolio immediate credibility."
                </p>
              </div>
              <div className="flex items-center gap-3 mt-6 pt-4 border-t border-slate-100">
                <div className="w-10 h-10 rounded-full bg-pink-100 text-pink-700 font-bold flex items-center justify-center text-sm">
                  JL
                </div>
                <div>
                  <h4 className="font-bold text-slate-900 text-sm">Jordan Lee</h4>
                  <p className="text-xs text-slate-500">UI/UX Product Designer</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 6. Call To Action Banner */}
      <section className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 text-center">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Ready to Accelerate Your Career?
          </h2>
          <p className="mt-4 text-indigo-100 text-base max-w-2xl mx-auto leading-relaxed">
            Join thousands of students learning modern software development, artificial intelligence, cloud architecture, and product design today.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/courses"
              className="px-8 py-3.5 bg-white text-indigo-700 font-bold text-sm rounded-xl shadow-lg hover:bg-indigo-50 transition-colors"
            >
              Browse All Courses
            </Link>
            <Link
              to="/register"
              className="px-8 py-3.5 bg-indigo-700/60 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl border border-white/20 transition-colors"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
