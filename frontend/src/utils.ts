import { SortOrder } from "antd/lib/table/interface";

export const getPrettifiedErrorString = (s: string): string => {
  return s.replaceAll("(", "").replaceAll(")", "").replaceAll("=", " ");
};

export const getSign = (t: SortOrder) => (t === "ascend" ? "+" : "-");

export const fetchLimit = 10;
