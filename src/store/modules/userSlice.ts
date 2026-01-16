import { loadLocalState, saveLocalState } from '@/lib/storage';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  token: string | null;
  id: number | null;
  username: string | null;
  password: string | null;
  rememberPassword: boolean;
}

const USER_KEY = `${import.meta.env.VITE_STORE_PREFIX}_user`;
const initialState: UserState = loadLocalState<UserState>(USER_KEY) || {
  token: null,
  id: null,
  username: null,
  password: null,
  rememberPassword: false,
};

const userSlice = createSlice({
  name: USER_KEY,
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<UserState>) => {
      Object.assign(state, action.payload);
      saveLocalState(USER_KEY, state);
    },
    clearUser: state => {
      state.token = null;
      state.id = null;
      saveLocalState(USER_KEY, state);
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
