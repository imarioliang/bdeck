'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { supabase } from '@/utils/supabaseClient';
import { X, ShieldCheck, AlertTriangle } from 'lucide-react';

export const AuthModal = () => {
  const { authModalOpen, setAuthModalOpen, setSession } = useAuthStore();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!authModalOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.session) {
            setSession(data.session);
            setAuthModalOpen(false);
        }
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password });
        if (error) throw error;
         // For signup, we might not get a session immediately if email confirmation is on.
         // But usually in dev it works.
         if (data.session) {
             setSession(data.session);
             setAuthModalOpen(false);
         } else {
             // Maybe show message "Check your email"
             setError('Identity verification initiated. Check transmission logs (email).');
         }
      }
    } catch (err: any) {
      setError(err.message || 'Authentication Protocol Failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[150] flex items-center justify-center p-4 animate-in fade-in zoom-in-95 duration-200" onClick={() => setAuthModalOpen(false)}>
      <div 
        className="w-full max-w-sm bg-black border border-terminal-main shadow-[0_0_30px_-10px_var(--terminal-main)] overflow-hidden flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Retro Header Bar */}
        <div className="bg-terminal-main text-black px-3 py-1 flex justify-between items-center font-black text-[9px] tracking-widest retro-invert">
          <span>[ AUTH_GATE ]</span>
          <div className="flex gap-4 items-center">
            <span>_</span>
            <button 
              onClick={() => setAuthModalOpen(false)} 
              className="hover:bg-black hover:text-terminal-main px-1 transition-colors font-black"
            >
              X
            </button>
          </div>
        </div>

        <div className="p-8 space-y-6 overflow-y-auto max-h-[80vh] custom-scrollbar">
          <div className="flex flex-col items-center gap-2">
            <ShieldCheck className="text-terminal-main mb-2" size={32} />
            <h3 className="text-terminal-main text-xs font-black tracking-[0.2em] uppercase leading-none">
                {isLogin ? 'USER_LOGIN' : 'USER_SIGNUP'}
            </h3>
            <div className="border-b border-terminal-main/20 border-dashed pt-2 w-full mx-auto max-w-[80%]" />
          </div>

          {error && (
            <div className="bg-terminal-red/10 border border-terminal-red/20 p-3 flex gap-2 items-center text-terminal-red text-[10px] font-mono">
                <AlertTriangle size={12} />
                <span>{error.toUpperCase()}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.5rem] font-black text-terminal-main uppercase tracking-widest">Operator ID</label>
              <input 
                type="email" 
                value={email} 
                onChange={e => setEmail(e.target.value)}
                placeholder="OPERATOR_ID (EMAIL)..." 
                className="w-full bg-white/[0.02] border border-terminal-main/20 p-3 text-[0.65rem] font-bold focus:outline-none focus:border-terminal-main/60 hover:border-terminal-main/40 transition-all uppercase tracking-widest text-terminal-main"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-[0.5rem] font-black text-terminal-main uppercase tracking-widest">Access Code</label>
              <input 
                type="password" 
                value={password} 
                onChange={e => setPassword(e.target.value)}
                placeholder="ACCESS_CODE (PASSWORD)..." 
                className="w-full bg-white/[0.02] border border-terminal-main/20 p-3 text-[0.65rem] font-bold focus:outline-none focus:border-terminal-main/60 hover:border-terminal-main/40 transition-all uppercase tracking-widest text-terminal-main"
                required
              />
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-terminal-main text-black px-6 py-3 text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed retro-btn-filled"
            >
              {loading ? 'PROCESSING...' : (isLogin ? 'INITIATE SESSION' : 'ESTABLISH IDENTITY')}
            </button>
          </form>

          <div className="text-center pt-2">
            <button 
                onClick={() => { setIsLogin(!isLogin); setError(null); }}
                className="text-[9px] font-bold text-terminal-main/50 hover:text-terminal-main uppercase tracking-wider transition-colors border-b border-transparent hover:border-terminal-main/50"
            >
                {isLogin ? 'Create New Identity' : 'Return to Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};