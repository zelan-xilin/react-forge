import type { MUST_HAVE_DICT, STATUS } from '@/assets/enum';
import { createSlice } from '@reduxjs/toolkit';

type Dict = {
  label: string;
  value: string;
  status: STATUS;
}[];
interface DictState {
  data: Record<MUST_HAVE_DICT, Dict | undefined>;
}

const DICT_KEY = `${import.meta.env.VITE_STORE_PREFIX}_dict`;
const initialState: DictState = {
  data: {} as DictState['data'],
};

const dictSlice = createSlice({
  name: DICT_KEY,
  initialState,
  reducers: {
    setDict: (state, action) => {
      Object.assign(state.data, action.payload);
    },
    clearDict: state => {
      state.data = {} as DictState['data'];
    },
  },
});

export const { setDict, clearDict } = dictSlice.actions;
export default dictSlice.reducer;
