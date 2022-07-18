import { SelectOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/lib/table";
import { Link } from "react-router-dom";
import { Company, Game, User } from "../client";
import styles from "./columns.module.css";

export const columns: ColumnsType<Game> = [
  {
    title: "Open",
    align: "center",
    render: (value: any, record: Game) => (
      <Link className={styles.icon} to={`/games/${record.id}`}>
        <SelectOutlined />
      </Link>
    ),
  },
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
    title: "Released At",
    dataIndex: "released_at",
    key: "released_at",
    render: (value: Date) => new Date(value).toDateString(),
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
    title: "Created By Company",
    dataIndex: "created_by_company",
    key: "created_by_company",
    render: (value: Company | null) => (value ? value.title : "-"),
    align: "center",
    sorter: {
      multiple: 1,
    },
  },
  {
    title: "Created By User",
    dataIndex: "created_by_user",
    key: "created_by_user",
    render: (value: User | null) => (value ? value.username : "-"),
    align: "center",
    sorter: {
      multiple: 1,
    },
  },
  {
    title: "Genres",
    dataIndex: "genres",
    key: "genres",
    render: (value: Array<Object>) => value.length,
    align: "center",
    sorter: {
      multiple: 1,
    },
  },
  {
    title: "Platforms",
    dataIndex: "platforms",
    key: "platforms",
    render: (value: Array<Object>) => value.length,
    align: "center",
    sorter: {
      multiple: 1,
    },
  },
  {
    title: "Sales",
    dataIndex: "sales",
    key: "sales",
    render: (value: Array<Object>) => value.length,
    align: "center",
    sorter: {
      multiple: 1,
    },
  },
];
