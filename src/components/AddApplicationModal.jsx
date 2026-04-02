'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useDispatch } from 'react-redux';
import { addApplication } from '@/store/slices/applicationSlice';

const initialForm = {
  company: '',
  role: '',
  jobUrl: '',
  jobDescription: '',
  salary: '',
  location: '',
  status: 'Applied',
  notes: '',
};

export default function AddApplicationModal({ open, onClose }) {
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.company || !form.role) return;
    setSubmitting(true);
    try {
      await dispatch(addApplication(form)).unwrap();
      setForm(initialForm);
      onClose();
    } catch {
      // error handled by redux
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-lg glass rounded-2xl p-6 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Add Application</h2>
              <button
                onClick={onClose}
                className="p-1 rounded-lg hover:bg-dark-border/50 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-dark-muted mb-1">Company *</label>
                  <input
                    name="company"
                    value={form.company}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-sm focus:outline-none focus:border-brand transition-colors"
                    placeholder="Google"
                  />
                </div>
                <div>
                  <label className="block text-sm text-dark-muted mb-1">Role *</label>
                  <input
                    name="role"
                    value={form.role}
                    onChange={handleChange}
                    required
                    className="w-full px-3 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-sm focus:outline-none focus:border-brand transition-colors"
                    placeholder="Frontend Engineer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-dark-muted mb-1">Job URL</label>
                <input
                  name="jobUrl"
                  value={form.jobUrl}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-sm focus:outline-none focus:border-brand transition-colors"
                  placeholder="https://..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-dark-muted mb-1">Salary</label>
                  <input
                    name="salary"
                    value={form.salary}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-sm focus:outline-none focus:border-brand transition-colors"
                    placeholder="$120k - $150k"
                  />
                </div>
                <div>
                  <label className="block text-sm text-dark-muted mb-1">Location</label>
                  <input
                    name="location"
                    value={form.location}
                    onChange={handleChange}
                    className="w-full px-3 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-sm focus:outline-none focus:border-brand transition-colors"
                    placeholder="Remote / NYC"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm text-dark-muted mb-1">Status</label>
                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-sm focus:outline-none focus:border-brand transition-colors"
                >
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm text-dark-muted mb-1">Job Description</label>
                <textarea
                  name="jobDescription"
                  value={form.jobDescription}
                  onChange={handleChange}
                  rows={4}
                  className="w-full px-3 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-sm focus:outline-none focus:border-brand transition-colors resize-none"
                  placeholder="Paste the job description here..."
                />
              </div>

              <div>
                <label className="block text-sm text-dark-muted mb-1">Notes</label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={2}
                  className="w-full px-3 py-2.5 bg-dark-bg border border-dark-border rounded-lg text-sm focus:outline-none focus:border-brand transition-colors resize-none"
                  placeholder="Any additional notes..."
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 border border-dark-border rounded-lg text-sm font-medium hover:bg-dark-border/50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 py-2.5 bg-brand rounded-lg text-white text-sm font-medium hover:bg-brand-dark transition-colors disabled:opacity-50"
                >
                  {submitting ? 'Adding...' : 'Add Application'}
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
