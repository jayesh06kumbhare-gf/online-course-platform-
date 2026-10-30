import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Users, Award, Shield, CheckCircle2, Heart, ArrowRight } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="space-y-20 py-12">
      
      {/* 1. Hero Mission */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 bg-indigo-50 px-3.5 py-1 rounded-full">
          About LearnSphere
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 leading-tight">
          Democratizing World-Class Tech Education for Every Curious Mind
        </h1>
        <p className="text-slate-600 text-base sm:text-lg leading-relaxed max-w-2xl mx-auto pt-2">
          LearnSphere was founded to bridge the widening gap between traditional academic software theories and the modern, high-velocity engineering skills required in today's tech ecosystem.
        </p>
      </section>

      {/* 2. Core Pillars */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Practitioner-Led Curriculum</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Every course is authored and taught by practicing senior engineers, researchers, and product designers from industry-leading companies.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Verifiable Credentials</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Certificates earned on LearnSphere are cryptographically tied to unique UUIDs, allowing employers and recruiters to verify genuine achievement instantly.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-slate-200/80 shadow-xs space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              <Shield className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900">Project-Based Learning</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              We reject passive memorization. Our students build real, deployable full-stack systems, machine learning models, and production design systems.
            </p>
          </div>

        </div>
      </section>

      {/* 3. Instructors Spotlight */}
      <section className="bg-white py-16 border-y border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-extrabold text-slate-900">Meet Our Lead Instructors</h2>
            <p className="text-slate-500 text-sm mt-2">
              Recognized experts dedicated to student mentorship and technical excellence.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-indigo-500 to-violet-500 text-white font-extrabold text-xl flex items-center justify-center mx-auto shadow-md">
                SC
              </div>
              <h3 className="font-bold text-slate-900 text-base">Dr. Sarah Chen</h3>
              <p className="text-xs text-indigo-600 font-semibold">AI & Deep Learning Lead</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                PhD in Computer Science from Stanford. Former Senior AI Research Scientist at DeepMind.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 text-white font-extrabold text-xl flex items-center justify-center mx-auto shadow-md">
                MV
              </div>
              <h3 className="font-bold text-slate-900 text-base">Marcus Vance</h3>
              <p className="text-xs text-indigo-600 font-semibold">Staff Full-Stack Architect</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                14+ years building high-concurrency cloud distributed systems at Stripe and Netflix.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-pink-500 to-rose-500 text-white font-extrabold text-xl flex items-center justify-center mx-auto shadow-md">
                ER
              </div>
              <h3 className="font-bold text-slate-900 text-base">Elena Rostova</h3>
              <p className="text-xs text-indigo-600 font-semibold">Design Director & UX Strategist</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                Spearheaded design system architectures and accessible interfaces at Figma and Airbnb.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-3">
              <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-amber-500 to-orange-500 text-white font-extrabold text-xl flex items-center justify-center mx-auto shadow-md">
                DM
              </div>
              <h3 className="font-bold text-slate-900 text-base">David Miller</h3>
              <p className="text-xs text-indigo-600 font-semibold">Principal Cloud Architect</p>
              <p className="text-xs text-slate-500 leading-relaxed">
                AWS Community Hero and containerization authority specializing in resilient Kubernetes clusters.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* 4. Bottom CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Start Your Technical Transformation Today
        </h2>
        <div className="mt-6 flex justify-center gap-4">
          <Link
            to="/courses"
            className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-colors"
          >
            Explore Catalog
          </Link>
          <Link
            to="/register"
            className="px-6 py-3 bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-bold text-xs sm:text-sm rounded-xl transition-colors"
          >
            Create Student Account
          </Link>
        </div>
      </section>

    </div>
  );
};
