'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import StatusBadge from './StatusBadge';

export default function ApplicationCard({ app, onDelete }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="glass rounded-xl p-5 hover:border-brand/30 transition-all group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex-1 min-w-0">
          <Link href={`/applications/${app._id}`} className="hover:text-brand transition-colors">
            <h3 className="font-semibold text-base truncate">{app.company}</h3>
          </Link>
          <p className="text-sm text-dark-muted truncate">{app.role}</p>
        </div>
        <StatusBadge status={app.status} />
      </div>

      <div className="flex items-center gap-4 text-xs text-dark-muted mb-4">
        {app.location && (
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {app.location}
          </span>
        )}
        {app.salary && (
          <span className="flex items-center gap-1">
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {app.salary}
          </span>
        )}
        <span className="flex items-center gap-1">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          {new Date(app.appliedDate).toLocaleDateString()}
        </span>
      </div>

      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Link
          href={`/applications/${app._id}`}
          className="flex-1 text-center py-1.5 text-xs font-medium bg-brand/10 text-brand rounded-lg hover:bg-brand/20 transition-colors"
        >
          View Details
        </Link>
        <button
          onClick={() => onDelete?.(app._id)}
          className="px-3 py-1.5 text-xs font-medium bg-red-500/10 text-red-400 rounded-lg hover:bg-red-500/20 transition-colors"
        >
          Delete
        </button>
      </div>
    </motion.div>
  );
}
