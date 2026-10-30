import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  CheckCircle2, Circle, Play, ChevronLeft, ChevronRight,
  BookOpen, Award, Download, FileText, ExternalLink,
  HelpCircle, ArrowLeft, Menu, X, Sparkles, Check
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Course, Enrollment, Lesson, Module } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const CourseLearningPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [currentLesson, setCurrentLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [updatingProgress, setUpdatingProgress] = useState(false);

  useEffect(() => {
    if (!slug) return;
    const loadCurriculum = async () => {
      setLoading(true);
      try {
        const [courseData, enrollData] = await Promise.all([
          api.getCourseDetail(slug),
          api.getEnrollmentDetail(slug),
        ]);
        setCourse(courseData);
        setEnrollment(enrollData);

        // Determine current lesson: resume from last_accessed_lesson_id or first lesson
        const allLessons: Lesson[] = [];
        courseData.modules?.forEach((m) => m.lessons?.forEach((l) => allLessons.push(l)));

        let targetLesson = allLessons[0];
        if (enrollData.last_accessed_lesson_id) {
          const found = allLessons.find((l) => l.id === enrollData.last_accessed_lesson_id);
          if (found) targetLesson = found;
        }
        setCurrentLesson(targetLesson || null);
      } catch (err) {
        console.error('Failed to load learning player:', err);
        navigate(`/courses/${slug}`);
      } finally {
        setLoading(false);
      }
    };
    loadCurriculum();
  }, [slug, navigate]);

  // Check if a lesson is completed
  const isLessonCompleted = (lessonId: number): boolean => {
    if (!enrollment?.progress) return false;
    const p = enrollment.progress.find((item) => item.lesson_id === lessonId);
    return Boolean(p?.is_completed);
  };

  const handleToggleComplete = async (lesson: Lesson) => {
    if (!slug || !currentLesson) return;
    const completedNow = !isLessonCompleted(lesson.id);
    setUpdatingProgress(true);

    try {
      const res = await api.markLessonProgress(slug, lesson.id, completedNow, lesson.duration_minutes * 60);
      
      // Update local enrollment progress state
      setEnrollment((prev) => {
        if (!prev) return prev;
        const existing = prev.progress || [];
        const nextProgress = existing.filter((p) => p.lesson_id !== lesson.id);
        nextProgress.push({
          id: Date.now(),
          lesson_id: lesson.id,
          lesson_title: lesson.title,
          is_completed: completedNow,
          completed_at: completedNow ? new Date().toISOString() : undefined,
          watch_time_seconds: lesson.duration_minutes * 60,
        });

        // Trigger celebratory confetti if course reaches 100%
        if (res.completion_percentage >= 100) {
          confetti({
            particleCount: 120,
            spread: 70,
            origin: { y: 0.6 },
          });
        }

        return {
          ...prev,
          completion_percentage: res.completion_percentage,
          progress: nextProgress,
        };
      });
    } catch (err) {
      console.error('Failed to mark lesson:', err);
    } finally {
      setUpdatingProgress(false);
    }
  };

  // Flattened lesson list for navigation
  const allLessons: Lesson[] = [];
  course?.modules?.forEach((m) => m.lessons?.forEach((l) => allLessons.push(l)));
  const currentIndex = allLessons.findIndex((l) => l.id === currentLesson?.id);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < allLessons.length - 1 ? allLessons[currentIndex + 1] : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-400">Loading your learning studio...</p>
        </div>
      </div>
    );
  }

  if (!course || !currentLesson) return null;

  const isCurrentCompleted = isLessonCompleted(currentLesson.id);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      
      {/* 1. Player Top Header */}
      <header className="h-16 bg-slate-950 border-b border-slate-800 px-4 sm:px-6 flex items-center justify-between shrink-0 z-30">
        <div className="flex items-center gap-4 min-w-0">
          <Link
            to="/my-learning"
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            title="Back to My Learning"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>
          <div className="min-w-0">
            <h1 className="text-sm sm:text-base font-bold text-white truncate">
              {course.title}
            </h1>
            <p className="text-xs text-slate-400 truncate hidden sm:block">
              {currentLesson.title}
            </p>
          </div>
        </div>

        {/* Progress & Sidebar Toggle */}
        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-3 bg-slate-900 px-3.5 py-1.5 rounded-full border border-slate-800">
            <div className="w-24 bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-emerald-500 h-full transition-all duration-300"
                style={{ width: `${enrollment?.completion_percentage || 0}%` }}
              />
            </div>
            <span className="text-xs font-bold text-emerald-400">
              {Number(enrollment?.completion_percentage || 0).toFixed(0)}% Complete
            </span>
          </div>

          {/* If 100% complete, show certificate shortcut */}
          {Number(enrollment?.completion_percentage || 0) >= 100 && (
            <Link
              to="/certificates"
              className="px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold flex items-center gap-1.5 hover:bg-amber-500/20 transition-colors"
            >
              <Award className="w-3.5 h-3.5 text-amber-400" />
              <span>Certificate Ready</span>
            </Link>
          )}

          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
            aria-label="Toggle Curriculum Sidebar"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* 2. Main Content & Sidebar Layout */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* Left: Video / Lesson Player Area */}
        <main className="flex-1 flex flex-col overflow-y-auto bg-slate-950">
          
          {/* Media Player Screen */}
          <div className="w-full bg-black aspect-video max-h-[70vh] flex items-center justify-center relative">
            {currentLesson.video_url && currentLesson.video_url.includes('youtube.com') ? (
              <iframe
                src={currentLesson.video_url.replace('watch?v=', 'embed/')}
                title={currentLesson.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <div className="flex flex-col items-center justify-center p-8 text-center max-w-md">
                <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-4">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </div>
                <h3 className="font-bold text-white text-lg">{currentLesson.title}</h3>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">
                  Interactive video lesson stream. Read the lecture guide below and mark this lesson as completed when finished.
                </p>
              </div>
            )}
          </div>

          {/* Lesson Action Bar */}
          <div className="p-4 sm:p-6 bg-slate-900 border-b border-slate-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-400">
                Lesson {currentLesson.order}
              </span>
              <h2 className="text-lg sm:text-xl font-bold text-white mt-0.5">
                {currentLesson.title}
              </h2>
            </div>

            <div className="flex items-center gap-3">
              {/* Mark Complete Button */}
              <button
                onClick={() => handleToggleComplete(currentLesson)}
                disabled={updatingProgress}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-bold flex items-center gap-2 transition-all ${
                  isCurrentCompleted
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
                }`}
              >
                {isCurrentCompleted ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>Completed</span>
                  </>
                ) : (
                  <>
                    <Circle className="w-4 h-4" />
                    <span>Mark as Complete</span>
                  </>
                )}
              </button>

              {/* Prev / Next buttons */}
              <button
                disabled={!prevLesson}
                onClick={() => prevLesson && setCurrentLesson(prevLesson)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Previous Lesson"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                disabled={!nextLesson}
                onClick={() => nextLesson && setCurrentLesson(nextLesson)}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                title="Next Lesson"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Lesson Text Content & Resources */}
          <div className="p-6 sm:p-8 space-y-8 max-w-4xl">
            <div>
              <h3 className="text-base font-bold text-white mb-3">Lecture Notes & Concepts</h3>
              <div className="text-sm text-slate-300 leading-relaxed space-y-4 bg-slate-900/60 p-6 rounded-2xl border border-slate-800/80">
                <p>{currentLesson.content || 'Detailed notes and technical synthesis for this module.'}</p>
              </div>
            </div>

            {/* Resources Section */}
            {currentLesson.resources && currentLesson.resources.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                  <Download className="w-4 h-4 text-indigo-400" />
                  <span>Downloadable Learning Resources</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {currentLesson.resources.map((res, i) => (
                    <a
                      key={i}
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-850 flex items-center justify-between text-xs text-slate-300 transition-all group"
                    >
                      <div className="flex items-center gap-2.5 truncate">
                        <FileText className="w-4 h-4 text-indigo-400 shrink-0" />
                        <span className="truncate font-medium group-hover:text-white">{res.name}</span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-slate-500 group-hover:text-indigo-400 shrink-0" />
                    </a>
                  ))}
                </div>
              </div>
            )}

            {/* Quizzes shortcut */}
            <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-950/60 to-violet-950/60 border border-indigo-500/20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h4 className="font-bold text-white text-sm flex items-center gap-2">
                  <HelpCircle className="w-4 h-4 text-indigo-400" />
                  <span>Test Your Knowledge with Course Quizzes</span>
                </h4>
                <p className="text-xs text-slate-400 mt-1">
                  Reinforce your understanding and earn certification qualification points.
                </p>
              </div>
              <Link
                to={`/quiz/${course.slug}`}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl transition-colors shrink-0"
              >
                Take Course Quiz
              </Link>
            </div>

          </div>

        </main>

        {/* Right: Curriculum Sidebar */}
        {sidebarOpen && (
          <aside className="w-80 sm:w-96 bg-slate-900 border-l border-slate-800 flex flex-col shrink-0 overflow-y-auto">
            <div className="p-4 border-b border-slate-800 flex items-center justify-between">
              <h3 className="font-bold text-white text-sm">Course Curriculum</h3>
              <span className="text-xs text-slate-400">
                {allLessons.length} lessons
              </span>
            </div>

            <div className="flex-1 divide-y divide-slate-800/60">
              {course.modules && course.modules.map((module) => (
                <div key={module.id} className="py-2">
                  <div className="px-4 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    {module.title}
                  </div>
                  <div className="space-y-0.5">
                    {module.lessons && module.lessons.map((lesson) => {
                      const isActive = currentLesson.id === lesson.id;
                      const isDone = isLessonCompleted(lesson.id);
                      return (
                        <button
                          key={lesson.id}
                          onClick={() => setCurrentLesson(lesson)}
                          className={`w-full px-4 py-3 flex items-start gap-3 text-left transition-colors ${
                            isActive
                              ? 'bg-indigo-600/20 border-l-4 border-indigo-500 text-white'
                              : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                          }`}
                        >
                          <div className="mt-0.5 shrink-0">
                            {isDone ? (
                              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                            ) : (
                              <Circle className="w-4 h-4 text-slate-600" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className={`text-xs font-medium leading-snug line-clamp-2 ${isActive ? 'font-bold text-white' : ''}`}>
                              {lesson.title}
                            </p>
                            <span className="text-[10px] text-slate-500 font-mono mt-0.5 block">
                              {lesson.duration_minutes} min
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        )}

      </div>
    </div>
  );
};
