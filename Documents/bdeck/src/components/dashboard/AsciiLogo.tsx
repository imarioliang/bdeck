'use client';

import React from 'react';
import { Terminal } from 'lucide-react';

export const AsciiLogo = () => {
  return (
    <div className="text-terminal-main group-hover:text-white transition-colors duration-300 drop-shadow-[0_0_8px_rgba(255,176,0,0.3)] group-hover:drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]">
      <Terminal size={32} strokeWidth={2.5} />
    </div>
  );
};