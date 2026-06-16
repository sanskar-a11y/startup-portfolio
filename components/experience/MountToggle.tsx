'use client';
import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const SystemOrchestrator = dynamic(() => import('../landing/SystemOrchestrator'), { ssr: false });

export default function MountToggle() {
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      window.__MOUNT__ = () => setMounted(true);
      window.__UNMOUNT__ = () => setMounted(false);
    }
  }, []);

  return mounted ? <SystemOrchestrator /> : null;
}
