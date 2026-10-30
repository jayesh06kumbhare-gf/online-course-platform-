import React, { useState } from 'react';
import { Mail, MessageSquare, HelpCircle, Check, ChevronDown, ChevronUp } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // FAQ Accordion state
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: 'How do digital certificates work on LearnSphere?',
      a: 'Certificates are generated automatically the instant you complete 100% of all curriculum lessons in an enrolled course. Each certificate contains an immutable, cryptographically verifiable UUID that can be shared on LinkedIn or verified by employers via our verification engine.',
    },
    {
      q: 'Can I access course materials after completing the course?',
      a: 'Yes! All enrolled courses grant lifetime access to video lectures, downloadable cheat sheets, sample repositories, and interactive quiz reviews.',
    },
    {
      q: 'What is required to become an instructor on LearnSphere?',
      a: 'Instructors can register directly via our instructor signup flow. Once submitted, our academic board reviews your proposed syllabus and author credentials before approving your courses for the public catalog.',
    },
    {
      q: 'Are quizzes required to earn a certificate?',
      a: 'While lesson completion is the primary requirement for completion progress, passing quizzes with at least a 70% score validates your qualification and ensures your understanding of key architectural concepts.',
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setName('');
    setEmail('');
    setSubject('');
    setMessage('');
  };

  return (
    <div className="py-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
      
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3.5 py-1 rounded-full">
          Get in Touch
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-2">
          How Can We Help You?
        </h1>
        <p className="text-slate-500 text-xs sm:text-sm mt-2 leading-relaxed">
          Have questions about our technical curricula, institutional licensing, or teaching opportunities? Our support team is here to help.
        </p>
      </div>

      {/* Contact Grid: Form & Info */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
        
        {/* Contact Info Cards */}
        <div className="space-y-4">
          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <Mail className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Academic Support</h3>
            <p className="text-xs text-slate-500">
              For student course queries, progress help, and certificate verification.
            </p>
            <a href="mailto:support@learnsphere.io" className="text-xs font-bold text-indigo-600 block hover:underline">
              support@learnsphere.io
            </a>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2">
            <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
              <MessageSquare className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-slate-900 text-sm">Instructor Partnerships</h3>
            <p className="text-xs text-slate-500">
              Interested in teaching a new engineering track? Pitch your curriculum.
            </p>
            <a href="mailto:instructors@learnsphere.io" className="text-xs font-bold text-indigo-600 block hover:underline">
              instructors@learnsphere.io
            </a>
          </div>
        </div>

        {/* Contact Form */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-slate-200/80 p-8 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 mb-6">Send Us a Direct Message</h2>

          {submitted && (
            <div className="p-4 mb-6 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Thank you! Your inquiry has been dispatched to our engineering support team.</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Your Name</label>
                <input
                  type="text"
                  placeholder="Alex Rivera"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Email Address</label>
                <input
                  type="email"
                  placeholder="alex@domain.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Subject</label>
              <input
                type="text"
                placeholder="Question regarding certificates or course enrollment..."
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                required
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <div>
              <label className="font-semibold text-slate-700 block mb-1">Message</label>
              <textarea
                rows={4}
                placeholder="Please describe how we can assist you..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                className="w-full p-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            <button
              type="submit"
              className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors"
            >
              Send Message
            </button>
          </form>
        </div>

      </div>

      {/* Frequently Asked Questions */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 shadow-xs">
        <div className="max-w-2xl mx-auto text-center mb-8">
          <HelpCircle className="w-8 h-8 text-indigo-600 mx-auto mb-2" />
          <h2 className="text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
          <p className="text-xs text-slate-500 mt-1">
            Common questions regarding our online course player, credentials, and curriculum access.
          </p>
        </div>

        <div className="max-w-3xl mx-auto divide-y divide-slate-100">
          {faqs.map((faq, i) => (
            <div key={i} className="py-4">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between text-left font-bold text-slate-900 text-sm gap-4"
              >
                <span>{faq.q}</span>
                {openFaq === i ? (
                  <ChevronUp className="w-4 h-4 text-slate-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />
                )}
              </button>
              {openFaq === i && (
                <p className="text-xs text-slate-600 mt-2 leading-relaxed animate-in fade-in">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
