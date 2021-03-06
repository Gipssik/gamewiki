import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TablePaginationConfig } from "antd";
import { User } from "../client";
import { fetchLimit } from "../utils";

const initialState = {
  users: null as User[] | null,
  pagination: {
    current: 1,
    pageSize: fetchLimit,
    position: ["bottomCenter"],
  } as TablePaginationConfig,
};

type State = typeof initialState;

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setAll: (state: State, action: PayloadAction<{ users: User[] }>) => {
      state.users = [...action.payload.users];
    },
    setPagination: (state: State, action: PayloadAction<{ pagination: TablePaginationConfig }>) => {
      state.pagination = { ...state.pagination, ...action.payload.pagination };
    },
  },
});

export const usersActions = usersSlice.actions;
export const usersReducer = usersSlice.reducer;
