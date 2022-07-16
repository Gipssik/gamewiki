import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { TablePaginationConfig } from "antd";
import { Company } from "../client";
import { fetchLimit } from "../utils";

const initialState = {
  companies: null as Company[] | null,
  pagination: {
    current: 1,
    pageSize: fetchLimit,
    position: ["bottomCenter"],
  } as TablePaginationConfig,
};

type State = typeof initialState;

const companiesSlice = createSlice({
  name: "companies",
  initialState,
  reducers: {
    setAll: (state: State, action: PayloadAction<{ companies: Company[] }>) => {
      state.companies = [...action.payload.companies];
    },
    setPagination: (state: State, action: PayloadAction<{ pagination: TablePaginationConfig }>) => {
      state.pagination = { ...state.pagination, ...action.payload.pagination };
    },
  },
});

export const companiesActions = companiesSlice.actions;
export const companiesReducer = companiesSlice.reducer;
