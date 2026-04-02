'use client';

import { motion } from 'framer-motion';

export default function AIButton({ label, icon, onClick, loading, variant = 'default' }) {
  const variants = {
    default: 'bg-brand/10 text-brand hover:bg-brand/20 border-brand/20',
    success: 'bg-green-500/10 text-green-400 hover:bg-green-500/20 border-green-500/20',
    warning: 'bg-yellow-500/10 text-yellow-400 hover:bg-yellow-500/20 border-yellow-500/20',
    info: 'bg-blue-500/10 text-blue-400 hover:bg-blue-500/20 border-blue-500/20',
    purple: 'bg-purple-500/10 text-purple-400 hover:bg-purple-500/20 border-purple-500/20',
  };

  return (
    <motion.button
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      disabled={loading}
      className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors disabled:opacity-50 ${variants[variant]}`}
    >
      {loading ? (
        <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        icon
      )}
      {loading ? 'Generating...' : label}
    </motion.button>
  );
}
