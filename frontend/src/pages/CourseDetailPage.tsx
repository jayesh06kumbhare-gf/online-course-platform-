import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star, Clock, BookOpen, Users, Award, CheckCircle2,
  ChevronDown, ChevronUp, Play, Lock, ShieldCheck, Heart,
  Share2, ArrowRight, MessageSquare, AlertCircle, CreditCard
} from 'lucide-react';
import { Course, Review, Enrollment } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const CourseDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isEnrolled, setIsEnrolled] = useState(false);
  const [loading, setLoading] = useState(true);
  const [expandedModules, setExpandedModules] = useState<Record<number, boolean>>({});
  const [previewVideoOpen, setPreviewVideoOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  // Review Form state
  const [userRating, setUserRating] = useState(5);
  const [userComment, setUserComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);
  const [reviewError, setReviewError] = useState('');

  useEffect(() => {
    if (!slug) return;
    const fetchCourseData = async () => {
      setLoading(true);
      try {
        const [courseData, reviewData] = await Promise.all([
          api.getCourseDetail(slug),
          api.getCourseReviews(slug).catch(() => ({ results: [] })),
        ]);
        setCourse(courseData);
        setReviews((reviewData as any).results || reviewData || []);

        // Expand first module by default
        if (courseData.modules && courseData.modules.length > 0) {
          setExpandedModules({ [courseData.modules[0].id]: true });
        }

        // Check if student is enrolled
        if (user) {
          const enrollCheck = await api.checkEnrollment(slug).catch(() => ({ enrolled: false }));
          setIsEnrolled(enrollCheck.enrolled);
        }
      } catch (err) {
        console.error('Failed to load course details:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourseData();
  }, [slug, user]);

  const toggleModule = (id: number) => {
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleEnrollClick = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (isEnrolled) {
      navigate(`/learn/${course?.slug}`);
      return;
    }
    if (course?.is_free) {
      executeEnrollment();
    } else {
      setPaymentModalOpen(true);
    }
  };

  const executeEnrollment = async () => {
    if (!course) return;
    setEnrolling(true);
    try {
      await api.enrollCourse(course.id);
      setIsEnrolled(true);
      setPaymentModalOpen(false);
      navigate(`/learn/${course.slug}`);
    } catch (err: any) {
      alert(err.error || 'Failed to complete enrollment.');
    } finally {
      setEnrolling(false);
    }
  };

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course || !userComment.trim()) return;
    setSubmittingReview(true);
    setReviewError('');
    try {
      const newReview = await api.createReview(course.slug, {
        rating: userRating,
        comment: userComment.trim(),
      });
      setReviews((prev) => [newReview, ...prev]);
      setUserComment('');
    } catch (err: any) {
      setReviewError(err.comment || err.error || 'You have already submitted a review or are not eligible.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading course curriculum...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Course not found</h2>
        <p className="text-slate-500 text-sm mb-6">The course you are looking for does not exist or has been removed.</p>
        <Link to="/courses" className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-sm font-semibold">
          Back to Course Catalog
        </Link>
      </div>
    );
  }

  const thumbnail = course.thumbnail_display || course.thumbnail_url || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800';

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      
      {/* 1. Header Banner */}
      <section className="bg-slate-900 text-white py-12 lg:py-16 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
            
            {/* Banner Left Details */}
            <div className="lg:col-span-2 space-y-4">
              
              {/* Category & Level Badges */}
              <div className="flex flex-wrap items-center gap-2">
                {course.category_name && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-400/20">
                    {course.category_name}
                  </span>
                )}
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                  {course.level} Level
                </span>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider bg-slate-800 text-slate-300 border border-slate-700">
                  {course.language}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight text-white">
                {course.title}
              </h1>

              <p className="text-base sm:text-lg text-slate-300 leading-relaxed max-w-2xl">
                {course.subtitle}
              </p>

              {/* Rating & Stats */}
              <div className="flex flex-wrap items-center gap-5 text-xs text-slate-300 pt-2">
                <div className="flex items-center gap-1.5 text-amber-400 font-bold">
                  <Star className="w-4 h-4 fill-amber-400" />
                  <span className="text-sm">{Number(course.average_rating || 0).toFixed(1)}</span>
                  <span className="text-slate-400 font-normal">({course.total_reviews} reviews)</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <Users className="w-4 h-4" />
                  <span>{course.total_students} students enrolled</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-4 h-4" />
                  <span>{course.duration_hours} total hours</span>
                </div>
                <div className="flex items-center gap-1 text-slate-400">
                  <BookOpen className="w-4 h-4" />
                  <span>{course.total_lessons} lessons</span>
                </div>
              </div>

              {/* Instructor signature */}
              <div className="flex items-center gap-3 pt-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-bold text-sm flex items-center justify-center">
                  {course.instructor_name ? course.instructor_name[0] : 'I'}
                </div>
                <div>
                  <p className="text-xs text-slate-400">Created by</p>
                  <p className="text-sm font-bold text-white">{course.instructor_name}</p>
                </div>
              </div>

            </div>

            {/* Desktop Sticky Purchase Card Anchor (shown on lg) */}
            <div className="lg:col-span-1 hidden lg:block" />

          </div>
        </div>
      </section>

      {/* 2. Main Content & Sticky Purchase Box Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          
          {/* Left Column: Curriculum & Details */}
          <div className="lg:col-span-2 space-y-10">
            
            {/* What you'll learn */}
            {course.learning_outcomes && course.learning_outcomes.length > 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
                <h2 className="text-xl font-bold text-slate-900 mb-5 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  <span>What You Will Learn</span>
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {course.learning_outcomes.map((outcome, idx) => (
                    <div key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-700">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span className="leading-snug">{outcome}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Curriculum Accordion */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">Course Curriculum</h2>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {course.modules?.length || 0} modules • {course.total_lessons} lessons • {course.duration_hours}h total length
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {course.modules && course.modules.map((module) => {
                  const isExpanded = expandedModules[module.id];
                  return (
                    <div
                      key={module.id}
                      className="border border-slate-200 rounded-xl overflow-hidden transition-all"
                    >
                      <button
                        onClick={() => toggleModule(module.id)}
                        className="w-full px-5 py-4 bg-slate-50/80 hover:bg-slate-100/80 text-left flex items-center justify-between gap-4 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-lg bg-indigo-50 text-indigo-700 font-bold text-xs flex items-center justify-center shrink-0">
                            {module.order}
                          </span>
                          <div>
                            <h3 className="font-bold text-slate-900 text-sm">{module.title}</h3>
                            {module.description && (
                              <p className="text-xs text-slate-500 mt-0.5 line-clamp-1">
                                {module.description}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-xs text-slate-500 font-medium">
                            {module.lessons?.length || 0} lessons
                          </span>
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-slate-400" />
                          ) : (
                            <ChevronDown className="w-4 h-4 text-slate-400" />
                          )}
                        </div>
                      </button>

                      {/* Lesson list under module */}
                      {isExpanded && (
                        <div className="divide-y divide-slate-100 bg-white">
                          {module.lessons && module.lessons.map((lesson) => (
                            <div
                              key={lesson.id}
                              className="px-5 py-3.5 flex items-center justify-between gap-4 text-xs text-slate-700 hover:bg-slate-50/50 transition-colors"
                            >
                              <div className="flex items-center gap-3 min-w-0">
                                {lesson.is_free_preview ? (
                                  <Play className="w-4 h-4 text-indigo-600 shrink-0" />
                                ) : (
                                  <Lock className="w-4 h-4 text-slate-400 shrink-0" />
                                )}
                                <span className="font-medium text-slate-900 truncate">
                                  {lesson.title}
                                </span>
                              </div>
                              <div className="flex items-center gap-3 shrink-0">
                                {lesson.is_free_preview && (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                                    Preview
                                  </span>
                                )}
                                <span className="text-slate-400 font-mono">
                                  {lesson.duration_minutes}m
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Course Description */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900 mb-4">Description</h2>
              <div className="prose prose-sm max-w-none text-slate-700 leading-relaxed space-y-4">
                <p>{course.description}</p>
              </div>

              {/* Requirements */}
              {course.requirements && course.requirements.length > 0 && (
                <div className="mt-8 pt-6 border-t border-slate-100">
                  <h3 className="font-bold text-slate-900 text-sm mb-3">Requirements</h3>
                  <ul className="space-y-2 list-disc list-inside text-xs sm:text-sm text-slate-600">
                    {course.requirements.map((req, i) => (
                      <li key={i}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* Instructor Spotlight */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
              <h2 className="text-xl font-bold text-slate-900 mb-6">About the Instructor</h2>
              <div className="flex flex-col sm:flex-row gap-5 items-start">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-extrabold text-xl flex items-center justify-center shrink-0 shadow-md">
                  {course.instructor_name ? course.instructor_name[0] : 'I'}
                </div>
                <div className="space-y-2">
                  <h3 className="text-lg font-bold text-slate-900">{course.instructor_name}</h3>
                  <p className="text-xs font-semibold text-indigo-600">Senior Curriculum Director & Educator</p>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {course.instructor?.bio || 'Experienced engineering leader dedicated to practical, career-ready education and hands-on skill building.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                  <span>Student Feedback ({reviews.length})</span>
                </h2>
                <div className="text-sm font-bold text-slate-900">
                  {Number(course.average_rating || 0).toFixed(1)} / 5.0
                </div>
              </div>

              {/* Leave Review Form (If enrolled) */}
              {isEnrolled && (
                <form onSubmit={handleReviewSubmit} className="mb-8 p-5 bg-slate-50 rounded-xl border border-slate-200">
                  <h4 className="font-bold text-slate-900 text-sm mb-3">Leave a Review</h4>
                  {reviewError && (
                    <div className="p-3 mb-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-lg">
                      {reviewError}
                    </div>
                  )}
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-xs font-semibold text-slate-600">Your Rating:</span>
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <button
                          key={s}
                          type="button"
                          onClick={() => setUserRating(s)}
                          className="p-1 focus:outline-none"
                        >
                          <Star
                            className={`w-5 h-5 ${
                              s <= userRating
                                ? 'fill-amber-400 text-amber-400'
                                : 'text-slate-300'
                            }`}
                          />
                        </button>
                      ))}
                    </div>
                  </div>
                  <textarea
                    rows={3}
                    placeholder="Share what you learned and your experience with this course..."
                    value={userComment}
                    onChange={(e) => setUserComment(e.target.value)}
                    required
                    className="w-full p-3 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  />
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="mt-3 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl transition-colors"
                  >
                    {submittingReview ? 'Submitting...' : 'Post Review'}
                  </button>
                </form>
              )}

              {/* Reviews List */}
              <div className="space-y-4">
                {reviews.length === 0 ? (
                  <p className="text-xs text-slate-500 py-4 text-center">
                    No reviews yet. Be the first enrolled student to review this course!
                  </p>
                ) : (
                  reviews.map((rev) => (
                    <div key={rev.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-slate-900 text-xs">{rev.student_name}</span>
                        <div className="flex items-center text-amber-400">
                          {[...Array(rev.rating)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-current" />
                          ))}
                        </div>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed">{rev.comment}</p>
                      <span className="text-[10px] text-slate-400 block">
                        {new Date(rev.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

          </div>

          {/* Right Column: Sticky Pricing & Enrollment Card */}
          <div className="lg:col-span-1">
            <div className="lg:sticky lg:top-24 bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden p-6 space-y-6">
              
              {/* Media Preview Box */}
              <div className="relative aspect-[16/9] w-full rounded-xl overflow-hidden bg-slate-900 group">
                <img
                  src={thumbnail}
                  alt={course.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                />
                <button
                  onClick={() => setPreviewVideoOpen(true)}
                  className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-white/90 backdrop-blur-md flex items-center justify-center text-indigo-600 shadow-xl hover:scale-110 transition-transform"
                  aria-label="Preview Course Video"
                >
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </button>
                <div className="absolute bottom-2 left-2 px-2 py-1 rounded bg-black/70 text-white text-[10px] font-semibold">
                  Course Preview
                </div>
              </div>

              {/* Pricing Display */}
              <div className="flex items-baseline justify-between">
                <div>
                  <span className="text-xs text-slate-400 font-medium">Full Tuition</span>
                  <div className="text-3xl font-extrabold text-slate-900">
                    {course.is_free ? (
                      <span className="text-emerald-600">Free</span>
                    ) : (
                      <span>${Number(course.price).toFixed(2)}</span>
                    )}
                  </div>
                </div>
                {!course.is_free && (
                  <span className="px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700">
                    Lifetime Access
                  </span>
                )}
              </div>

              {/* Main Action Button */}
              {isEnrolled ? (
                <Link
                  to={`/learn/${course.slug}`}
                  className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-emerald-600/20 text-center flex items-center justify-center gap-2 transition-all"
                >
                  <span>Continue Learning</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <button
                  onClick={handleEnrollClick}
                  disabled={enrolling}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-600/30 text-center flex items-center justify-center gap-2 transition-all"
                >
                  {enrolling ? (
                    'Enrolling...'
                  ) : course.is_free ? (
                    <>
                      <span>Enroll in Free Course</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Enroll Now • ${Number(course.price).toFixed(2)}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              )}

              {/* Feature Checklist */}
              <div className="pt-4 border-t border-slate-100 space-y-3 text-xs text-slate-600">
                <div className="flex items-center gap-2.5">
                  <Award className="w-4 h-4 text-indigo-600" />
                  <span>Verifiable Certificate of Completion</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-indigo-600" />
                  <span>{course.duration_hours} hours on-demand curriculum</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <BookOpen className="w-4 h-4 text-indigo-600" />
                  <span>{course.total_lessons} structured modules & lessons</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Interactive quizzes and progress tracking</span>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>

      {/* Video Preview Modal */}
      {previewVideoOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-xs p-4">
          <div className="relative w-full max-w-3xl bg-slate-900 rounded-2xl overflow-hidden shadow-2xl">
            <div className="p-4 flex items-center justify-between border-b border-slate-800 text-white text-sm font-bold">
              <span>Course Preview: {course.title}</span>
              <button
                onClick={() => setPreviewVideoOpen(false)}
                className="text-slate-400 hover:text-white px-2 py-1 text-sm font-mono"
              >
                ✕ Close
              </button>
            </div>
            <div className="aspect-[16/9] w-full bg-black">
              {course.preview_video_url && course.preview_video_url.includes('youtube.com') ? (
                <iframe
                  src={course.preview_video_url.replace('watch?v=', 'embed/')}
                  title="Course Preview"
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center">
                  <Play className="w-12 h-12 mb-3 text-indigo-400" />
                  <p className="text-sm font-semibold text-white">Preview Media Ready</p>
                  <p className="text-xs text-slate-400 mt-1">Enroll in the course to access all full HD lectures.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Payment Gateway Integration Interface Modal */}
      {paymentModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">Payment Checkout</h3>
                  <p className="text-xs text-slate-500">Secure Course Enrollment</p>
                </div>
              </div>
              <button
                onClick={() => setPaymentModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <div className="p-6 space-y-4">
              {/* Development Environment Notice */}
              <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div className="leading-relaxed">
                  <span className="font-bold block">Development Sandbox Checkout:</span>
                  This is a simulated payment gateway interface designed for EdTech demonstration. No real bank charges will occur.
                </div>
              </div>

              {/* Order Summary */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs space-y-2">
                <div className="flex justify-between font-medium text-slate-700">
                  <span className="truncate max-w-[220px]">{course.title}</span>
                  <span>${Number(course.price).toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Taxes & Processing</span>
                  <span>$0.00</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-bold text-slate-900 text-sm">
                  <span>Total Amount</span>
                  <span className="text-indigo-600">${Number(course.price).toFixed(2)}</span>
                </div>
              </div>

              {/* Demo card details */}
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Card Number</label>
                  <input
                    type="text"
                    disabled
                    value="•••• •••• •••• 4242 (Demo Card)"
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 font-mono"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Expires</label>
                    <input
                      type="text"
                      disabled
                      value="12/28"
                      className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 font-mono"
                    />
                  </div>
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">CVC</label>
                    <input
                      type="text"
                      disabled
                      value="•••"
                      className="w-full px-3 py-2 bg-slate-100 border border-slate-200 rounded-lg text-slate-600 font-mono"
                    />
                  </div>
                </div>
              </div>

              <button
                onClick={executeEnrollment}
                disabled={enrolling}
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 mt-2"
              >
                {enrolling ? 'Processing...' : `Confirm & Enroll ($${Number(course.price).toFixed(2)})`}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
