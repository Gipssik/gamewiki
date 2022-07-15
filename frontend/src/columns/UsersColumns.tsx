import { CheckOutlined, CloseOutlined, EditOutlined } from "@ant-design/icons";
import { ColumnsType } from "antd/lib/table";
import { Link } from "react-router-dom";
import { User } from "../client";
import styles from "./columns.module.css";

export const columns: ColumnsType<User> = [
  {
    title: "Edit",
    align: "center",
    render: (value: any, record: User) =>
      record.is_primary ? null : (
        <Link className={styles.icon} to={`/users/${record.id}/edit`}>
          <EditOutlined />
        </Link>
      ),
  },
  {
    title: "Username",
    dataIndex: "username",
    key: "username",
    align: "center",
    sorter: {
      multiple: 1,
    },
  },
  {
    title: "Email",
    dataIndex: "email",
    key: "email",
    align: "center",
    sorter: {
      multiple: 1,
    },
  },
  {
    title: "Is Superuser",
    dataIndex: "is_superuser",
    key: "is_superuser",
    render: (value: boolean) => (value ? <CheckOutlined /> : <CloseOutlined />),
    align: "center",
    sorter: {
      multiple: 1,
    },
  },
  {
    title: "Is Primary",
    dataIndex: "is_primary",
    key: "is_primary",
    render: (value: boolean) => (value ? <CheckOutlined /> : <CloseOutlined />),
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
    title: "Created Companies",
    dataIndex: "created_companies",
    key: "created_companies",
    render: (value: Array<Object>) => value.length,
    align: "center",
    sorter: {
      multiple: 1,
    },
  },
  {
    title: "Created Platforms",
    dataIndex: "created_platforms",
    key: "created_platforms",
    render: (value: Array<Object>) => value.length,
    align: "center",
    sorter: {
      multiple: 1,
    },
  },
  {
    title: "Created Games",
    dataIndex: "created_games",
    key: "created_games",
    render: (value: Array<Object>) => value.length,
    align: "center",
    sorter: {
      multiple: 1,
    },
  },
  {
    title: "Created Genres",
    dataIndex: "created_genres",
    key: "created_genres",
    render: (value: Array<Object>) => value.length,
    align: "center",
    sorter: {
      multiple: 1,
    },
  },
  {
    title: "Created Sales",
    dataIndex: "created_sales",
    key: "created_sales",
    render: (value: Array<Object>) => value.length,
    align: "center",
    sorter: {
      multiple: 1,
    },
  },
  {
    title: "Created Backups",
    dataIndex: "created_backups",
    key: "created_backups",
    render: (value: Array<Object>) => value.length,
    align: "center",
    sorter: {
      multiple: 1,
    },
  },
];
