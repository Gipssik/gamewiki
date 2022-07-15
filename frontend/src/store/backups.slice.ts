import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TablePaginationConfig } from "antd";
import { Backup } from "../client";
import { fetchLimit } from "../utils";

const initialState = {
  backups: null as Backup[] | null,
  pagination: {
    current: 1,
    pageSize: fetchLimit,
    position: ["bottomCenter"],
  } as TablePaginationConfig,
};

type State = typeof initialState;

const backupsSlice = createSlice({
  name: "backups",
  initialState,
  reducers: {
    setAll: (state: State, action: PayloadAction<{ backups: Backup[] }>) => {
      state.backups = [...action.payload.backups];
    },
    setPagination: (state: State, action: PayloadAction<{ pagination: TablePaginationConfig }>) => {
      state.pagination = { ...state.pagination, ...action.payload.pagination };
    },
  },
});

export const backupsActions = backupsSlice.actions;
export const backupsReducer = backupsSlice.reducer;
