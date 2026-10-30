import React, { useState, useEffect } from 'react';
import { Award, Download, CheckCircle2, Search, ExternalLink, Printer, ShieldCheck } from 'lucide-react';
import { Certificate } from '../types';
import { api } from '../services/api';

export const CertificatesPage: React.FC = () => {
  const [certificates, setCertificates] = useState<Certificate[]>([]);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);

  // Verification Search State
  const [verifyIdInput, setVerifyIdInput] = useState('');
  const [verifiedResult, setVerifiedResult] = useState<Certificate | null>(null);
  const [verifyError, setVerifyError] = useState('');
  const [verifying, setVerifying] = useState(false);

  useEffect(() => {
    const fetchCertificates = async () => {
      setLoading(true);
      try {
        const res: any = await api.getMyCertificates();
        const list: Certificate[] = res.results || res || [];
        setCertificates(list);
      } catch (err) {
        console.error('Failed to load certificates:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCertificates();
  }, []);

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verifyIdInput.trim()) return;
    setVerifying(true);
    setVerifyError('');
    setVerifiedResult(null);

    try {
      const cert = await api.verifyCertificate(verifyIdInput.trim());
      setVerifiedResult(cert);
    } catch {
      setVerifyError('Certificate not found or invalid UUID.');
    } finally {
      setVerifying(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-10">
      
      {/* 1. Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Earned Certificates
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Official, cryptographically verifiable certificates earned upon 100% course curriculum completion.
        </p>
      </div>

      {/* 2. Certificates Grid */}
      {certificates.length === 0 ? (
        <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
          <Award className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900 mb-1">No certificates earned yet</h3>
          <p className="text-xs text-slate-500 mb-6">
            Complete all lessons in an enrolled course to unlock your official credential.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {certificates.map((cert) => (
            <div
              key={cert.id}
              className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-6 flex flex-col justify-between hover:shadow-lg transition-all"
            >
              <div className="space-y-3">
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
                  <Award className="w-5 h-5" />
                </div>
                <h3 className="font-bold text-slate-900 text-base leading-snug">
                  {cert.course_title}
                </h3>
                <p className="text-xs text-slate-500">
                  Instructor: <span className="text-slate-700 font-semibold">{cert.instructor_name}</span>
                </p>
                <div className="pt-2 text-[11px] text-slate-400 font-mono truncate">
                  ID: {cert.certificate_id}
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-[11px] text-slate-400">
                  {new Date(cert.issued_at).toLocaleDateString()}
                </span>
                <button
                  onClick={() => setSelectedCert(cert)}
                  className="px-3.5 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs flex items-center gap-1.5 transition-colors"
                >
                  <Award className="w-3.5 h-3.5" />
                  <span>View Certificate</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* 3. Certificate Verification Tool Section */}
      <div className="bg-white rounded-3xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
        <div className="max-w-2xl">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5 mb-1">
            <ShieldCheck className="w-4 h-4" />
            <span>Public Verification Engine</span>
          </span>
          <h2 className="text-xl font-bold text-slate-900">Verify Any LearnSphere Credential</h2>
          <p className="text-xs text-slate-500 mt-1 mb-6">
            Employers and academic institutions can verify the authenticity of any certificate by entering its UUID below.
          </p>

          <form onSubmit={handleVerifySubmit} className="flex gap-2">
            <input
              type="text"
              placeholder="Paste Certificate UUID (e.g. 1a2b3c4d-...)"
              value={verifyIdInput}
              onChange={(e) => setVerifyIdInput(e.target.value)}
              required
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono focus:outline-none focus:bg-white focus:ring-2 focus:ring-indigo-500/20"
            />
            <button
              type="submit"
              disabled={verifying}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs sm:text-sm rounded-xl transition-colors shrink-0"
            >
              {verifying ? 'Checking...' : 'Verify'}
            </button>
          </form>

          {verifyError && (
            <p className="text-xs text-rose-600 mt-3 font-medium">{verifyError}</p>
          )}

          {verifiedResult && (
            <div className="mt-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs space-y-1.5 animate-in fade-in">
              <div className="flex items-center gap-2 font-bold text-sm text-emerald-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Valid LearnSphere Credential</span>
              </div>
              <p><strong>Student:</strong> {verifiedResult.student_name}</p>
              <p><strong>Course:</strong> {verifiedResult.course_title}</p>
              <p><strong>Lead Instructor:</strong> {verifiedResult.instructor_name}</p>
              <p><strong>Issued On:</strong> {new Date(verifiedResult.issued_at).toLocaleDateString()}</p>
            </div>
          )}
        </div>
      </div>

      {/* Printable Certificate Modal */}
      {selectedCert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
          <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-8">
            
            {/* Modal Controls Bar */}
            <div className="p-4 bg-slate-900 text-white flex items-center justify-between text-xs">
              <span className="font-bold flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400" />
                <span>Certificate Preview</span>
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={handlePrint}
                  className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg flex items-center gap-1.5 transition-colors"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>Print / Save PDF</span>
                </button>
                <button
                  onClick={() => setSelectedCert(null)}
                  className="text-slate-400 hover:text-white font-bold text-sm"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* High-Resolution Printable Certificate Canvas */}
            <div id="printable-certificate" className="p-8 sm:p-14 bg-gradient-to-b from-amber-50/40 via-white to-amber-50/20 text-center relative border-[12px] border-double border-amber-600/30 m-4 sm:m-8 rounded-2xl">
              
              {/* Corner Ornaments */}
              <div className="absolute top-4 left-4 w-12 h-12 border-t-2 border-l-2 border-amber-600/40" />
              <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-amber-600/40" />
              <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-amber-600/40" />
              <div className="absolute bottom-4 right-4 w-12 h-12 border-b-2 border-r-2 border-amber-600/40" />

              {/* Logo & Heading */}
              <div className="flex flex-col items-center mb-6">
                <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center font-extrabold shadow-md mb-2">
                  LS
                </div>
                <span className="text-xs font-extrabold tracking-widest uppercase text-indigo-700">
                  LearnSphere Academy
                </span>
                <h2 className="text-3xl sm:text-4xl font-serif font-bold text-slate-900 mt-2 tracking-wide">
                  Certificate of Completion
                </h2>
                <div className="w-20 h-0.5 bg-amber-500 mt-3" />
              </div>

              <p className="text-xs sm:text-sm text-slate-500 uppercase tracking-widest font-semibold mb-2">
                This is proudly presented to
              </p>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-slate-900 border-b-2 border-slate-200 pb-2 max-w-md mx-auto font-serif">
                {selectedCert.student_name}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 max-w-xl mx-auto mt-4 leading-relaxed">
                for successfully completing all required modules, practical assignments, and rigorous technical assessments for the course
              </p>

              <h4 className="text-lg sm:text-xl font-bold text-indigo-900 mt-3">
                {selectedCert.course_title}
              </h4>

              {/* Signatures & Seal */}
              <div className="mt-12 pt-8 grid grid-cols-3 items-end max-w-2xl mx-auto text-xs">
                <div>
                  <div className="font-serif italic text-base text-slate-800 border-b border-slate-300 pb-1">
                    {selectedCert.instructor_name}
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block mt-1 font-semibold">
                    Course Instructor
                  </span>
                </div>

                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border-2 border-amber-500 flex items-center justify-center bg-amber-50 shadow-inner">
                    <Award className="w-8 h-8 text-amber-600" />
                  </div>
                  <span className="text-[9px] text-amber-700 font-extrabold uppercase tracking-widest mt-1">
                    Verified Seal
                  </span>
                </div>

                <div>
                  <div className="font-serif italic text-base text-slate-800 border-b border-slate-300 pb-1">
                    LearnSphere Director
                  </div>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider block mt-1 font-semibold">
                    Academic Board
                  </span>
                </div>
              </div>

              {/* Verification Footer */}
              <div className="mt-10 pt-4 border-t border-slate-200 text-[10px] text-slate-400 font-mono flex flex-col sm:flex-row items-center justify-between gap-2">
                <span>Certificate UUID: {selectedCert.certificate_id}</span>
                <span>Issued on: {new Date(selectedCert.issued_at).toLocaleDateString()}</span>
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
