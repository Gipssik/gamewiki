import { SortOrder, TablePaginationConfig } from "antd/lib/table/interface";

export const getPrettifiedErrorString = (s: string): string => {
  return s.replaceAll("(", "").replaceAll(")", "").replaceAll("=", " ");
};

export const getSign = (t: SortOrder) => (t === "ascend" ? "+" : "-");

export const fetchLimit = 10;

export const getSkip = (pag: TablePaginationConfig) => pag.current && (pag.current - 1) * fetchLimit;
