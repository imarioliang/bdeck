'use client';

import { useEffect } from 'react';
import { useDashboardStore } from '@/store/useDashboardStore';

export const useKeyboardShortcuts = () => {
  const { 
    setActiveCategory, 
    setIsConfigOpen, isConfigOpen,
    setIsSearchExpanded, isSearchExpanded,
    setIsAddingLink,
    setIsAddingTimer,
    setActiveNoteIndex, activeNoteIndex,
    activeCategory
  } = useDashboardStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if user is typing in an input/textarea
      const target = e.target as HTMLElement;
      const isTyping = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA';

      // Global Escape handling
      if (e.key === 'Escape') {
        if (isTyping) {
          target.blur();
        } else {
          setIsConfigOpen(false);
          setIsSearchExpanded(false);
          setIsAddingLink(false);
          setIsAddingTimer(false);
        }
        return;
      }

      if (isTyping) return;

      // --- SYSTEM NAVIGATION ---
      
      // Menu (m)
      if (e.key === 'm') {
        e.preventDefault();
        setIsConfigOpen(!isConfigOpen);
      }

      // Search (/)
      if (e.key === '/') {
        e.preventDefault();
        setIsSearchExpanded(true);
        setTimeout(() => {
          document.getElementById('global-search-input')?.focus();
        }, 50);
      }

      // --- FEATURE SHORTCUTS ---

      // Add Link (l)
      if (e.key === 'l') {
        e.preventDefault();
        setIsAddingLink(true);
      }

      // Add Timer/Project (p)
      if (e.key === 'p') {
        e.preventDefault();
        setIsAddingTimer(true);
      }

      // Focus Todo (t)
      if (e.key === 't') {
        e.preventDefault();
        const todoInput = document.querySelector('input[placeholder*="OBJECTIVE"]') as HTMLInputElement;
        if (todoInput) todoInput.focus();
      }

      // Focus Note (n)
      if (e.key === 'n') {
        e.preventDefault();
        const noteArea = document.querySelector('textarea[placeholder*="LOG"]') as HTMLTextAreaElement;
        if (noteArea) noteArea.focus();
      }

      // --- TAB SWITCHING ---

      // Category Switching (1-5)
      const categories = ['ALL SYSTEMS', 'DEVELOPMENT', 'COMMUNICATION', 'ANALYTICS', 'SYSTEM'];
      if (e.key >= '1' && e.key <= '5' && !e.ctrlKey && !e.altKey) {
        const index = parseInt(e.key) - 1;
        if (categories[index]) {
          setActiveCategory(categories[index]);
        }
      }

      // Note Log Switching (Alt + 1-3)
      if (e.altKey && e.key >= '1' && e.key <= '3') {
        e.preventDefault();
        setActiveNoteIndex(parseInt(e.key) - 1);
      }

      // Cycle Categories (Tab / Shift+Tab)
      if (e.key === 'Tab' && !isTyping) {
        e.preventDefault();
        const currentIndex = categories.indexOf(activeCategory);
        let nextIndex = e.shiftKey ? currentIndex - 1 : currentIndex + 1;
        if (nextIndex >= categories.length) nextIndex = 0;
        if (nextIndex < 0) nextIndex = categories.length - 1;
        setActiveCategory(categories[nextIndex]);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    setActiveCategory, setIsConfigOpen, isConfigOpen, 
    setIsSearchExpanded, isSearchExpanded, setIsAddingLink, 
    setIsAddingTimer, setActiveNoteIndex, activeNoteIndex, activeCategory
  ]);
};
