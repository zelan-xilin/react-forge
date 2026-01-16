import { loadLocalState, saveLocalState } from '@/lib/storage';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  paths: string[];
  actions: { module: string; action: string }[];
  hasUnrestrictedPermissions: boolean;
}

const AUTH_KEY = `${import.meta.env.VITE_STORE_PREFIX}_auth`;
const initialState: AuthState = loadLocalState<AuthState>(AUTH_KEY) || {
  paths: [],
  actions: [],
  hasUnrestrictedPermissions: false,
};

const authSlice = createSlice({
  name: AUTH_KEY,
  initialState,
  reducers: {
    setAuth: (state, action: PayloadAction<AuthState>) => {
      Object.assign(state, action.payload);
      saveLocalState(AUTH_KEY, state);
    },
    clearAuth: state => {
      state.paths = [];
      state.actions = [];
      state.hasUnrestrictedPermissions = false;
      saveLocalState(AUTH_KEY, state);
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
