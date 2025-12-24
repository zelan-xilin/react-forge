import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

import { loadLocalState, saveLocalState } from '@/lib/storage';

interface AuthState {
  menus: string[];
  buttons: string[];
  hasUnrestrictedPermissions: boolean;
}

const AUTH_KEY = 'auth';
const initialState: AuthState = loadLocalState<AuthState>(AUTH_KEY) || {
  menus: [],
  buttons: [],
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
      state.menus = [];
      state.buttons = [];
      state.hasUnrestrictedPermissions = false;
      saveLocalState(AUTH_KEY, state);
    },
  },
});

export const { setAuth, clearAuth } = authSlice.actions;
export default authSlice.reducer;
