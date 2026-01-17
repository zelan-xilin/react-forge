import type { RootState } from '@/store';
import { useSelector } from 'react-redux';

export const useDict = () => {
  const dict = useSelector((state: RootState) => state.dict);

  return { dict: dict.data };
};
