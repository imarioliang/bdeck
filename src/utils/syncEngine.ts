import { supabase } from './supabaseClient';
import { useAuthStore } from '@/store/useAuthStore';

// Mappers (Cloud -> Local will be needed too, but let's stick to Push first as per test)

const mapLinkToCloud = (link: any, userId: string, index: number) => ({
  id: link.id,
  user_id: userId,
  title: link.title,
  url: link.url,
  category: link.category,
  tags: link.tags || [],
  is_pinned: link.isPinned,
  position: index
});

const mapTodoToCloud = (todo: any, userId: string, index: number) => ({
  id: todo.id,
  user_id: userId,
  text: todo.text,
  done: todo.done,
  level: todo.level,
  position: index
});

const mapTimerToCloud = (timer: any, userId: string, index: number) => ({
  id: timer.id,
  user_id: userId,
  name: timer.name,
  time: timer.time,
  is_active: timer.isActive,
  session_start_time: timer.sessionStartTime,
  position: index
});

const mapNoteToCloud = (note: string, userId: string, index: number) => ({
  user_id: userId,
  content: note,
  position: index,
  updated_at: new Date().toISOString()
});

// Reverse Mappers
export const mapLinkToLocal = (row: any) => ({
  id: row.id,
  title: row.title,
  url: row.url,
  category: row.category,
  tags: row.tags || [],
  isPinned: row.is_pinned
});

export const mapTodoToLocal = (row: any) => ({
  id: row.id,
  text: row.text,
  done: row.done,
  level: row.level
});

export const mapTimerToLocal = (row: any) => ({
  id: row.id,
  name: row.name,
  time: row.time,
  isActive: row.is_active,
  sessionStartTime: row.session_start_time
});

export const mapNoteToLocal = (row: any) => row.content;

export const pushToCloud = async (table: string, data: any) => {
  const user = useAuthStore.getState().user;
  if (!user) return { error: null };

  let payload: any[] = [];
  
  if (table === 'links' && Array.isArray(data)) {
    payload = data.map((item: any, i: number) => mapLinkToCloud(item, user.id, i));
  } else if (table === 'todos' && Array.isArray(data)) {
    payload = data.map((item: any, i: number) => mapTodoToCloud(item, user.id, i));
  } else if (table === 'timers' && Array.isArray(data)) {
    payload = data.map((item: any, i: number) => mapTimerToCloud(item, user.id, i));
  } else if (table === 'notes' && Array.isArray(data)) { // Handle array of notes
    payload = data.map((noteContent: string, i: number) => mapNoteToCloud(noteContent, user.id, i));
  }

  // Handle array-based tables (links, todos, timers, notes)
  if (Array.isArray(data) && (table === 'links' || table === 'todos' || table === 'timers' || table === 'notes')) {
    // 1. Delete all existing records for this user to sync deletions
    const { error: deleteError } = await supabase.from(table).delete().eq('user_id', user.id);
    if (deleteError) {
      console.error(`Sync delete error ${table}:`, deleteError.message);
      return { error: deleteError };
    }

    // 2. Insert new records if any exist
    if (payload.length > 0) {
      const { error: insertError } = await supabase.from(table).insert(payload);
      if (insertError) {
        console.error(`Sync insert error ${table}:`, insertError.message);
        return { error: insertError };
      }
    }
  } else if (payload.length > 0) {
    // This case should ideally not be reached with current data structures
    const { error } = await supabase.from(table).upsert(payload);
    if (error) {
      console.error(`Sync error ${table}:`, error.message, error.details, error.hint);
      return { error };
    }
  }
  
  return { error: null };
};

export const fetchFromCloud = async (table: string) => {
  const user = useAuthStore.getState().user;
  if (!user) return { data: null, error: null };

  const { data, error } = await supabase.from(table).select('*').eq('user_id', user.id);
  
  if (error) {
    console.error(`Fetch error ${table}:`, error);
    return { data: null, error };
  }
  
  // Sort notes by position if fetching notes
  if (table === 'notes' && data && data.length > 0) {
    data.sort((a: any, b: any) => (a.position || 0) - (b.position || 0));
  }
  
  return { data, error: null };
};
