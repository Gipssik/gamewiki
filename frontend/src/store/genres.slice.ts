import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TablePaginationConfig } from "antd";
import { Genre } from "../client";
import { fetchLimit } from "../utils";

const initialState = {
  genres: null as Genre[] | null,
  pagination: {
    current: 1,
    pageSize: fetchLimit,
    position: ["bottomCenter"],
  } as TablePaginationConfig,
};

type State = typeof initialState;

const genresSlice = createSlice({
  name: "genres",
  initialState,
  reducers: {
    setAll: (state: State, action: PayloadAction<{ genres: Genre[] }>) => {
      state.genres = [...action.payload.genres];
    },
    setPagination: (state: State, action: PayloadAction<{ pagination: TablePaginationConfig }>) => {
      state.pagination = { ...state.pagination, ...action.payload.pagination };
    },
  },
});

export const genresActions = genresSlice.actions;
export const genresReducer = genresSlice.reducer;
