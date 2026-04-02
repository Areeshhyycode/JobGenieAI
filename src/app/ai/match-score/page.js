'use client';

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateMatchScore, clearAI } from '@/store/slices/aiSlice';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';

export default function MatchScorePage() {
  const dispatch = useDispatch();
  const { matchScore, loading, error } = useSelector((s) => s.ai);
  const [form, setForm] = useState({
    role: '',
    jobDescription: '',
    userSkills: '',
    userExperience: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(generateMatchScore(form));
  };

  const handleReset = () => {
    dispatch(clearAI());
    setForm({ role: '', jobDescription: '', userSkills: '', userExperience: '' });
  };

  const data = matchScore;
  const isCached = matchScore?.cached;

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-400 border-green-400';
    if (score >= 60) return 'text-yellow-400 border-yellow-400';
    if (score >= 40) return 'text-orange-400 border-orange-400';
    return 'text-red-400 border-red-400';
  };

  const getBarColor = (val) => {
    if (val >= 80) return 'bg-green-400';
    if (val >= 60) return 'bg-yellow-400';
    if (val >= 40) return 'bg-orange-400';
    return 'bg-red-400';
  };

  return (
    <DashboardLayout>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-4xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center">
            <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Job Match Score</h1>
            <p className="text-sm text-dark-muted">See how well your skills match the job requirements</p>
          </div>
        </div>

        {!data && !loading && (
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
                placeholder="Paste the full job description here..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Your Skills *</label>
              <textarea
                required
                rows={3}
                value={form.userSkills}
                onChange={(e) => setForm({ ...form, userSkills: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-sm focus:outline-none focus:border-brand transition-colors resize-none"
                placeholder="e.g. React, TypeScript, Node.js, PostgreSQL, AWS, Docker..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1.5">Your Experience</label>
              <textarea
                rows={3}
                value={form.userExperience}
                onChange={(e) => setForm({ ...form, userExperience: e.target.value })}
                className="w-full px-3 py-2.5 rounded-lg bg-dark-bg border border-dark-border text-sm focus:outline-none focus:border-brand transition-colors resize-none"
                placeholder="e.g. 3 years as a frontend developer, built e-commerce platforms..."
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
              className="w-full py-3 rounded-lg bg-green-500/90 text-white font-medium text-sm hover:bg-green-500 transition-colors disabled:opacity-50"
            >
              Calculate Match Score
            </button>
          </motion.form>
        )}

        {loading && (
          <div className="glass rounded-xl p-12 text-center">
            <div className="w-10 h-10 mx-auto mb-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin" />
            <p className="text-dark-muted">Analyzing job match...</p>
            <p className="text-xs text-dark-muted mt-1">Comparing your skills against job requirements</p>
          </div>
        )}

        {data && !loading && (
          <div className="space-y-4">
            {isCached && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20">
                <p className="text-xs text-yellow-400">Loaded from cache. Click "Regenerate" for a fresh analysis.</p>
              </div>
            )}

            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6">
              {/* Score Circle */}
              <div className="flex items-center gap-6 mb-6">
                <div className={`w-24 h-24 rounded-full border-4 flex items-center justify-center ${getScoreColor(data.score || 0)}`}>
                  <div className="text-center">
                    <span className="text-3xl font-bold">{data.score || 0}</span>
                    <span className="text-xs block -mt-1">/ 100</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-1">Match Analysis</h3>
                  {data.summary && <p className="text-sm text-dark-muted leading-relaxed">{data.summary}</p>}
                </div>
              </div>

              {/* Breakdown Bars */}
              {data.breakdown && (
                <div className="mb-6">
                  <h4 className="text-sm font-medium mb-3">Skill Breakdown</h4>
                  <div className="space-y-3">
                    {Object.entries(data.breakdown).map(([key, val]) => (
                      <div key={key}>
                        <div className="flex justify-between text-xs mb-1">
                          <span className="text-dark-muted capitalize">{key.replace(/_/g, ' ')}</span>
                          <span className="font-medium">{val}%</span>
                        </div>
                        <div className="h-2 bg-dark-bg rounded-full overflow-hidden">
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${val}%` }}
                            transition={{ duration: 0.8, ease: 'easeOut' }}
                            className={`h-full rounded-full ${getBarColor(val)}`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Keywords */}
              <div className="grid sm:grid-cols-2 gap-4">
                {data.matched_keywords?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-green-400">Matched Skills</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {data.matched_keywords.map((kw) => (
                        <span key={kw} className="px-2.5 py-1 text-xs bg-green-500/10 text-green-400 rounded-full border border-green-500/20">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {data.missing_keywords?.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium mb-2 text-red-400">Missing Skills</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {data.missing_keywords.map((kw) => (
                        <span key={kw} className="px-2.5 py-1 text-xs bg-red-500/10 text-red-400 rounded-full border border-red-500/20">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>

            <div className="flex gap-3">
              <button onClick={handleReset} className="px-4 py-2 text-sm font-medium bg-dark-border/50 rounded-lg hover:bg-dark-border transition-colors">
                Analyze Another
              </button>
              <button
                onClick={() => dispatch(generateMatchScore({ ...form, regenerate: true }))}
                className="px-4 py-2 text-sm font-medium bg-green-500/10 text-green-400 rounded-lg hover:bg-green-500/20 transition-colors"
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
