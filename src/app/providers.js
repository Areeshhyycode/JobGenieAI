'use client';

import { SessionProvider } from 'next-auth/react';
import ReduxProvider from '@/store/provider';

export default function Providers({ children }) {
  return (
    <SessionProvider>
      <ReduxProvider>
        {children}
      </ReduxProvider>
    </SessionProvider>
  );
}
