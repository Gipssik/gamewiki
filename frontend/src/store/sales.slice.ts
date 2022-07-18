import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TablePaginationConfig } from "antd";
import { Sale } from "../client";
import { fetchLimit } from "../utils";

const initialState = {
  sales: null as Sale[] | null,
  pagination: {
    current: 1,
    pageSize: fetchLimit,
    position: ["bottomCenter"],
  } as TablePaginationConfig,
};

type State = typeof initialState;

const salesSlice = createSlice({
  name: "sales",
  initialState,
  reducers: {
    setAll: (state: State, action: PayloadAction<{ sales: Sale[] }>) => {
      state.sales = [...action.payload.sales];
    },
    setPagination: (state: State, action: PayloadAction<{ pagination: TablePaginationConfig }>) => {
      state.pagination = { ...state.pagination, ...action.payload.pagination };
    },
  },
});

export const salesActions = salesSlice.actions;
export const salesReducer = salesSlice.reducer;
