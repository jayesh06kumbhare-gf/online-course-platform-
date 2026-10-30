import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, Plus, BookOpen, Play, CheckCircle2,
  Trash2, Send, Clock, FileText, ChevronDown, ChevronUp
} from 'lucide-react';
import { Course, Module, Lesson } from '../types';
import { api } from '../services/api';

export const InstructorCourseCurriculumPage: React.FC = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();

  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  // New Module Modal / Form state
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [moduleTitle, setModuleTitle] = useState('');
  const [moduleDesc, setModuleDesc] = useState('');

  // New Lesson Modal / Form state
  const [selectedModuleId, setSelectedModuleId] = useState<number | null>(null);
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDuration, setLessonDuration] = useState('15');
  const [lessonVideoUrl, setLessonVideoUrl] = useState('');
  const [lessonContent, setLessonContent] = useState('');
  const [isFreePreview, setIsFreePreview] = useState(false);

  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchCourseData = async () => {
    if (!courseId) return;
    try {
      // Fetch instructor course detail
      const data: any = await api.getInstructorCourses();
      const list: Course[] = data.results || data || [];
      const found = list.find((c) => c.id === Number(courseId));
      if (found) {
        // Fetch detailed course with modules
        const detailed = await api.getCourseDetail(found.slug);
        setCourse(detailed);
      }
    } catch (err) {
      console.error('Failed to load course for curriculum editing:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourseData();
  }, [courseId]);

  const handleAddModule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course || !moduleTitle.trim()) return;

    try {
      await api.addModule(course.id, {
        title: moduleTitle.trim(),
        description: moduleDesc.trim(),
        order: (course.modules?.length || 0) + 1,
      });
      setModuleTitle('');
      setModuleDesc('');
      setShowModuleModal(false);
      await fetchCourseData();
    } catch (err) {
      alert('Failed to add module.');
    }
  };

  const handleAddLesson = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course || !selectedModuleId || !lessonTitle.trim()) return;

    try {
      await api.addLesson(course.id, selectedModuleId, {
        title: lessonTitle.trim(),
        duration_minutes: Number(lessonDuration) || 10,
        video_url: lessonVideoUrl.trim() || 'https://www.youtube.com/watch?v=kqtD5dpn9C8',
        content: lessonContent.trim() || 'Lesson reading overview and technical concepts.',
        is_free_preview: isFreePreview,
        lesson_type: 'video',
      });
      setLessonTitle('');
      setLessonVideoUrl('');
      setLessonContent('');
      setSelectedModuleId(null);
      await fetchCourseData();
    } catch (err) {
      alert('Failed to add lesson.');
    }
  };

  const handleSubmitForReview = async () => {
    if (!course) return;
    setSubmittingReview(true);
    try {
      await api.submitCourseForReview(course.id);
      alert('Course submitted for administrator review successfully!');
      navigate('/instructor');
    } catch (err: any) {
      alert(err.error || 'Failed to submit course for review.');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) return null;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Header & Submit Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <Link
            to="/instructor"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Instructor Studio</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Curriculum Builder: {course.title}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Organize modules, upload lecture resources, and attach educational video content.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start">
          <button
            onClick={() => setShowModuleModal(true)}
            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Module</span>
          </button>
          <button
            onClick={handleSubmitForReview}
            disabled={submittingReview}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md flex items-center gap-2 transition-colors"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{submittingReview ? 'Submitting...' : 'Submit for Review'}</span>
          </button>
        </div>
      </div>

      {/* Modules & Lessons Tree */}
      <div className="space-y-4">
        {(!course.modules || course.modules.length === 0) ? (
          <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-md mx-auto">
            <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900 mb-1">No modules added yet</h3>
            <p className="text-xs text-slate-500 mb-6">
              Start building your curriculum by creating the first course module.
            </p>
            <button
              onClick={() => setShowModuleModal(true)}
              className="px-5 py-2.5 bg-indigo-600 text-white font-semibold text-xs rounded-xl shadow-xs"
            >
              Add Module 1
            </button>
          </div>
        ) : (
          course.modules.map((mod, modIdx) => (
            <div
              key={mod.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden"
            >
              {/* Module Header */}
              <div className="p-5 bg-slate-50 border-b border-slate-100 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-lg bg-indigo-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                    {modIdx + 1}
                  </span>
                  <div>
                    <h3 className="font-bold text-slate-900 text-sm">{mod.title}</h3>
                    {mod.description && (
                      <p className="text-xs text-slate-500 mt-0.5">{mod.description}</p>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => setSelectedModuleId(mod.id)}
                  className="px-3 py-1.5 bg-white border border-slate-200 hover:border-indigo-300 text-indigo-600 font-bold text-xs rounded-lg flex items-center gap-1 shadow-2xs transition-colors shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Lesson</span>
                </button>
              </div>

              {/* Lessons List under module */}
              <div className="divide-y divide-slate-100">
                {(!mod.lessons || mod.lessons.length === 0) ? (
                  <p className="text-xs text-slate-400 p-4 text-center">
                    No lessons in this module. Click "Add Lesson" above.
                  </p>
                ) : (
                  mod.lessons.map((les, lesIdx) => (
                    <div
                      key={les.id}
                      className="p-4 flex items-center justify-between text-xs text-slate-700 hover:bg-slate-50/50"
                    >
                      <div className="flex items-center gap-3">
                        <Play className="w-4 h-4 text-indigo-600 shrink-0" />
                        <div>
                          <span className="font-semibold text-slate-900 block">{les.title}</span>
                          <span className="text-[10px] text-slate-400 font-mono">
                            {les.duration_minutes} min • {les.is_free_preview ? 'Free Preview' : 'Registered Only'}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Module Modal */}
      {showModuleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-6">
            <h3 className="font-bold text-slate-900 text-base mb-4">Add Course Module</h3>
            <form onSubmit={handleAddModule} className="space-y-4 text-xs sm:text-sm">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Module Title</label>
                <input
                  type="text"
                  placeholder="e.g. Module 1: Foundations & Architecture"
                  value={moduleTitle}
                  onChange={(e) => setModuleTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Module Description (Optional)</label>
                <textarea
                  rows={2}
                  value={moduleDesc}
                  onChange={(e) => setModuleDesc(e.target.value)}
                  placeholder="Summary of module learning goals..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModuleModal(false)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-indigo-700"
                >
                  Save Module
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Lesson Modal */}
      {selectedModuleId !== null && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-slate-900 text-base">Add New Lesson</h3>
            <form onSubmit={handleAddLesson} className="space-y-3.5 text-xs sm:text-sm">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Lesson Title</label>
                <input
                  type="text"
                  placeholder="e.g. 1.1 Intro to Containerization"
                  value={lessonTitle}
                  onChange={(e) => setLessonTitle(e.target.value)}
                  required
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Duration (Minutes)</label>
                  <input
                    type="number"
                    value={lessonDuration}
                    onChange={(e) => setLessonDuration(e.target.value)}
                    required
                    min="1"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                  />
                </div>
                <div className="flex items-center pt-6">
                  <label className="flex items-center gap-2 cursor-pointer font-semibold text-slate-700">
                    <input
                      type="checkbox"
                      checked={isFreePreview}
                      onChange={(e) => setIsFreePreview(e.target.checked)}
                      className="rounded text-indigo-600 focus:ring-indigo-500"
                    />
                    <span>Free Preview Lesson</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Video Stream URL</label>
                <input
                  type="url"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={lessonVideoUrl}
                  onChange={(e) => setLessonVideoUrl(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Lecture Notes / Concepts</label>
                <textarea
                  rows={3}
                  value={lessonContent}
                  onChange={(e) => setLessonContent(e.target.value)}
                  placeholder="Key summary points and code references..."
                  className="w-full p-3 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedModuleId(null)}
                  className="px-4 py-2 border border-slate-200 rounded-xl text-slate-600 text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-indigo-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-indigo-700"
                >
                  Add Lesson
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
