'use client';

import { useEffect, useRef } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { pushToCloud, fetchFromCloud, mapLinkToLocal, mapTodoToLocal, mapTimerToLocal, mapNoteToLocal } from '@/utils/syncEngine';
import { supabase } from '@/utils/supabaseClient';
import debounce from 'lodash.debounce';

export const SyncManager = () => {
  const { user, setSession } = useAuthStore();
  
  const [links, setLinks] = useLocalStorage<any[]>('bdeck-links', []);
  const [todos, setTodos] = useLocalStorage<any[]>('bdeck-todos', []);
  const [timers, setTimers] = useLocalStorage<any[]>('bdeck-timers', []);
  const [note, setNote] = useLocalStorage<string>('bdeck-note', '');
  const [lastUserId, setLastUserId] = useLocalStorage<string | null>('bdeck-last-user-id', null);

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
      const isUserSwitch = lastUserId && lastUserId !== user.id;

      // 1. Pre-Fetch: Push Local if Merging (Anonymous -> User)
      // If switching users, we skip this to avoid polluting the new user's account with old user's data.
      if (!isUserSwitch) {
          await pushToCloud('links', links);
          await pushToCloud('todos', todos);
          await pushToCloud('timers', timers);
          await pushToCloud('notes', note);
      }

      // 2. Fetch from Cloud (Will now include merged data)
      const cloudLinks = await fetchFromCloud('links');
      const cloudTodos = await fetchFromCloud('todos');
      const cloudTimers = await fetchFromCloud('timers');
      const cloudNotes = await fetchFromCloud('notes');

      // 3. Update Local State
      
      // LINKS
      if (cloudLinks && cloudLinks.length > 0) {
         cloudLinks.sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
         setLinks(cloudLinks.map(mapLinkToLocal));
      } else if (isUserSwitch) {
         // New user has no data, wipe local
         setLinks([]);
      }

      // TODOS
      if (cloudTodos && cloudTodos.length > 0) {
         cloudTodos.sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
         setTodos(cloudTodos.map(mapTodoToLocal));
      } else if (isUserSwitch) {
         setTodos([]);
      }

      // TIMERS
      if (cloudTimers && cloudTimers.length > 0) {
         cloudTimers.sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
         setTimers(cloudTimers.map(mapTimerToLocal));
      } else if (isUserSwitch) {
         setTimers([]);
      }

      // NOTES
      if (cloudNotes && cloudNotes.length > 0) {
         setNote(mapNoteToLocal(cloudNotes[0]));
      } else if (isUserSwitch) {
         setNote('');
      }

      // 4. Mark Initialized and Update Last User
      setLastUserId(user.id);
      initialized.current = true;
    };

    sync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id]); 

  return null;
};