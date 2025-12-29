import { configureStore } from '@reduxjs/toolkit';

import authReducer from './modules/authSlice';
import userReducer from './modules/userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
