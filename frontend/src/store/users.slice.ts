import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { User } from "../client";

const initialState = {
  users: null as User[] | null,
};

type State = typeof initialState;

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setAll: (state: State, action: PayloadAction<{ users: User[] }>) => {
      state.users = [...action.payload.users];
    },
    addToEnd: (state: State, action: PayloadAction<{ users: User[] }>) => {
      if (state.users) state.users = [...state.users, ...action.payload.users];
      else state.users = [...action.payload.users];
    },
  },
});

export const usersActions = usersSlice.actions;
export const usersReducer = usersSlice.reducer;
