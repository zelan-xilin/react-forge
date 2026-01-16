import type { STATUS } from '@/assets/enum';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

type Dict = {
  label: string;
  value: string;
  status: STATUS;
}[];
interface DictState {
  data: Record<string, Dict>;
}

const DICT_KEY = `${import.meta.env.VITE_STORE_PREFIX}_dict`;
const initialState: DictState = {
  data: {},
};

const dictSlice = createSlice({
  name: DICT_KEY,
  initialState,
  reducers: {
    setDict: (state, action: PayloadAction<Record<string, Dict>>) => {
      Object.assign(state.data, action.payload);
    },
    clearDict: state => {
      state.data = {};
    },
  },
});

export const { setDict, clearDict } = dictSlice.actions;
export default dictSlice.reducer;
