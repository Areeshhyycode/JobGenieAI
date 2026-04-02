'use client';

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchStats, fetchApplications } from '@/store/slices/applicationSlice';
import { motion } from 'framer-motion';
import Link from 'next/link';
import DashboardLayout from '@/components/DashboardLayout';
import StatsCards from '@/components/StatsCards';
import ChartSection from '@/components/ChartSection';
import StatusBadge from '@/components/StatusBadge';

export default function DashboardPage() {
  const dispatch = useDispatch();
  const { items, stats, loading } = useSelector((s) => s.applications);

  useEffect(() => {
    dispatch(fetchStats());
    dispatch(fetchApplications({ sort: '-createdAt' }));
  }, [dispatch]);

  const recentApps = items.slice(0, 5);

  return (
    <DashboardLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-dark-muted text-sm mt-1">Overview of your job search progress</p>
      </div>

      <StatsCards stats={stats} />

      <div className="grid lg:grid-cols-3 gap-6 mt-6">
        <div className="lg:col-span-2">
          <ChartSection chartData={stats?.chartData} />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="glass rounded-xl p-6"
        >
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Recent Applications</h3>
            <Link href="/applications" className="text-xs text-brand hover:text-brand-light transition-colors">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-14 bg-dark-border/30 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : recentApps.length > 0 ? (
            <div className="space-y-2">
              {recentApps.map((app) => (
                <Link
                  key={app._id}
                  href={`/applications/${app._id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-dark-border/30 transition-colors"
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium truncate">{app.company}</p>
                    <p className="text-xs text-dark-muted truncate">{app.role}</p>
                  </div>
                  <StatusBadge status={app.status} />
                </Link>
              ))}
            </div>
          ) : (
            <p className="text-sm text-dark-muted text-center py-8">
              No applications yet.{' '}
              <Link href="/applications" className="text-brand hover:text-brand-light">
                Add one!
              </Link>
            </p>
          )}
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
