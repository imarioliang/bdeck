import { useDashboardStore } from '@/store/useDashboardStore';

export const useSkin = () => {
  return useDashboardStore((state) => state.skin);
};
