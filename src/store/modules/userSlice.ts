import { loadLocalState, saveLocalState } from '@/utils/storage';
import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  id: string | null;
  username: string | null;
  token: string | null;
  account: string | null;
  password: string | null;
  rememberPassword: boolean;
}

const USER_KEY = 'user';
const initialState: UserState = loadLocalState<UserState>(USER_KEY) || {
  id: null,
  username: null,
  token: null,
  account: null,
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
      state.id = null;
      state.username = null;
      state.token = null;
      saveLocalState(USER_KEY, state);
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
