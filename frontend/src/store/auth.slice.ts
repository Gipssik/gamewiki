import { User } from "../client";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  isAuth: false,
  me: null as User | null,
};

type State = typeof initialState;

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state: State, action: PayloadAction<{ user: User }>) => {
      state.isAuth = true;
      state.me = action.payload.user;
    },
    logout: (state: State, action: PayloadAction) => {
      localStorage.removeItem("accessToken");
      state.me = null;
      state.isAuth = false;
    },
  },
});

export const authActions = authSlice.actions;
export const authReducer = authSlice.reducer;
