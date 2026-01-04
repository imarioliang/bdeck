'use client';

import { useDashboardStore } from '@/store/useDashboardStore';
import { RefreshCw, CheckCircle2, AlertCircle, GitBranch } from 'lucide-react';
import { useEffect, useState } from 'react';

export const HeaderIndicators = () => {
  const { syncStatus } = useDashboardStore();

  return (
    <div className="flex items-center gap-4">
      {/* SYNC INDICATOR */}
      <div className={`flex items-center gap-1.5 px-2 py-0.5 border transition-all ${
        syncStatus === 'syncing' ? 'border-terminal-main text-terminal-main animate-pulse' :
        syncStatus === 'error' ? 'border-terminal-red text-terminal-red' :
        'border-terminal-main/20 text-terminal-main/40'
      }`}>
        {syncStatus === 'syncing' ? (
          <span className="font-black uppercase text-[10px]">[SYNC...]</span>
        ) : syncStatus === 'error' ? (
          <span className="font-black uppercase text-[10px]">[SYNC_ERR]</span>
        ) : (
          <span className="font-black uppercase text-[10px]">[SYNC_OK]</span>
        )}
      </div>
    </div>
  );
};
