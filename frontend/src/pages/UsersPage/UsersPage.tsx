import { DeleteOutlined, SearchOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Input, message, Select, Space, Table } from "antd";
import modal from "antd/lib/modal";
import type { TablePaginationConfig } from "antd/lib/table";
import type { FilterValue, SorterResult } from "antd/lib/table/interface";
import React, { useEffect, useState } from "react";
import { User, UsersService } from "../../client";
import { UsersColumns } from "../../columns";
import { Container, Panel, Title } from "../../components";
import { useAppDispatch, useAppSelector, usersActions } from "../../store";
import { fetchLimit, getSign, getSkip } from "../../utils";

const UsersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { users, pagination } = useAppSelector((s) => s.users);
  const me = useAppSelector((s) => s.auth.me);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const hasSelected = selectedRowKeys.length > 0;
  const [isUsersLoading, setIsUsersLoading] = useState(true);
  const [searchUsername, setSearchUsername] = useState<string>();
  const [searchEmail, setSearchEmail] = useState<string>();
  const [searchIsSuperuser, setSearchIsSuperuser] = useState<boolean>();
  const [searchIsPrimary, setSearchIsPrimary] = useState<boolean>();
  const [sortParameters, setSortParameters] = useState<string | undefined>(undefined);

  const setPagination = (newPagination: TablePaginationConfig) => {
    dispatch(usersActions.setPagination({ pagination: newPagination }));
  };

  const fetchUsers = (
    skip?: number,
    limit?: number,
    username?: string,
    email?: string,
    isSuperuser?: boolean,
    isPrimary?: boolean,
    sort?: string,
    newPagination?: TablePaginationConfig
  ) => {
    setIsUsersLoading(true);
    UsersService.getMultiWithHeaders(skip, limit, username, email, isSuperuser, isPrimary, sort)
      .then((data) => {
        dispatch(usersActions.setAll({ users: data.body || [] }));

        if (newPagination) setPagination({ ...newPagination, total: Number(data.count) });
        else setPagination({ ...pagination, total: Number(data.count) });

        setIsUsersLoading(false);
      })
      .catch((error) => {
        setIsUsersLoading(false);
      });
  };

  const handleTableChange = (
    newPagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<User> | SorterResult<User>[]
  ) => {
    let skip = getSkip(newPagination);
    let sorts: string | undefined;
    if (sorter && sorter instanceof Array) {
      sorts = sorter.map((sort) => getSign(sort.order || null) + sort.field).join(",");
    } else if (sorter && sorter instanceof Object && sorter.column !== undefined) {
      sorts = getSign(sorter.order || null) + sorter.field;
    }

    setSortParameters(sorts);

    fetchUsers(skip, fetchLimit, searchUsername, searchEmail, searchIsSuperuser, searchIsPrimary, sorts, newPagination);
  };

  const deleteOnButtonClick = () => {
    if (selectedRowKeys.includes(me?.id as string)) {
      message.error("You can't delete yourself!", 5);
      return;
    }
    let skip = getSkip(pagination);
    UsersService.deleteMulti(selectedRowKeys as string[])
      .then((data) => {
        message.success("Users were successfully deleted!", 5);
        setSelectedRowKeys([]);
        fetchUsers(skip, fetchLimit, searchUsername, searchEmail, searchIsSuperuser, searchIsPrimary, sortParameters);
      })
      .catch((error) => {
        message.error(error, 5);
      });
  };

  const refresh = () => {
    let skip = getSkip(pagination);
    setSelectedRowKeys([]);
    fetchUsers(skip, fetchLimit, searchUsername, searchEmail, searchIsSuperuser, searchIsPrimary, sortParameters);
  };

  const search = () => {
    let skip = 0;
    let newPagination = {
      current: 1,
      pageSize: fetchLimit,
      position: ["bottomCenter"],
    } as TablePaginationConfig;
    fetchUsers(
      skip,
      fetchLimit,
      searchUsername,
      searchEmail,
      searchIsSuperuser,
      searchIsPrimary,
      sortParameters,
      newPagination
    );
  };

  useEffect(() => {
    if (!users) fetchUsers(0, fetchLimit);
    else setIsUsersLoading(false);
  }, [users]);

  return (
    <Container>
      <Title>Users</Title>
      <Panel>
        <Space>
          <Button icon={<SyncOutlined />} loading={isUsersLoading} onClick={refresh}>
            Refresh
          </Button>
          <Input
            placeholder="Username"
            value={searchUsername}
            onChange={(e) => setSearchUsername(e.target.value === "" ? undefined : e.target.value)}
          />
          <Input
            placeholder="Email"
            value={searchEmail}
            onChange={(e) => setSearchEmail(e.target.value === "" ? undefined : e.target.value)}
          />
          <Select
            defaultValue={undefined}
            loading={isUsersLoading}
            style={{ width: 120 }}
            onChange={setSearchIsSuperuser}
            placeholder="Is Superuser"
            allowClear
          >
            <Select.Option value={true}>Superuser</Select.Option>
            <Select.Option value={false}>Not Superuser</Select.Option>
          </Select>
          <Select
            defaultValue={undefined}
            style={{ width: 120 }}
            onChange={setSearchIsPrimary}
            placeholder="Is Primary"
            allowClear
          >
            <Select.Option value={true}>Primary</Select.Option>
            <Select.Option value={false}>Not Primary</Select.Option>
          </Select>
          <Button icon={<SearchOutlined />} type="primary" loading={isUsersLoading} onClick={search}>
            Search
          </Button>
        </Space>
        <Space>
          <span>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}</span>
          <Button
            icon={<DeleteOutlined />}
            type="primary"
            danger
            onClick={() => {
              modal.confirm({
                title: "Are you sure you want to delete these users?",
                onOk: deleteOnButtonClick,
              });
            }}
            disabled={!hasSelected}
            loading={isUsersLoading}
          >
            Delete
          </Button>
        </Space>
      </Panel>

      <Table
        dataSource={users || undefined}
        rowKey={(record) => record.id}
        columns={UsersColumns}
        bordered
        size="small"
        loading={isUsersLoading}
        pagination={pagination}
        rowSelection={{ type: "checkbox", onChange: setSelectedRowKeys, selectedRowKeys }}
        onChange={handleTableChange}
      />
    </Container>
  );
};

export default UsersPage;
