import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TablePaginationConfig } from "antd";
import { Game } from "../client";
import { fetchLimit } from "../utils";

const initialState = {
  games: null as Game[] | null,
  pagination: {
    current: 1,
    pageSize: fetchLimit,
    position: ["bottomCenter"],
  } as TablePaginationConfig,
};

type State = typeof initialState;

const gamesSlice = createSlice({
  name: "games",
  initialState,
  reducers: {
    setAll: (state: State, action: PayloadAction<{ games: Game[] }>) => {
      state.games = [...action.payload.games];
    },
    setPagination: (state: State, action: PayloadAction<{ pagination: TablePaginationConfig }>) => {
      state.pagination = { ...state.pagination, ...action.payload.pagination };
    },
  },
});

export const gamesActions = gamesSlice.actions;
export const gamesReducer = gamesSlice.reducer;
