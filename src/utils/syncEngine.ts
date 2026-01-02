import { supabase } from './supabaseClient';
import { useAuthStore } from '@/store/useAuthStore';

// Mappers (Cloud -> Local will be needed too, but let's stick to Push first as per test)

const mapLinkToCloud = (link: any, userId: string, index: number) => ({
  id: link.id,
  user_id: userId,
  title: link.title,
  url: link.url,
  category: link.category,
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

const mapNoteToCloud = (note: string, userId: string) => ({
  user_id: userId,
  content: note,
  updated_at: new Date().toISOString()
});

export const pushToCloud = async (table: string, data: any) => {
  const user = useAuthStore.getState().user;
  if (!user) return;

  let payload: any[] = [];
  
  if (table === 'links' && Array.isArray(data)) {
    payload = data.map((item: any, i: number) => mapLinkToCloud(item, user.id, i));
  } else if (table === 'todos' && Array.isArray(data)) {
    payload = data.map((item: any, i: number) => mapTodoToCloud(item, user.id, i));
  } else if (table === 'timers' && Array.isArray(data)) {
    payload = data.map((item: any, i: number) => mapTimerToCloud(item, user.id, i));
  } else if (table === 'notes') {
    payload = [mapNoteToCloud(data, user.id)];
  }

  if (payload.length > 0) {
     const { error } = await supabase.from(table).upsert(payload);
     if (error) console.error(`Sync error ${table}:`, error);
  }
};

export const fetchFromCloud = async (table: string) => {
  const user = useAuthStore.getState().user;
  if (!user) return null;

  const { data, error } = await supabase.from(table).select('*').eq('user_id', user.id);
  
  if (error) {
    console.error(`Fetch error ${table}:`, error);
    return null;
  }
  
  return data;
};
