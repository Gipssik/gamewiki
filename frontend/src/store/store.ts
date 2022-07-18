import { configureStore } from "@reduxjs/toolkit";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { authReducer } from "./auth.slice";
import { backupsReducer } from "./backups.slice";
import { companiesReducer } from "./companies.slice";
import { gamesReducer } from "./games.slice";
import { genresReducer } from "./genres.slice";
import { platformsReducer } from "./platforms.slice";
import { salesReducer } from "./sales.slice";
import { usersReducer } from "./users.slice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    backups: backupsReducer,
    companies: companiesReducer,
    platforms: platformsReducer,
    genres: genresReducer,
    games: gamesReducer,
    sales: salesReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
