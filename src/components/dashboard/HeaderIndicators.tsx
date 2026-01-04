'use client';

import { useDashboardStore } from '@/store/useDashboardStore';
import { useSkin } from '@/hooks/useSkin';
import { RefreshCw, CheckCircle2, AlertCircle, GitBranch } from 'lucide-react';
import { useEffect, useState } from 'react';

export const HeaderIndicators = () => {
  const { syncStatus } = useDashboardStore();
  const skin = useSkin();
  const isRetro = skin === 'retro';
  const [isDev, setIsDev] = useState(false);

  useEffect(() => {
    setIsDev(process.env.NODE_ENV === 'development');
  }, []);

  return (
    <div className="flex items-center gap-4">
      {/* SYNC INDICATOR */}
      <div className={`flex items-center gap-1.5 px-2 py-0.5 border transition-all ${
        isRetro ? (
          syncStatus === 'syncing' ? 'border-terminal-main text-terminal-main animate-pulse' :
          syncStatus === 'error' ? 'border-terminal-red text-terminal-red' :
          'border-terminal-main/20 text-terminal-main/40'
        ) : (
          syncStatus === 'syncing' ? 'border-terminal-main/50 text-terminal-main animate-pulse' :
          syncStatus === 'error' ? 'border-terminal-red/50 text-terminal-red' :
          'border-white/5 text-white/20 rounded-sm'
        )
      }`}>
        {syncStatus === 'syncing' ? (
          <>
            {!isRetro && <RefreshCw size={10} className="animate-spin" />}
            <span className={`font-black uppercase ${isRetro ? 'text-[10px]' : 'text-[0.55rem] tracking-widest'}`}>{isRetro ? '[SYNC...]' : 'Transmitting...'}</span>
          </>
        ) : syncStatus === 'error' ? (
          <>
            {!isRetro && <AlertCircle size={10} />}
            <span className={`font-black uppercase ${isRetro ? 'text-[10px]' : 'text-[0.55rem] tracking-widest'}`}>{isRetro ? '[SYNC_ERR]' : 'Sync_Err'}</span>
          </>
        ) : (
          <>
            {!isRetro && <CheckCircle2 size={10} className="text-terminal-green/40" />}
            <span className={`font-black uppercase ${isRetro ? 'text-[10px]' : 'text-[0.55rem] tracking-widest'}`}>{isRetro ? '[SYNC_OK]' : 'Sync_Ok'}</span>
          </>
        )}
      </div>

      {/* DEV BRANCH INDICATOR */}
      {isDev && (
        <div className={`flex items-center gap-1.5 transition-colors ${isRetro ? 'text-terminal-main/30' : 'text-white/10 hover:text-white/30'}`}>
          {!isRetro && <GitBranch size={10} />}
          <span className={`font-black uppercase italic ${isRetro ? 'text-[10px]' : 'text-[0.55rem] tracking-widest'}`}>
            {isRetro ? 'DEV_MOD: ENABLED' : 'Dev_Branch: addLogin'}
          </span>
        </div>
      )}
    </div>
  );
};
