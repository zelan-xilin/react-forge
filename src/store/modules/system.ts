import { loadLocalState, saveLocalState } from '@/lib/storage';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface SystemState {
  theme: 'light' | 'dark';
}

const SYSTEM_KEY = `${import.meta.env.VITE_STORE_PREFIX}_system`;
const initialState: SystemState = loadLocalState<SystemState>(SYSTEM_KEY) || {
  theme: 'light',
};

if (initialState.theme === 'dark') {
  document?.documentElement?.classList.add('dark');
} else {
  document?.documentElement?.classList.remove('dark');
}

const systemSlice = createSlice({
  name: SYSTEM_KEY,
  initialState,
  reducers: {
    setSystem: (state, action: PayloadAction<SystemState>) => {
      Object.assign(state, action.payload);
      if (action.payload.theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }

      saveLocalState(SYSTEM_KEY, state);
    },
    clearSystem: state => {
      state.theme = 'light';
      document.documentElement.classList.remove('dark');
      saveLocalState(SYSTEM_KEY, state);
    },
  },
});

export const { setSystem, clearSystem } = systemSlice.actions;
export default systemSlice.reducer;
