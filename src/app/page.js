'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const features = [
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
      </svg>
    ),
    title: 'Track Applications',
    desc: 'Organize all your job applications in one place with status tracking and filters.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: 'AI-Powered Insights',
    desc: 'Generate cover letters, interview questions, and get resume tips with AI.',
  },
  {
    icon: (
      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Dashboard Analytics',
    desc: 'Visualize your job search progress with charts and statistics.',
  },
];

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.15, duration: 0.5, ease: 'easeOut' },
  }),
};

export default function Home() {
  const { data: session } = useSession();

  return (
    <main className="min-h-screen bg-dark-bg">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 glass">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold gradient-text">
            JobGenie AI
          </Link>
          <div className="flex items-center gap-4">
            {session ? (
              <Link
                href="/dashboard"
                className="px-5 py-2 bg-brand rounded-lg text-white font-medium hover:bg-brand-dark transition-colors"
              >
                Dashboard
              </Link>
            ) : (
              <>
                <Link href="/login" className="text-dark-muted hover:text-dark-text transition-colors">
                  Sign In
                </Link>
                <Link
                  href="/signup"
                  className="px-5 py-2 bg-brand rounded-lg text-white font-medium hover:bg-brand-dark transition-colors"
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-4xl sm:text-6xl font-bold mb-6"
          >
            Land Your Dream Job with{' '}
            <span className="gradient-text">AI-Powered</span> Tracking
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg sm:text-xl text-dark-muted mb-10 max-w-2xl mx-auto"
          >
            Track applications, generate cover letters, prepare for interviews, and get
            AI-driven insights all in one beautiful dashboard.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              href="/signup"
              className="px-8 py-3.5 bg-brand rounded-xl text-white font-semibold text-lg hover:bg-brand-dark transition-all hover:scale-105 shadow-lg shadow-brand/25"
            >
              Get Started Free
            </Link>
            <a
              href="#features"
              className="px-8 py-3.5 border border-dark-border rounded-xl text-dark-text font-semibold text-lg hover:bg-dark-card transition-all"
            >
              Learn More
            </a>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <motion.h2
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-center mb-14"
          >
            Everything You Need to <span className="gradient-text">Succeed</span>
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                custom={i}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeUp}
                className="glass rounded-2xl p-8 hover:border-brand/50 transition-colors group"
              >
                <div className="w-14 h-14 rounded-xl bg-brand/10 text-brand flex items-center justify-center mb-5 group-hover:bg-brand/20 transition-colors">
                  {f.icon}
                </div>
                <h3 className="text-xl font-semibold mb-3">{f.title}</h3>
                <p className="text-dark-muted leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto glass rounded-3xl p-10 sm:p-14 text-center"
        >
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Ready to Supercharge Your Job Search?
          </h2>
          <p className="text-dark-muted text-lg mb-8">
            Join thousands of job seekers using AI to land interviews faster.
          </p>
          <Link
            href="/signup"
            className="inline-block px-10 py-4 bg-brand rounded-xl text-white font-semibold text-lg hover:bg-brand-dark transition-all hover:scale-105 shadow-lg shadow-brand/25"
          >
            Start Tracking for Free
          </Link>
        </motion.div>
      </section>
    </main>
  );
}
