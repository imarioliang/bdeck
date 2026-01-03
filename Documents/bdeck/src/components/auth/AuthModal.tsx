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
    <div className="fixed inset-0 bg-[#0a0a0a]/95 backdrop-blur-md z-[100] flex items-center justify-center p-4">
      <div className="bg-[#111111] border border-terminal-main/30 p-8 w-full max-w-sm space-y-6 shadow-[0_0_50px_-20px_rgba(255,157,0,0.2)] relative">
        <button 
            onClick={() => setAuthModalOpen(false)}
            className="absolute top-4 right-4 text-white/20 hover:text-terminal-red transition-colors"
        >
            <X size={16} />
        </button>

        <div className="flex flex-col items-center gap-2">
            <ShieldCheck className="text-terminal-main mb-2" size={32} />
            <h3 className="text-terminal-main text-sm font-black tracking-[0.2em] uppercase leading-none">
                {isLogin ? 'AUTHENTICATION PROTOCOL' : 'IDENTITY REGISTRATION'}
            </h3>
        </div>

        {error && (
            <div className="bg-terminal-red/10 border border-terminal-red/20 p-3 flex gap-2 items-center text-terminal-red text-[10px] font-mono">
                <AlertTriangle size={12} />
                <span>{error.toUpperCase()}</span>
            </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.5rem] font-black text-white/20 uppercase tracking-widest">Operator ID</label>
            <input 
              type="email" 
              value={email} 
              onChange={e => setEmail(e.target.value)}
              placeholder="OPERATOR_ID (EMAIL)..." 
              className="w-full bg-white/[0.02] border border-white/5 p-3 text-[0.65rem] font-bold focus:outline-none focus:border-terminal-main/40 transition-all uppercase tracking-widest text-white/80"
              required
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[0.5rem] font-black text-white/20 uppercase tracking-widest">Access Code</label>
            <input 
              type="password" 
              value={password} 
              onChange={e => setPassword(e.target.value)}
              placeholder="ACCESS_CODE (PASSWORD)..." 
              className="w-full bg-white/[0.02] border border-white/5 p-3 text-[0.65rem] font-bold focus:outline-none focus:border-terminal-main/40 transition-all uppercase tracking-widest text-white/80"
              required
            />
          </div>

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-terminal-main text-black px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_0_10px_-2px_rgba(255,176,0,0.4)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'PROCESSING...' : (isLogin ? 'INITIATE SESSION' : 'ESTABLISH IDENTITY')}
          </button>
        </form>

        <div className="text-center">
            <button 
                onClick={() => { setIsLogin(!isLogin); setError(null); }}
                className="text-[9px] font-bold text-white/30 hover:text-terminal-main uppercase tracking-wider transition-colors"
            >
                {isLogin ? 'Create New Identity' : 'Return to Login'}
            </button>
        </div>
      </div>
    </div>
  );
};
