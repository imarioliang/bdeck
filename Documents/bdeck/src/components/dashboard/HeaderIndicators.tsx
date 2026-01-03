'use client';

import { useDashboardStore } from '@/store/useDashboardStore';
import { RefreshCw, CheckCircle2, AlertCircle, GitBranch } from 'lucide-react';
import { useEffect, useState } from 'react';

export const HeaderIndicators = () => {
  const { syncStatus } = useDashboardStore();
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    setIsDev(process.env.NODE_ENV === 'development');
  }, []);

  return (
    <div className="flex items-center gap-4">
      {/* SYNC INDICATOR */}
      <div className={`flex items-center gap-1.5 px-2 py-0.5 border rounded-sm transition-all ${
        syncStatus === 'syncing' ? 'border-terminal-main/50 text-terminal-main animate-pulse' :
        syncStatus === 'error' ? 'border-terminal-red/50 text-terminal-red' :
        'border-white/5 text-white/20'
      }`}>
        {syncStatus === 'syncing' ? (
          <>
            <RefreshCw size={10} className="animate-spin" />
            <span className="text-[0.55rem] font-black tracking-widest uppercase">Transmitting...</span>
          </>
        ) : syncStatus === 'error' ? (
          <>
            <AlertCircle size={10} />
            <span className="text-[0.55rem] font-black tracking-widest uppercase">Sync_Err</span>
          </>
        ) : (
          <>
            <CheckCircle2 size={10} className="text-terminal-green/40" />
            <span className="text-[0.55rem] font-black tracking-widest uppercase">Sync_Ok</span>
          </>
        )}
      </div>

      {/* DEV BRANCH INDICATOR */}
      {isDev && (
        <div className="flex items-center gap-1.5 text-white/10 hover:text-white/30 transition-colors">
          <GitBranch size={10} />
          <span className="text-[0.55rem] font-black tracking-widest uppercase italic">
            Dev_Branch: addLogin
          </span>
        </div>
      )}
    </div>
  );
};
