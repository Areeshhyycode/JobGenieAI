'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateCoverLetter, clearAI } from '@/store/slices/aiSlice';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import CoverLetterView from '@/components/CoverLetterView';

export default function CoverLetterPage() {
  const dispatch = useDispatch();
  const { coverLetter, loading, error } = useSelector((s) => s.ai);
  const [form, setForm] = useState({
    company: '',
    role: '',
    jobDescription: '',
    userSkills: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(generateCoverLetter(form));
  };

  const handleReset = () => {
    dispatch(clearAI());
    setForm({ company: '', role: '', jobDescription: '', userSkills: '' });
  };

  const content = coverLetter?.coverLetter || coverLetter;

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-brand/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Cover Letter Generator</h1>
            <p className="text-sm text-dark-muted">Generate a professional cover letter tailored to the job</p>
          </div>
        </div>

        {!content && !loading && (
          <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={handleSubmit} className="glass rounded-xl p-6 space-y-4">
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">Company Name *</label>
                <input
                  type="text"
                  required
                  value={form.company}
                  onChange={(e) => setForm({ ...form, company: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-sm focus:outline-none focus:border-brand transition-colors"
                  placeholder="e.g. Google"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1.5">Role *</label>
                <input
                  type="text"
                  required
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-sm focus:outline-none focus:border-brand transition-colors"
                  placeholder="e.g. Frontend Developer"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Your Skills</label>
              <input
                type="text"
                value={form.userSkills}
                onChange={(e) => setForm({ ...form, userSkills: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-sm focus:outline-none focus:border-brand transition-colors"
                placeholder="e.g. React, TypeScript, Node.js, AWS"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Job Description *</label>
              <textarea
                required
                rows={6}
                value={form.jobDescription}
                onChange={(e) => setForm({ ...form, jobDescription: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-sm focus:outline-none focus:border-brand transition-colors resize-none"
                placeholder="Paste the job description here..."
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-brand text-white font-medium text-sm hover:bg-brand-dark transition-colors disabled:opacity-50"
            >
              Generate Cover Letter
            </button>
          </motion.form>
        )}

        {loading && (
          <div className="glass rounded-xl p-12 text-center">
            <div className="w-10 h-10 mx-auto mb-4 border-2 border-brand border-t-transparent rounded-full animate-spin" />
            <p className="text-dark-muted">Generating your cover letter...</p>
            <p className="text-xs text-dark-muted mt-1">This may take a few seconds</p>
          </div>
        )}

        {content && !loading && typeof content === 'string' && (
          <div className="space-y-4">
            {coverLetter?.cached && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <svg className="w-4 h-4 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-xs text-yellow-400">Loaded from cache. Click "Generate Again" for a fresh version.</p>
              </div>
            )}
            <CoverLetterView title="Cover Letter" content={content} />
            <div className="flex gap-3">
              <button onClick={handleReset} className="px-4 py-2 text-sm font-medium bg-dark-border/50 rounded-lg hover:bg-dark-border transition-colors">
                Generate Another
              </button>
              <button
                onClick={() => dispatch(generateCoverLetter({ ...form, regenerate: true }))}
                className="px-4 py-2 text-sm font-medium bg-brand/10 text-brand rounded-lg hover:bg-brand/20 transition-colors"
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
