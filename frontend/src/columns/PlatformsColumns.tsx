import { SelectOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/lib/table";
import { Link } from "react-router-dom";
import { Platform, User } from "../client";
import styles from "./columns.module.css";

export const columns: ColumnsType<Platform> = [
  {
    title: "Open",
    align: "center",
    render: (value: any, record: Platform) => (
      <Link className={styles.icon} to={`/platforms/${record.id}`}>
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
    title: "Created By",
    dataIndex: "created_by_user",
    key: "created_by_user",
    render: (value: User | null) => (value ? value.username : "-"),
    align: "center",
    sorter: {
      multiple: 1,
    },
  },
  {
    title: "Games",
    dataIndex: "games",
    key: "games",
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
