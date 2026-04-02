'use client';

import { useSelector } from 'react-redux';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import CoverLetterView from '@/components/CoverLetterView';

export default function AIResultsPage() {
  const router = useRouter();
  const ai = useSelector((s) => s.ai);

  const results = [
    { key: 'coverLetter', title: 'Cover Letter', data: ai.coverLetter },
    { key: 'interviewQuestions', title: 'Interview Questions', data: ai.interviewQuestions },
    { key: 'followUpEmail', title: 'Follow-Up Email', data: ai.followUpEmail },
    { key: 'resumeTips', title: 'Resume Tips', data: ai.resumeTips },
  ].filter((r) => r.data);

  const hasMatchScore = ai.matchScore;
  const hasAny = results.length > 0 || hasMatchScore;

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">AI Results</h1>
        <p className="text-dark-muted text-sm mt-1">View your AI-generated content</p>
      </div>

      {!hasAny ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-card flex items-center justify-center">
            <svg className="w-8 h-8 text-dark-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <p className="text-dark-muted mb-2">No AI results yet</p>
          <p className="text-sm text-dark-muted">
            Go to an application detail page and use the AI tools to generate content.
          </p>
          <button
            onClick={() => router.push('/applications')}
            className="mt-4 px-5 py-2 bg-brand rounded-lg text-white text-sm font-medium hover:bg-brand-dark transition-colors"
          >
            View Applications
          </button>
        </motion.div>
      ) : (
        <div className="space-y-6">
          {/* Match Score Card */}
          {hasMatchScore && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="glass rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold mb-4">Match Score</h3>
              <div className="flex items-center gap-6">
                <div className="w-24 h-24 rounded-full border-4 border-brand flex items-center justify-center">
                  <span className="text-3xl font-bold">{ai.matchScore.score || 0}</span>
                </div>
                <div className="flex-1">
                  {ai.matchScore.breakdown &&
                    Object.entries(ai.matchScore.breakdown).map(([k, v]) => (
                      <div key={k} className="flex items-center gap-2 mb-2">
                        <span className="text-sm text-dark-muted capitalize w-28">
                          {k.replace('_', ' ')}
                        </span>
                        <div className="flex-1 h-2.5 bg-dark-bg rounded-full overflow-hidden">
                          <div
                            className="h-full bg-brand rounded-full transition-all duration-500"
                            style={{ width: `${v}%` }}
                          />
                        </div>
                        <span className="text-sm font-medium w-10">{v}%</span>
                      </div>
                    ))}
                  {ai.matchScore.summary && (
                    <p className="text-sm text-dark-muted mt-3">{ai.matchScore.summary}</p>
                  )}
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                {ai.matchScore.matched_keywords?.length > 0 && (
                  <div>
                    <p className="text-xs text-dark-muted mb-2">Matched Keywords</p>
                    <div className="flex flex-wrap gap-1.5">
                      {ai.matchScore.matched_keywords.map((kw) => (
                        <span key={kw} className="px-2.5 py-1 text-xs bg-green-500/10 text-green-400 rounded-full">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {ai.matchScore.missing_keywords?.length > 0 && (
                  <div>
                    <p className="text-xs text-dark-muted mb-2">Missing Keywords</p>
                    <div className="flex flex-wrap gap-1.5">
                      {ai.matchScore.missing_keywords.map((kw) => (
                        <span key={kw} className="px-2.5 py-1 text-xs bg-red-500/10 text-red-400 rounded-full">
                          {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* Text Results */}
          {results.map((r, i) => {
            const text =
              typeof r.data === 'string'
                ? r.data
                : r.data[r.key] || JSON.stringify(r.data, null, 2);
            return (
              <motion.div
                key={r.key}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <CoverLetterView title={r.title} content={text} />
              </motion.div>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
}
