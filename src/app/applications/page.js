'use client';

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchApplications, deleteApplication } from '@/store/slices/applicationSlice';
import { motion, AnimatePresence } from 'framer-motion';
import DashboardLayout from '@/components/DashboardLayout';
import ApplicationCard from '@/components/ApplicationCard';
import AddApplicationModal from '@/components/AddApplicationModal';

const statuses = ['All', 'Applied', 'Interview', 'Offer', 'Rejected'];

export default function ApplicationsPage() {
  const dispatch = useDispatch();
  const { items, loading } = useSelector((s) => s.applications);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const filters = {};
    if (statusFilter !== 'All') filters.status = statusFilter;
    if (search) filters.search = search;
    dispatch(fetchApplications(filters));
  }, [dispatch, statusFilter, search]);

  const handleDelete = async (id) => {
    if (confirm('Delete this application?')) {
      dispatch(deleteApplication(id));
    }
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold">Applications</h1>
          <p className="text-dark-muted text-sm mt-1">{items.length} total applications</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-2 px-5 py-2.5 bg-brand rounded-xl text-white text-sm font-medium hover:bg-brand-dark transition-colors shadow-lg shadow-brand/20"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add Application
        </motion.button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1 max-w-md">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark-muted"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search company or role..."
            className="w-full pl-10 pr-4 py-2.5 bg-dark-card border border-dark-border rounded-xl text-sm focus:outline-none focus:border-brand transition-colors"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {statuses.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-xl text-xs font-medium transition-all ${
                statusFilter === s
                  ? 'bg-brand text-white'
                  : 'bg-dark-card border border-dark-border text-dark-muted hover:text-dark-text'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Applications Grid */}
      {loading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-40 glass rounded-xl animate-pulse" />
          ))}
        </div>
      ) : items.length > 0 ? (
        <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {items.map((app) => (
              <ApplicationCard key={app._id} app={app} onDelete={handleDelete} />
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-20"
        >
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-dark-card flex items-center justify-center">
            <svg className="w-8 h-8 text-dark-muted" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
          <p className="text-dark-muted">No applications found</p>
          <button
            onClick={() => setModalOpen(true)}
            className="mt-4 text-brand hover:text-brand-light text-sm font-medium transition-colors"
          >
            Add your first application
          </button>
        </motion.div>
      )}

      <AddApplicationModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </DashboardLayout>
  );
}
