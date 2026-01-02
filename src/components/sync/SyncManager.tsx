'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { pushToCloud, fetchFromCloud, mapLinkToLocal, mapTodoToLocal, mapTimerToLocal, mapNoteToLocal } from '@/utils/syncEngine';
import debounce from 'lodash.debounce';

export const SyncManager = () => {
  const { user } = useAuthStore();
  
  const [links, setLinks] = useLocalStorage<any[]>('bdeck-links', []);
  const [todos, setTodos] = useLocalStorage<any[]>('bdeck-todos', []);
  const [timers, setTimers] = useLocalStorage<any[]>('bdeck-timers', []);
  const [note, setNote] = useLocalStorage<string>('bdeck-note', '');

  // Initialization refs to prevent overwriting cloud data on mount
  const initialized = useRef(false);

  // Debounced pushers
  const pushLinks = useRef(debounce((data) => pushToCloud('links', data), 2000)).current;
  const pushTodos = useRef(debounce((data) => pushToCloud('todos', data), 2000)).current;
  const pushTimers = useRef(debounce((data) => pushToCloud('timers', data), 2000)).current;
  const pushNote = useRef(debounce((data) => pushToCloud('notes', data), 2000)).current;

  // Sync on change (only if user is logged in AND initialized)
  useEffect(() => { if (user && initialized.current) pushLinks(links); }, [links, user]);
  useEffect(() => { if (user && initialized.current) pushTodos(todos); }, [todos, user]);
  useEffect(() => { if (user && initialized.current) pushTimers(timers); }, [timers, user]);
  useEffect(() => { if (user && initialized.current) pushNote(note); }, [note, user]);

  // Initial Fetch / Merge on Login
  useEffect(() => {
    if (!user) return;
    // Reset initialization on user change
    initialized.current = false;

    const sync = async () => {
      // 1. Fetch from Cloud FIRST
      const cloudLinks = await fetchFromCloud('links');
      const cloudTodos = await fetchFromCloud('todos');
      const cloudTimers = await fetchFromCloud('timers');
      const cloudNotes = await fetchFromCloud('notes');

      // 2. Determine Strategy
      
      // LINKS
      if (cloudLinks && cloudLinks.length > 0) {
         // Cloud wins
         cloudLinks.sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
         setLinks(cloudLinks.map(mapLinkToLocal));
      } else {
         // Cloud empty, Push Local (using current closure value 'links')
         await pushToCloud('links', links);
      }

      // TODOS
      if (cloudTodos && cloudTodos.length > 0) {
         cloudTodos.sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
         setTodos(cloudTodos.map(mapTodoToLocal));
      } else {
         await pushToCloud('todos', todos);
      }

      // TIMERS
      if (cloudTimers && cloudTimers.length > 0) {
         cloudTimers.sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
         setTimers(cloudTimers.map(mapTimerToLocal));
      } else {
         await pushToCloud('timers', timers);
      }

      // NOTES
      if (cloudNotes && cloudNotes.length > 0) {
         setNote(mapNoteToLocal(cloudNotes[0]));
      } else {
         await pushToCloud('notes', note);
      }

      // 3. Mark Initialized
      // This enables the listeners above.
      initialized.current = true;
    };

    sync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); 

  return null;
};