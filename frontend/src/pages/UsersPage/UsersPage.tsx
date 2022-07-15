import { Button, Input, message, Select, Space, Table } from "antd";
import modal from "antd/lib/modal";
import type { TablePaginationConfig } from "antd/lib/table";
import type { FilterValue, SorterResult, SortOrder } from "antd/lib/table/interface";
import React, { useEffect, useState } from "react";
import { User, UsersService } from "../../client";
import { UsersColumns } from "../../columns";
import { Container, Panel, Title } from "../../components";
import { useAppDispatch, useAppSelector, usersActions } from "../../store";
import { fetchLimit, getSign } from "../../utils";

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
  const [skipParameter, setSkipParameter] = useState<number>(0);

  const setPagination = (newPagination: TablePaginationConfig) => {
    dispatch(usersActions.setPagination({ pagination: newPagination }));
  };

  const fetchUsers = (
    skip?: number,
    limit: number = 100,
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
    let skip = newPagination.current && (newPagination.current - 1) * fetchLimit;
    let sorts: string | undefined;
    if (sorter && sorter instanceof Array) {
      sorts = sorter.map((sort) => getSign(sort.order || null) + sort.field).join(",");
    } else if (sorter && sorter instanceof Object && sorter.column !== undefined) {
      sorts = getSign(sorter.order || null) + sorter.field;
    }

    setSortParameters(sorts);
    setSkipParameter(skip || 0);

    fetchUsers(skip, fetchLimit, searchUsername, searchEmail, searchIsSuperuser, searchIsPrimary, sorts, newPagination);
  };

  const deleteOnButtonClick = () => {
    if (selectedRowKeys.includes(me?.id as string)) {
      message.error("You can't delete yourself!", 5);
      return;
    }
    UsersService.deleteMulti(selectedRowKeys as string[])
      .then((data) => {
        message.success("Users was successfully deleted!", 5);
        setSelectedRowKeys([]);
        fetchUsers(
          skipParameter,
          fetchLimit,
          searchUsername,
          searchEmail,
          searchIsSuperuser,
          searchIsPrimary,
          sortParameters
        );
      })
      .catch((error) => {
        message.error(error, 5);
      });
  };

  const refresh = () => {
    let skip = pagination.current && (pagination.current - 1) * fetchLimit;
    setSelectedRowKeys([]);
    fetchUsers(skip, fetchLimit, searchUsername, searchEmail, searchIsSuperuser, searchIsPrimary, sortParameters);
  };

  const search = () => {
    fetchUsers(
      skipParameter,
      fetchLimit,
      searchUsername,
      searchEmail,
      searchIsSuperuser,
      searchIsPrimary,
      sortParameters
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
          <Button loading={isUsersLoading} onClick={refresh}>
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
            defaultValue="undefined"
            loading={isUsersLoading}
            style={{ width: 120 }}
            onChange={(value) =>
              typeof value === "string" ? setSearchIsSuperuser(undefined) : setSearchIsSuperuser(value)
            }
          >
            <Select.Option value="undefined">-</Select.Option>
            <Select.Option value={true}>Superuser</Select.Option>
            <Select.Option value={false}>Not Superuser</Select.Option>
          </Select>
          <Select
            defaultValue="undefined"
            style={{ width: 120 }}
            onChange={(value) =>
              typeof value === "string" ? setSearchIsPrimary(undefined) : setSearchIsPrimary(value)
            }
          >
            <Select.Option value="undefined">-</Select.Option>
            <Select.Option value={true}>Primary</Select.Option>
            <Select.Option value={false}>Not Primary</Select.Option>
          </Select>
          <Button type="primary" loading={isUsersLoading} onClick={search}>
            Search
          </Button>
        </Space>
        <Space>
          <span>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}</span>
          <Button
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
