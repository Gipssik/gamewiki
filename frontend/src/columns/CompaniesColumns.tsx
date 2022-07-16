import { SelectOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/lib/table";
import { Link } from "react-router-dom";
import { Company, User } from "../client";
import styles from "./columns.module.css";

export const columns: ColumnsType<Company> = [
  {
    title: "Open",
    align: "center",
    render: (value: any, record: Company) => (
      <Link className={styles.icon} to={`/companies/${record.id}`}>
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
    title: "Founded At",
    dataIndex: "founded_at",
    key: "founded_at",
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
];
