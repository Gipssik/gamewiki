import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TablePaginationConfig } from "antd";
import { Platform } from "../client";
import { fetchLimit } from "../utils";

const initialState = {
  platforms: null as Platform[] | null,
  pagination: {
    current: 1,
    pageSize: fetchLimit,
    position: ["bottomCenter"],
  } as TablePaginationConfig,
};

type State = typeof initialState;

const platformsSlice = createSlice({
  name: "platforms",
  initialState,
  reducers: {
    setAll: (state: State, action: PayloadAction<{ platforms: Platform[] }>) => {
      state.platforms = [...action.payload.platforms];
    },
    setPagination: (state: State, action: PayloadAction<{ pagination: TablePaginationConfig }>) => {
      state.pagination = { ...state.pagination, ...action.payload.pagination };
    },
  },
});

export const platformsActions = platformsSlice.actions;
export const platformsReducer = platformsSlice.reducer;
