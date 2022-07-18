import { ColumnsType } from "antd/lib/table";
import { Game, Platform, Sale, User } from "../client";

export const columns: ColumnsType<Sale> = [
  {
    title: "Game",
    dataIndex: "game",
    key: "game",
    render: (value: Game) => value.title,
    align: "center",
    sorter: {
      multiple: 1,
    },
  },
  {
    title: "Platform",
    dataIndex: "platform",
    key: "platform",
    render: (value: Platform) => value.title,
    align: "center",
    sorter: {
      multiple: 1,
    },
  },
  {
    title: "Amount",
    dataIndex: "amount",
    key: "amount",
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
