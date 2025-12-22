'use client';
import { initBotId } from 'botid/client/core';

export function initBotProtection() {
  if (typeof window === 'undefined') return; // Only run in browser

  initBotId({
    protect: [
      {
        path: '/api/contact',
        method: 'POST',
      },
    ],
  });
}
