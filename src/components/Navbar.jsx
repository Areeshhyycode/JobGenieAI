'use client';

import { useSession, signOut } from 'next-auth/react';
import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ onToggleSidebar }) {
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 glass">
      <div className="h-full px-4 sm:px-6 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-lg hover:bg-dark-border/50 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link href="/dashboard" className="text-lg font-bold gradient-text">
            JobGenie AI
          </Link>
        </div>

        {/* Right */}
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard"
            className="hidden sm:block text-sm text-dark-muted hover:text-dark-text transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="/applications"
            className="hidden sm:block text-sm text-dark-muted hover:text-dark-text transition-colors"
          >
            Applications
          </Link>

          {session?.user && (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-lg hover:bg-dark-border/50 transition-colors"
              >
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt="avatar"
                    width={32}
                    height={32}
                    className="rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-brand flex items-center justify-center text-white text-sm font-medium">
                    {session.user.name?.[0] || 'U'}
                  </div>
                )}
              </button>

              <AnimatePresence>
                {menuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 mt-2 w-56 glass rounded-xl p-2 shadow-xl"
                  >
                    <div className="px-3 py-2 border-b border-dark-border mb-1">
                      <p className="text-sm font-medium truncate">{session.user.name}</p>
                      <p className="text-xs text-dark-muted truncate">{session.user.email}</p>
                    </div>
                    <Link
                      href="/dashboard"
                      onClick={() => setMenuOpen(false)}
                      className="block px-3 py-2 text-sm rounded-lg hover:bg-dark-border/50 transition-colors"
                    >
                      Dashboard
                    </Link>
                    <Link
                      href="/applications"
                      onClick={() => setMenuOpen(false)}
                      className="block px-3 py-2 text-sm rounded-lg hover:bg-dark-border/50 transition-colors"
                    >
                      Applications
                    </Link>
                    <button
                      onClick={() => signOut({ callbackUrl: '/' })}
                      className="w-full text-left px-3 py-2 text-sm rounded-lg text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      Sign Out
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
