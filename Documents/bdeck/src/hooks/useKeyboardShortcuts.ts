'use client';

import { useEffect } from 'react';
import { useDashboardStore } from '@/store/useDashboardStore';

export const useKeyboardShortcuts = () => {
  const { setActiveCategory } = useDashboardStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      if (isTyping && e.key !== 'Escape') return;

      // Handle Escape to unfocus
      if (e.key === 'Escape') {
        target.blur();
        return;
      }

      // Feature Access
      if (e.key === 'p') {
        const timerInput = document.querySelector('[placeholder*="PROJECT_ID"]') as HTMLInputElement;
        if (timerInput) timerInput.focus();
        else document.getElementById('pane-timers')?.scrollIntoView({ behavior: 'smooth' });
      }

      if (e.key === 'n') {
        const notesArea = document.querySelector('textarea[placeholder*="SYSTEM LOG"]') as HTMLTextAreaElement;
        if (notesArea) notesArea.focus();
      }

      if (e.key === 't') {
        const todoInput = document.querySelector('[placeholder*="MISSION OBJECTIVE"]') as HTMLInputElement;
        if (todoInput) todoInput.focus();
      }

      // Tab Switching (1-5)
      const categories = ['ALL SYSTEMS', 'DEVELOPMENT', 'COMMUNICATION', 'ANALYTICS', 'SYSTEM'];
      if (e.key >= '1' && e.key <= '5') {
        const index = parseInt(e.key) - 1;
        if (categories[index]) {
          setActiveCategory(categories[index]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setActiveCategory]);
};
