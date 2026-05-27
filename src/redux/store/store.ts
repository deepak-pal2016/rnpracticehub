/* eslint-disable @typescript-eslint/no-unused-vars */

import { configureStore } from '@reduxjs/toolkit';
import { AuthReducers, RegisterReducers } from '@redux/slices/authSlice';
import { UserlistReducers, onlineUserReducer } from '@redux/slices/userSlice';
import { StaticDataReducers } from '@redux/slices/staticdataSlice';
import {
  AddtaskReducers,
  GetalltaskReducers,
  MarkedcompletedtaskReducers,
  DeletetaskReducers,
} from '@redux/slices/taskSlice';
import { LogoutReucers } from '@redux/slices/authSlice';
import { FetchchatReducer } from '@redux/slices/chatSlice';
import { errorMiddleware } from '@redux/middleware/errormiddleware';

export const store = configureStore({
  reducer: {
    auth: AuthReducers,
    register: RegisterReducers,
    userlist: UserlistReducers,
    staticdata: StaticDataReducers,
    addtask: AddtaskReducers,
    logout: LogoutReucers,
    getalltask: GetalltaskReducers,
    markedtask: MarkedcompletedtaskReducers,
    fetchchat: FetchchatReducer,
    onlineuser: onlineUserReducer,
    deletetask: DeletetaskReducers,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: false,
      immutableCheck: false,
    }).concat(errorMiddleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
