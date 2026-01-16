import { configureStore } from '@reduxjs/toolkit';

import authReducer from './modules/authSlice';
import dictReducer from './modules/dictSlice';
import userReducer from './modules/userSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    auth: authReducer,
    dict: dictReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
