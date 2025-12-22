'use client';
import { ReactNode, useEffect } from 'react';
import { initBotProtection } from '@/lib/botid-client';

export default function BotIdProvider({ children }: { children: ReactNode }) {
  useEffect(() => {
    initBotProtection();
  }, []);

  return <>{children}</>;
}
