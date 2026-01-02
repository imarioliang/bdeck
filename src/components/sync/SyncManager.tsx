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

  // Debounced pushers
  const pushLinks = useRef(debounce((data) => pushToCloud('links', data), 2000)).current;
  const pushTodos = useRef(debounce((data) => pushToCloud('todos', data), 2000)).current;
  const pushTimers = useRef(debounce((data) => pushToCloud('timers', data), 2000)).current;
  const pushNote = useRef(debounce((data) => pushToCloud('notes', data), 2000)).current;

  // Sync on change (only if user is logged in)
  useEffect(() => { if (user) pushLinks(links); }, [links, user]);
  useEffect(() => { if (user) pushTodos(todos); }, [todos, user]);
  useEffect(() => { if (user) pushTimers(timers); }, [timers, user]);
  useEffect(() => { if (user) pushNote(note); }, [note, user]);

  // Initial Fetch / Merge on Login
  useEffect(() => {
    if (!user) return;

    const sync = async () => {
      // 1. Push Local to Cloud (Merge Strategy: Push local first to ensure no data loss)
      await pushToCloud('links', links);
      await pushToCloud('todos', todos);
      await pushToCloud('timers', timers);
      await pushToCloud('notes', note);

      // 2. Fetch from Cloud (to get the union or latest state)
      const cloudLinks = await fetchFromCloud('links');
      if (cloudLinks && cloudLinks.length > 0) {
        cloudLinks.sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
        setLinks(cloudLinks.map(mapLinkToLocal));
      }

      const cloudTodos = await fetchFromCloud('todos');
      if (cloudTodos && cloudTodos.length > 0) {
        cloudTodos.sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
        setTodos(cloudTodos.map(mapTodoToLocal));
      }

      const cloudTimers = await fetchFromCloud('timers');
      if (cloudTimers && cloudTimers.length > 0) {
        cloudTimers.sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
        setTimers(cloudTimers.map(mapTimerToLocal));
      }

      const cloudNotes = await fetchFromCloud('notes');
      if (cloudNotes && cloudNotes.length > 0) {
        // Take the most recent one? Schema says PK is user_id, so only one.
        setNote(mapNoteToLocal(cloudNotes[0]));
      }
    };

    sync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); // Only run when user ID changes (login)

  return null;
};
