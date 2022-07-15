import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { authReducer } from "./auth.slice";
import { backupsReducer } from "./backups.slice";
import { usersReducer } from "./users.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    backups: backupsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
