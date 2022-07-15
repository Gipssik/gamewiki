import { ColumnsType } from "antd/lib/table";
import { Backup, User } from "../client";

export const columns: ColumnsType<Backup> = [
  {
    title: "Title",
    dataIndex: "title",
    key: "title",
    align: "center",
    sorter: {
      multiple: 1,
    },
  },
  {
    title: "Url",
    dataIndex: "url",
    key: "url",
    align: "center",
    sorter: {
      multiple: 1,
    },
  },
  {
    title: "Created At",
    dataIndex: "created_at",
    key: "created_at",
    render: (value: Date) => new Date(value).toUTCString(),
    align: "center",
    sorter: {
      multiple: 1,
    },
  },
  {
    title: "Created By",
    dataIndex: "created_by_user",
    key: "created_by_user",
    render: (value: User | null) => (value ? value.username : "-"),
    align: "center",
    sorter: {
      multiple: 1,
    },
  },
];
