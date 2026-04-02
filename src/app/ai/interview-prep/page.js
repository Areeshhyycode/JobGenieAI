'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateInterviewQuestions, clearAI } from '@/store/slices/aiSlice';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import CoverLetterView from '@/components/CoverLetterView';

export default function InterviewPrepPage() {
  const dispatch = useDispatch();
  const { interviewQuestions, loading, error } = useSelector((s) => s.ai);
  const [form, setForm] = useState({
    company: '',
    role: '',
    jobDescription: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(generateInterviewQuestions(form));
  };

  const handleReset = () => {
    dispatch(clearAI());
    setForm({ company: '', role: '', jobDescription: '' });
  };

  const content = interviewQuestions?.interviewQuestions || interviewQuestions;
  const isCached = interviewQuestions?.cached;

  // Parse categorized questions from content
  const parseQuestions = (text) => {
    if (!text || typeof text !== 'string') return null;
    const sections = { technical: [], behavioral: [], company: [] };
    let current = null;

    text.split('\n').forEach((line) => {
      const trimmed = line.trim();
      if (/^##?\s*Technical/i.test(trimmed)) current = 'technical';
      else if (/^##?\s*Behavioral/i.test(trimmed)) current = 'behavioral';
      else if (/^##?\s*Company/i.test(trimmed)) current = 'company';
      else if (current && trimmed) {
        sections[current].push(trimmed);
      }
    });

    const hasContent = Object.values(sections).some((s) => s.length > 0);
    return hasContent ? sections : null;
  };

  const parsed = typeof content === 'string' ? parseQuestions(content) : null;

  const sectionColors = {
    technical: { bg: 'bg-blue-500/10', border: 'border-blue-500/20', text: 'text-blue-400', dot: 'bg-blue-400' },
    behavioral: { bg: 'bg-yellow-500/10', border: 'border-yellow-500/20', text: 'text-yellow-400', dot: 'bg-yellow-400' },
    company: { bg: 'bg-green-500/10', border: 'border-green-500/20', text: 'text-green-400', dot: 'bg-green-400' },
  };

  const sectionLabels = {
    technical: 'Technical Questions',
    behavioral: 'Behavioral Questions',
    company: 'Company-Specific Questions',
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Interview Prep</h1>
            <p className="text-sm text-dark-muted">Generate 15 categorized interview questions with answer hints</p>
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
              className="w-full py-3 rounded-lg bg-yellow-500/90 text-dark-bg font-medium text-sm hover:bg-yellow-500 transition-colors disabled:opacity-50"
            >
              Generate Interview Questions
            </button>
          </motion.form>
        )}

        {loading && (
          <div className="glass rounded-xl p-12 text-center">
            <div className="w-10 h-10 mx-auto mb-4 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-dark-muted">Generating interview questions...</p>
            <p className="text-xs text-dark-muted mt-1">Creating 15 categorized questions with hints</p>
          </div>
        )}

        {content && !loading && typeof content === 'string' && (
          <div className="space-y-4">
            {isCached && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-xs text-yellow-400">Loaded from cache. Click "Regenerate" for fresh questions.</p>
              </div>
            )}

            {parsed ? (
              <div className="space-y-4">
                {Object.entries(parsed).map(([key, lines]) => (
                  lines.length > 0 && (
                    <motion.div
                      key={key}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`glass rounded-xl p-5 border ${sectionColors[key].border}`}
                    >
                      <div className="flex items-center gap-2 mb-3">
                        <div className={`w-2 h-2 rounded-full ${sectionColors[key].dot}`} />
                        <h3 className={`text-sm font-semibold ${sectionColors[key].text}`}>{sectionLabels[key]}</h3>
                      </div>
                      <div className="space-y-2">
                        {lines.map((line, i) => (
                          <p key={i} className={`text-sm leading-relaxed ${line.toLowerCase().startsWith('hint') ? 'text-dark-muted pl-4 italic' : 'text-dark-text/90'}`}>
                            {line}
                          </p>
                        ))}
                      </div>
                    </motion.div>
                  )
                ))}
              </div>
            ) : (
              <CoverLetterView title="Interview Questions" content={content} />
            )}

            <div className="flex gap-3">
              <button onClick={handleReset} className="px-4 py-2 text-sm font-medium bg-dark-border/50 rounded-lg hover:bg-dark-border transition-colors">
                Generate Another
              </button>
              <button
                onClick={() => dispatch(generateInterviewQuestions({ ...form, regenerate: true }))}
                className="px-4 py-2 text-sm font-medium bg-yellow-500/10 text-yellow-400 rounded-lg hover:bg-yellow-500/20 transition-colors"
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
