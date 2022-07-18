import { SorterResult, SortOrder, TablePaginationConfig } from "antd/lib/table/interface";

export const getPrettifiedErrorString = (s: string): string => {
  return s.replaceAll("(", "").replaceAll(")", "").replaceAll("=", " ");
};

export const getSign = (t: SortOrder) => (t === "ascend" ? "+" : "-");

export const fetchLimit = 10;

export const getSkip = (pag: TablePaginationConfig) => pag.current && (pag.current - 1) * fetchLimit;

export const getSorts = <T extends Object>(sorter: SorterResult<T> | SorterResult<T>[]): string | undefined => {
  let sorts: string | undefined;
  if (sorter && sorter instanceof Array) {
    sorts = sorter.map((sort) => getSign(sort.order || null) + sort.field).join(",");
  } else if (sorter && sorter instanceof Object && sorter.column !== undefined) {
    sorts = getSign(sorter.order || null) + sorter.field;
  }
  return sorts;
};
