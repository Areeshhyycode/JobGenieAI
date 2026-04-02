'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApplications, deleteApplication } from '@/store/slices/applicationSlice';
import {
  generateCoverLetter,
  generateInterviewQuestions,
  generateFollowUpEmail,
  generateMatchScore,
  generateResumeTips,
  clearAI,
} from '@/store/slices/aiSlice';
import { motion } from 'framer-motion';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import StatusBadge from '@/components/StatusBadge';
import AIButton from '@/components/AIButton';
import CoverLetterView from '@/components/CoverLetterView';
import EditApplicationModal from '@/components/EditApplicationModal';

export default function ApplicationDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { items } = useSelector((s) => s.applications);
  const ai = useSelector((s) => s.ai);
  const [editOpen, setEditOpen] = useState(false);
  const [activeAI, setActiveAI] = useState(null);

  const app = items.find((a) => a._id === id);

  useEffect(() => {
    if (!app) dispatch(fetchApplications());
    return () => dispatch(clearAI());
  }, [dispatch, app]);

  const handleDelete = async () => {
    if (confirm('Delete this application?')) {
      await dispatch(deleteApplication(id));
      router.push('/applications');
    }
  };

  const handleAI = (type) => {
    setActiveAI(type);
    const payload = {
      company: app.company,
      role: app.role,
      jobDescription: app.jobDescription || '',
      applicationId: app._id,
    };
    switch (type) {
      case 'coverLetter':
        dispatch(generateCoverLetter(payload));
        break;
      case 'interviewQuestions':
        dispatch(generateInterviewQuestions(payload));
        break;
      case 'followUpEmail':
        dispatch(generateFollowUpEmail(payload));
        break;
      case 'matchScore':
        dispatch(generateMatchScore(payload));
        break;
      case 'resumeTips':
        dispatch(generateResumeTips(payload));
        break;
    }
  };

  if (!app) {
    return (
      <DashboardLayout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="w-8 h-8 border-2 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      </DashboardLayout>
    );
  }

  const aiContent = activeAI && ai[activeAI];
  const aiTitles = {
    coverLetter: 'Cover Letter',
    interviewQuestions: 'Interview Questions',
    followUpEmail: 'Follow-Up Email',
    matchScore: 'Match Score',
    resumeTips: 'Resume Tips',
  };

  return (
    <DashboardLayout>
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-dark-muted mb-6">
        <Link href="/applications" className="hover:text-dark-text transition-colors">
          Applications
        </Link>
        <span>/</span>
        <span className="text-dark-text">{app.company}</span>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Info */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 space-y-6"
        >
          <div className="glass rounded-xl p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold">{app.company}</h1>
                <p className="text-dark-muted mt-1">{app.role}</p>
              </div>
              <StatusBadge status={app.status} />
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {app.location && (
                <div>
                  <p className="text-xs text-dark-muted">Location</p>
                  <p className="text-sm font-medium mt-0.5">{app.location}</p>
                </div>
              )}
              {app.salary && (
                <div>
                  <p className="text-xs text-dark-muted">Salary</p>
                  <p className="text-sm font-medium mt-0.5">{app.salary}</p>
                </div>
              )}
              <div>
                <p className="text-xs text-dark-muted">Applied Date</p>
                <p className="text-sm font-medium mt-0.5">
                  {new Date(app.appliedDate).toLocaleDateString()}
                </p>
              </div>
              {app.jobUrl && (
                <div>
                  <p className="text-xs text-dark-muted">Job URL</p>
                  <a
                    href={app.jobUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-brand hover:text-brand-light transition-colors"
                  >
                    View Posting
                  </a>
                </div>
              )}
            </div>

            {app.jobDescription && (
              <div className="mb-4">
                <p className="text-xs text-dark-muted mb-2">Job Description</p>
                <div className="bg-dark-bg rounded-lg p-4 text-sm leading-relaxed text-dark-text/80 max-h-48 overflow-y-auto whitespace-pre-wrap">
                  {app.jobDescription}
                </div>
              </div>
            )}

            {app.notes && (
              <div>
                <p className="text-xs text-dark-muted mb-2">Notes</p>
                <p className="text-sm text-dark-text/80">{app.notes}</p>
              </div>
            )}

            <div className="flex gap-2 mt-6 pt-4 border-t border-dark-border">
              <button
                onClick={() => setEditOpen(true)}
                className="px-4 py-2 text-sm font-medium bg-brand/10 text-brand rounded-lg hover:bg-brand/20 transition-colors"
              >
                Edit
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 text-sm font-medium bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>

          {/* AI Result Display */}
          {ai.loading && (
            <div className="glass rounded-xl p-8 text-center">
              <div className="w-8 h-8 mx-auto mb-3 border-2 border-brand border-t-transparent rounded-full animate-spin" />
              <p className="text-sm text-dark-muted">Generating {aiTitles[activeAI]}...</p>
            </div>
          )}

          {ai.error && (
            <div className="glass rounded-xl p-4 border-red-500/30">
              <p className="text-sm text-red-400">{ai.error}</p>
            </div>
          )}

          {aiContent && !ai.loading && activeAI === 'matchScore' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass rounded-xl p-6">
              <h3 className="text-lg font-semibold mb-4">Match Score</h3>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-20 h-20 rounded-full border-4 border-brand flex items-center justify-center">
                  <span className="text-2xl font-bold">{aiContent.score || 0}</span>
                </div>
                <div className="flex-1">
                  {aiContent.breakdown && Object.entries(aiContent.breakdown).map(([k, v]) => (
                    <div key={k} className="flex items-center gap-2 mb-1">
                      <span className="text-xs text-dark-muted capitalize w-24">{k.replace('_', ' ')}</span>
                      <div className="flex-1 h-2 bg-dark-bg rounded-full overflow-hidden">
                        <div className="h-full bg-brand rounded-full" style={{ width: `${v}%` }} />
                      </div>
                      <span className="text-xs font-medium w-8">{v}%</span>
                    </div>
                  ))}
                </div>
              </div>
              {aiContent.summary && <p className="text-sm text-dark-muted">{aiContent.summary}</p>}
              {aiContent.matched_keywords?.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-dark-muted mb-1">Matched Keywords</p>
                  <div className="flex flex-wrap gap-1">
                    {aiContent.matched_keywords.map((kw) => (
                      <span key={kw} className="px-2 py-0.5 text-xs bg-green-500/10 text-green-400 rounded-full">{kw}</span>
                    ))}
                  </div>
                </div>
              )}
              {aiContent.missing_keywords?.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs text-dark-muted mb-1">Missing Keywords</p>
                  <div className="flex flex-wrap gap-1">
                    {aiContent.missing_keywords.map((kw) => (
                      <span key={kw} className="px-2 py-0.5 text-xs bg-red-500/10 text-red-400 rounded-full">{kw}</span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {aiContent && !ai.loading && activeAI !== 'matchScore' && (
            <CoverLetterView
              title={aiTitles[activeAI]}
              content={typeof aiContent === 'string' ? aiContent : aiContent[activeAI] || JSON.stringify(aiContent, null, 2)}
              onClose={() => setActiveAI(null)}
            />
          )}
        </motion.div>

        {/* AI Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="space-y-4"
        >
          <div className="glass rounded-xl p-5">
            <h3 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <svg className="w-4 h-4 text-brand" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              AI Tools
            </h3>
            <div className="space-y-2">
              <AIButton
                label="Cover Letter"
                variant="default"
                loading={ai.loading && activeAI === 'coverLetter'}
                onClick={() => handleAI('coverLetter')}
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                }
              />
              <AIButton
                label="Interview Prep"
                variant="warning"
                loading={ai.loading && activeAI === 'interviewQuestions'}
                onClick={() => handleAI('interviewQuestions')}
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                }
              />
              <AIButton
                label="Follow-Up Email"
                variant="info"
                loading={ai.loading && activeAI === 'followUpEmail'}
                onClick={() => handleAI('followUpEmail')}
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />
              <AIButton
                label="Match Score"
                variant="success"
                loading={ai.loading && activeAI === 'matchScore'}
                onClick={() => handleAI('matchScore')}
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                }
              />
              <AIButton
                label="Resume Tips"
                variant="purple"
                loading={ai.loading && activeAI === 'resumeTips'}
                onClick={() => handleAI('resumeTips')}
                icon={
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                }
              />
            </div>
            {!app.jobDescription && (
              <p className="text-xs text-yellow-400/80 mt-3">
                Add a job description for better AI results.
              </p>
            )}
          </div>
        </motion.div>
      </div>

      <EditApplicationModal open={editOpen} onClose={() => setEditOpen(false)} application={app} />
    </DashboardLayout>
  );
}
