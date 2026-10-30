import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Save, Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { api } from '../services/api';
import { Category } from '../types';

export const InstructorCourseCreatePage: React.FC = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [categoryId, setCategoryId] = useState<number | ''>('');
  const [level, setLevel] = useState<'beginner' | 'intermediate' | 'advanced' | 'all'>('all');
  const [language, setLanguage] = useState('English');
  const [price, setPrice] = useState('29.99');
  const [isFree, setIsFree] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState('');
  const [previewVideoUrl, setPreviewVideoUrl] = useState('');

  // Outcomes & Requirements lists
  const [outcomes, setOutcomes] = useState<string[]>(['Master fundamental core concepts']);
  const [newOutcome, setNewOutcome] = useState('');
  const [requirements, setRequirements] = useState<string[]>(['Basic computer literacy']);
  const [newRequirement, setNewRequirement] = useState('');

  const [saving, setSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    api.getCategories()
      .then((res: any) => {
        const list = res.results || res || [];
        setCategories(list);
        if (list.length > 0) setCategoryId(list[0].id);
      })
      .catch(() => {});
  }, []);

  const handleAddOutcome = () => {
    if (newOutcome.trim()) {
      setOutcomes([...outcomes, newOutcome.trim()]);
      setNewOutcome('');
    }
  };

  const handleRemoveOutcome = (idx: number) => {
    setOutcomes(outcomes.filter((_, i) => i !== idx));
  };

  const handleAddRequirement = () => {
    if (newRequirement.trim()) {
      setRequirements([...requirements, newRequirement.trim()]);
      setNewRequirement('');
    }
  };

  const handleRemoveRequirement = (idx: number) => {
    setRequirements(requirements.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setErrorMsg('Course title is required.');
      return;
    }
    setSaving(true);
    setErrorMsg('');

    try {
      const payload: any = {
        title,
        subtitle,
        description,
        category: categoryId || undefined,
        level,
        language,
        price: isFree ? 0 : Number(price),
        is_free: isFree,
        thumbnail_url: thumbnailUrl.trim() || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800',
        preview_video_url: previewVideoUrl.trim(),
        learning_outcomes: outcomes,
        requirements,
      };

      const newCourse = await api.createCourse(payload);
      // Navigate to curriculum builder for newly created course
      navigate(`/instructor/courses/${newCourse.id}/curriculum`);
    } catch (err: any) {
      setErrorMsg(err.detail || err.title || 'Failed to create course.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      
      {/* Top back button */}
      <div>
        <Link
          to="/instructor"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 mb-2"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Instructor Studio</span>
        </Link>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Create New Course
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Draft course details, syllabus outcomes, and pricing. You will add modules and lessons next.
        </p>
      </div>

      {errorMsg && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl">
          {errorMsg}
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-10 shadow-xs space-y-6 text-xs sm:text-sm">
        
        {/* Title & Subtitle */}
        <div className="space-y-4">
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">
              Course Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="e.g. Master Microservices Architecture with Go and Docker"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 text-sm font-semibold"
            />
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1.5">
              Course Subtitle <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              placeholder="A concise, high-impact one-sentence summary of what students will achieve"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              required
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
            />
          </div>
        </div>

        {/* Category, Level, Language Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">Category</label>
            <select
              value={categoryId}
              onChange={(e) => setCategoryId(Number(e.target.value))}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1.5">Difficulty Level</label>
            <select
              value={level}
              onChange={(e) => setLevel(e.target.value as any)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
            >
              <option value="beginner">Beginner</option>
              <option value="intermediate">Intermediate</option>
              <option value="advanced">Advanced</option>
              <option value="all">All Levels</option>
            </select>
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1.5">Language</label>
            <input
              type="text"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Pricing */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 flex flex-wrap items-center justify-between gap-4">
          <label className="flex items-center gap-2 cursor-pointer font-bold text-slate-800">
            <input
              type="checkbox"
              checked={isFree}
              onChange={(e) => setIsFree(e.target.checked)}
              className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500"
            />
            <span>This is a Free Course</span>
          </label>

          {!isFree && (
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-700">Course Price ($):</span>
              <input
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-28 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-900 focus:outline-none"
              />
            </div>
          )}
        </div>

        {/* Media URLs */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="font-bold text-slate-800 block mb-1.5">Thumbnail URL (Unsplash or Image Link)</label>
            <input
              type="url"
              placeholder="https://images.unsplash.com/photo-..."
              value={thumbnailUrl}
              onChange={(e) => setThumbnailUrl(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="font-bold text-slate-800 block mb-1.5">Preview Video URL (YouTube or MP4)</label>
            <input
              type="url"
              placeholder="https://www.youtube.com/watch?v=..."
              value={previewVideoUrl}
              onChange={(e) => setPreviewVideoUrl(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="font-bold text-slate-800 block mb-1.5">
            Full Course Description
          </label>
          <textarea
            rows={5}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Provide a comprehensive syllabus overview, technology stack, and expected project outputs..."
            required
            className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none leading-relaxed"
          />
        </div>

        {/* Dynamic Learning Outcomes */}
        <div>
          <label className="font-bold text-slate-800 block mb-1.5">
            Key Learning Outcomes (What students will build or master)
          </label>
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              placeholder="e.g. Build distributed event-driven microservices"
              value={newOutcome}
              onChange={(e) => setNewOutcome(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleAddOutcome(); } }}
              className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:bg-white focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddOutcome}
              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold rounded-xl text-xs transition-colors shrink-0"
            >
              Add Outcome
            </button>
          </div>
          <div className="space-y-1.5">
            {outcomes.map((out, idx) => (
              <div key={idx} className="flex items-center justify-between p-2.5 rounded-lg bg-slate-50 border border-slate-100 text-xs text-slate-700">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                  <span>{out}</span>
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveOutcome(idx)}
                  className="text-slate-400 hover:text-rose-500"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Submit */}
        <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
          <Link
            to="/instructor"
            className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 text-xs"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={saving}
            className="px-7 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Creating Course...' : 'Save & Build Curriculum →'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
