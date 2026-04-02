'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateResumeTips, clearAI } from '@/store/slices/aiSlice';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import CoverLetterView from '@/components/CoverLetterView';

export default function ResumeTipsPage() {
  const dispatch = useDispatch();
  const { resumeTips, loading, error } = useSelector((s) => s.ai);
  const [form, setForm] = useState({
    role: '',
    jobDescription: '',
    currentResume: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(generateResumeTips(form));
  };

  const handleReset = () => {
    dispatch(clearAI());
    setForm({ role: '', jobDescription: '', currentResume: '' });
  };

  const content = resumeTips?.resumeTips || resumeTips;

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Resume Tailoring Tips</h1>
            <p className="text-sm text-dark-muted">Get specific suggestions to tailor your resume for any job</p>
          </div>
        </div>

        {!content && !loading && (
          <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="glass rounded-xl p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1.5">Target Role *</label>
              <input
                type="text"
                required
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-sm focus:outline-none focus:border-brand transition-colors"
                placeholder="e.g. Frontend Developer"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Job Description *</label>
              <textarea
                required
                rows={5}
                value={form.jobDescription}
                onChange={(e) => setForm({ ...form, jobDescription: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-sm focus:outline-none focus:border-brand transition-colors resize-none"
                placeholder="Paste the job description here..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Your Current Resume / Experience</label>
              <textarea
                rows={6}
                value={form.currentResume}
                onChange={(e) => setForm({ ...form, currentResume: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-sm focus:outline-none focus:border-brand transition-colors resize-none"
                placeholder="Paste your resume text or describe your experience..."
              />
              <p className="text-xs text-dark-muted mt-1">Leave blank for general tips based on the job description</p>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-purple-500/90 text-white font-medium text-sm hover:bg-purple-500 transition-colors disabled:opacity-50"
            >
              Get Resume Tips
            </button>
          </motion.form>
        )}

        {loading && (
          <div className="glass rounded-xl p-12 text-center">
            <div className="w-10 h-10 mx-auto mb-4 border-2 border-purple-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-dark-muted">Analyzing your resume against job requirements...</p>
          </div>
        )}

        {content && !loading && typeof content === 'string' && (
          <div className="space-y-4">
            {resumeTips?.cached && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-xs text-yellow-400">Loaded from cache. Click "Regenerate" for fresh tips.</p>
              </div>
            )}
            <CoverLetterView title="Resume Tailoring Tips" content={content} />
            <div className="flex gap-3">
              <button onClick={handleReset} className="px-4 py-2 text-sm font-medium bg-dark-border/50 rounded-lg hover:bg-dark-border transition-colors">
                Analyze Another
              </button>
              <button
                onClick={() => dispatch(generateResumeTips({ ...form, regenerate: true }))}
                className="px-4 py-2 text-sm font-medium bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-colors"
              >
                Regenerate
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </DashboardLayout>
  );
}
