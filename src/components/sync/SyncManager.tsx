'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useDashboardStore } from '@/store/useDashboardStore';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { pushToCloud, fetchFromCloud, mapLinkToLocal, mapTodoToLocal, mapTimerToLocal, mapNoteToLocal } from '@/utils/syncEngine';
import { supabase } from '@/utils/supabaseClient';
import debounce from 'lodash.debounce';

export const SyncManager = () => {
  const { user, setSession } = useAuthStore();
  const { setSyncStatus, triggerSync } = useDashboardStore();
  
  const [links, setLinks] = useLocalStorage<any[]>('bdeck-links', []);
  const [todos, setTodos] = useLocalStorage<any[]>('bdeck-todos', []);
  const [timers, setTimers] = useLocalStorage<any[]>('bdeck-timers', []);
  const [notes, setNotes] = useLocalStorage<{ id: string, content: string }[]>('bdeck-notes-multi', 
    [{ id: 'log-01', content: '' }, { id: 'log-02', content: '' }, { id: 'log-03', content: '' }]
  );  const [lastUserId, setLastUserId] = useLocalStorage<string | null>('bdeck-last-user-id', null);

  // Initialization refs to prevent overwriting cloud data on mount
  const initialized = useRef(false);

  // Recovery Session on Mount & Auth Listener
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, [setSession]);

  // Wrap pushToCloud with status reporting
  const pushWithStatus = async (table: string, data: any) => {
    setSyncStatus('syncing');
    const { error } = await pushToCloud(table, data);
    setSyncStatus(error ? 'error' : 'idle');
  };

  // Debounced pushers
  const pushLinks = useRef(debounce((data) => pushWithStatus('links', data), 2000)).current;
  const pushTodos = useRef(debounce((data) => pushWithStatus('todos', data), 2000)).current;
  const pushTimers = useRef(debounce((data) => pushWithStatus('timers', data), 2000)).current;
  const pushNotes = useRef(debounce((data) => pushWithStatus('notes', data), 2000)).current;

  // Sync on change (only if user is logged in AND initialized)
  useEffect(() => { if (user && initialized.current) pushLinks(links); }, [links, user, pushLinks]);
  useEffect(() => { if (user && initialized.current) pushTodos(todos); }, [todos, user, pushTodos]);
  useEffect(() => { if (user && initialized.current) pushTimers(timers); }, [timers, user, pushTimers]);
  useEffect(() => { if (user && initialized.current) pushNotes(notes); }, [notes, user, pushNotes]);

  const syncAndMerge = async () => {
    if (!user) return;
    setSyncStatus('syncing');
    
    try {
      // 1. Always fetch data from the cloud first
      const { data: cloudLinks, error: errLinks } = await fetchFromCloud('links');
      const { data: cloudTodos, error: errTodos } = await fetchFromCloud('todos');
      const { data: cloudTimers, error: errTimers } = await fetchFromCloud('timers');
      const { data: cloudNotes, error: errNotes } = await fetchFromCloud('notes');

      if (errLinks || errTodos || errTimers || errNotes) {
          setSyncStatus('error');
          return;
      }

      // 2. Map Cloud data to Local format
      const remoteLinks = cloudLinks ? cloudLinks.map(mapLinkToLocal) : [];
      const remoteTodos = cloudTodos ? cloudTodos.map(mapTodoToLocal) : [];
      const remoteTimers = cloudTimers ? cloudTimers.map(mapTimerToLocal) : [];
      const remoteNotes = (cloudNotes && cloudNotes.length > 0) ? cloudNotes.map(mapNoteToLocal) : []; 

      // 3. Merge Local and Remote data
      const mergedLinks = remoteLinks.length > 0 ? remoteLinks : links;
      const mergedTodos = remoteTodos.length > 0 ? remoteTodos : todos;
      const mergedTimers = remoteTimers.length > 0 ? remoteTimers : timers;
      
      let mergedNotes = remoteNotes.length > 0 ? remoteNotes : notes;
      if (mergedNotes.length === 0) {
        mergedNotes = [
          { id: 'log-01', content: '' },
          { id: 'log-02', content: '' },
          { id: 'log-03', content: '' }
        ];
      }
      
      // 4. Update Local State
      setLinks(mergedLinks);
      setTodos(mergedTodos);
      setTimers(mergedTimers);
      setNotes(mergedNotes);

      // 5. Ensure all data is pushed to the cloud
      await pushToCloud('links', mergedLinks);
      await pushToCloud('todos', mergedTodos);
      await pushToCloud('timers', mergedTimers);
      await pushToCloud('notes', mergedNotes);

      // 6. Mark Initialized and Update Last User
      setLastUserId(user.id);
      initialized.current = true;
      setSyncStatus('idle');

    } catch (e) {
      console.error("Sync and merge failed:", e);
      setSyncStatus('error');
    }
  };

  // Initial Fetch / Merge on Login
  useEffect(() => {
    if (!user) return;
    if (!initialized.current || (lastUserId !== user.id)) {
      syncAndMerge();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]);

  // Manual Trigger
  useEffect(() => {
    if (triggerSync > 0) {
      syncAndMerge();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [triggerSync]);

  return null;
};