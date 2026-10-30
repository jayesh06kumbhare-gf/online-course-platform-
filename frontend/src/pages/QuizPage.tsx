import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  HelpCircle, CheckCircle2, XCircle, Clock, Award,
  ArrowRight, ArrowLeft, RotateCcw, AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { Quiz, QuizAttempt } from '../types';
import { api } from '../services/api';

export const QuizPage: React.FC = () => {
  const { courseSlug } = useParams<{ courseSlug: string }>();
  const navigate = useNavigate();

  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [activeQuiz, setActiveQuiz] = useState<Quiz | null>(null);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [attemptResult, setAttemptResult] = useState<QuizAttempt | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!courseSlug) return;
    const fetchQuizzes = async () => {
      setLoading(true);
      try {
        const res: any = await api.getCourseQuizzes(courseSlug);
        const list: Quiz[] = res.results || res || [];
        setQuizzes(list);
        if (list.length > 0) {
          // Fetch full quiz detail with questions
          const fullQuiz = await api.getQuiz(list[0].id);
          setActiveQuiz(fullQuiz);
        }
      } catch (err: any) {
        console.error('Failed to load course quizzes:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, [courseSlug]);

  const handleSelectChoice = (questionId: number, choiceId: number) => {
    if (attemptResult) return; // Locked once submitted
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: choiceId }));
  };

  const handleSubmitQuiz = async () => {
    if (!activeQuiz) return;

    // Check that all questions have an answer
    const answeredCount = Object.keys(selectedAnswers).length;
    if (answeredCount < activeQuiz.questions.length) {
      setErrorMsg(`Please answer all ${activeQuiz.questions.length} questions before submitting.`);
      return;
    }

    setSubmitting(true);
    setErrorMsg('');

    try {
      const answersPayload = Object.entries(selectedAnswers).map(([qId, cId]) => ({
        question_id: Number(qId),
        choice_id: Number(cId),
      }));

      const result = await api.submitQuiz(activeQuiz.id, answersPayload);
      setAttemptResult(result);

      if (result.passed) {
        confetti({
          particleCount: 150,
          spread: 80,
          origin: { y: 0.5 },
        });
      }
    } catch (err: any) {
      setErrorMsg(err.error || 'Failed to submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setAttemptResult(null);
    setSelectedAnswers({});
    setErrorMsg('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-sm font-medium text-slate-500">Loading quiz questions...</p>
        </div>
      </div>
    );
  }

  if (!activeQuiz) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <HelpCircle className="w-12 h-12 text-slate-400 mb-3" />
        <h2 className="text-xl font-bold text-slate-900 mb-1">No Quiz Available</h2>
        <p className="text-slate-500 text-xs mb-6">This course does not currently have active quizzes.</p>
        <Link
          to={`/learn/${courseSlug}`}
          className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-semibold"
        >
          Return to Learning Studio
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        
        {/* Navigation & Header */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            to={`/learn/${courseSlug}`}
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-indigo-600"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Course Player</span>
          </Link>
          <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
            Passing Grade: {activeQuiz.passing_score}%
          </span>
        </div>

        {/* Quiz Title Banner */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200/80 shadow-xs mb-8">
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            {activeQuiz.title}
          </h1>
          <p className="text-slate-600 text-xs sm:text-sm mt-1 leading-relaxed">
            {activeQuiz.description || 'Answer all questions below to test your technical comprehension.'}
          </p>

          <div className="flex items-center gap-6 mt-4 pt-4 border-t border-slate-100 text-xs text-slate-500">
            <span>{activeQuiz.questions.length} Questions</span>
            <span>Multiple Choice</span>
            <span>Immediate Grading</span>
          </div>
        </div>

        {/* Attempt Result Card (Shown after submission) */}
        {attemptResult && (
          <div
            className={`p-6 sm:p-8 rounded-2xl border mb-8 animate-in fade-in zoom-in-95 duration-200 ${
              attemptResult.passed
                ? 'bg-emerald-50 border-emerald-200 text-emerald-950'
                : 'bg-rose-50 border-rose-200 text-rose-950'
            }`}
          >
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    attemptResult.passed
                      ? 'bg-emerald-200/60 text-emerald-800'
                      : 'bg-rose-200/60 text-rose-800'
                  }`}
                >
                  {attemptResult.passed ? 'Quiz Passed 🎉' : 'Needs Review'}
                </span>
                <h3 className="text-2xl font-extrabold mt-2">
                  Your Score: {attemptResult.score}%
                </h3>
                <p className="text-xs opacity-80 mt-0.5">
                  Earned {attemptResult.earned_points} of {attemptResult.total_points} total points.
                  {attemptResult.passed
                    ? ' Great job mastering these core concepts!'
                    : ' Review the explanations below and try again to improve your score.'}
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleRetake}
                  className="px-4 py-2 rounded-xl bg-white text-slate-800 font-bold text-xs shadow-xs hover:bg-slate-100 flex items-center gap-1.5 transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Try Again</span>
                </button>
                <Link
                  to={`/learn/${courseSlug}`}
                  className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-xs flex items-center gap-1.5 transition-colors"
                >
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        )}

        {/* Error message */}
        {errorMsg && (
          <div className="p-4 mb-6 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Questions List */}
        <div className="space-y-6">
          {activeQuiz.questions.map((q, qIndex) => {
            const chosenId = selectedAnswers[q.id];
            
            // If already graded, find question feedback from attempt
            const attemptAnswer = attemptResult?.answers.find((a) => a.question_id === q.id);

            return (
              <div
                key={q.id}
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-sm font-bold text-slate-900 leading-snug">
                    <span className="text-indigo-600 mr-2 font-mono">Q{qIndex + 1}.</span>
                    {q.question_text}
                  </h3>
                  <span className="text-[11px] font-mono text-slate-400 shrink-0">
                    {q.points} pt{q.points > 1 ? 's' : ''}
                  </span>
                </div>

                {/* Choices */}
                <div className="space-y-2">
                  {q.choices.map((choice) => {
                    const isSelected = chosenId === choice.id;

                    let choiceStyle = 'border-slate-200 hover:bg-slate-50 text-slate-700';
                    if (isSelected) {
                      choiceStyle = 'border-indigo-600 bg-indigo-50/50 text-indigo-900 font-semibold';
                    }

                    // Graded state colors
                    if (attemptResult) {
                      if (isSelected && attemptAnswer?.is_correct) {
                        choiceStyle = 'border-emerald-500 bg-emerald-50 text-emerald-900 font-bold';
                      } else if (isSelected && !attemptAnswer?.is_correct) {
                        choiceStyle = 'border-rose-500 bg-rose-50 text-rose-900 font-bold';
                      }
                    }

                    return (
                      <button
                        key={choice.id}
                        type="button"
                        onClick={() => handleSelectChoice(q.id, choice.id)}
                        disabled={Boolean(attemptResult)}
                        className={`w-full p-3.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between gap-3 ${choiceStyle}`}
                      >
                        <div className="flex items-center gap-3">
                          <span
                            className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                              isSelected
                                ? 'border-indigo-600 bg-indigo-600 text-white'
                                : 'border-slate-300'
                            }`}
                          >
                            {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                          </span>
                          <span>{choice.choice_text}</span>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Explanation (Shown when graded) */}
                {attemptResult && attemptAnswer && (
                  <div
                    className={`p-3.5 rounded-xl text-xs leading-relaxed ${
                      attemptAnswer.is_correct
                        ? 'bg-emerald-50/80 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50/80 text-amber-800 border border-amber-200'
                    }`}
                  >
                    <span className="font-bold block mb-0.5">
                      {attemptAnswer.is_correct ? '✓ Correct!' : '✗ Explanation:'}
                    </span>
                    {attemptAnswer.explanation || 'Review the course lecture notes for this topic.'}
                  </div>
                )}

              </div>
            );
          })}
        </div>

        {/* Submit Button */}
        {!attemptResult && (
          <div className="mt-8 flex justify-end">
            <button
              onClick={handleSubmitQuiz}
              disabled={submitting}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm rounded-xl shadow-md transition-colors"
            >
              {submitting ? 'Grading Answers...' : 'Submit Quiz for Grading'}
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
