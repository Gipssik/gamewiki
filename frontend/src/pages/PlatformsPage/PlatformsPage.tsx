import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Input, message, Space, Table, TablePaginationConfig } from "antd";
import { FilterValue, SorterResult } from "antd/lib/table/interface";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Platform, PlatformsService } from "../../client";
import { PlatformsColumns } from "../../columns";
import { platformsActions, useAppDispatch, useAppSelector } from "../../store";
import { fetchLimit, getSign, getSkip } from "../../utils";
import styles from "../../columns/columns.module.css";
import { Container, Panel, Title } from "../../components";
import modal from "antd/lib/modal";

let columns = [...PlatformsColumns];

export const PlatformsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { platforms, pagination } = useAppSelector((s) => s.platforms);
  const me = useAppSelector((s) => s.auth.me);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const hasSelected = selectedRowKeys.length > 0;
  const [isPlatformsLoading, setIsPlatformsLoading] = useState<boolean>(true);
  const [sortParameters, setSortParameters] = useState<string | undefined>(undefined);
  const [searchTitle, setSearchTitle] = useState<string | undefined>(undefined);
  const [searchCreatedBy, setSearchCreatedBy] = useState<string | undefined>(undefined);

  const setPagination = (newPagination: TablePaginationConfig) => {
    dispatch(platformsActions.setPagination({ pagination: newPagination }));
  };

  const fetchPlatforms = (
    skip?: number,
    limit?: number,
    title?: string,
    createdByUser?: string,
    sort?: string,
    newPagination?: TablePaginationConfig
  ) => {
    setIsPlatformsLoading(true);
    PlatformsService.getMultiWithHeaders(skip, limit, title, createdByUser, sort)
      .then((data) => {
        dispatch(platformsActions.setAll({ platforms: data.body || [] }));

        if (newPagination) setPagination({ ...newPagination, total: Number(data.count) });
        else setPagination({ ...pagination, total: Number(data.count) });

        setIsPlatformsLoading(false);
      })
      .catch((error) => {
        setIsPlatformsLoading(false);
      });
  };

  const handleTableChange = (
    newPagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<Platform> | SorterResult<Platform>[]
  ) => {
    let skip = getSkip(newPagination);
    let sorts: string | undefined;
    if (sorter && sorter instanceof Array) {
      sorts = sorter.map((sort) => getSign(sort.order || null) + sort.field).join(",");
    } else if (sorter && sorter instanceof Object && sorter.column !== undefined) {
      sorts = getSign(sorter.order || null) + sorter.field;
    }

    setSortParameters(sorts);

    fetchPlatforms(skip, fetchLimit, searchTitle, searchCreatedBy, sorts, newPagination);
  };

  const refresh = () => {
    let skip = getSkip(pagination);
    setSelectedRowKeys([]);
    fetchPlatforms(skip, fetchLimit, searchTitle, searchCreatedBy, sortParameters);
  };

  const search = () => {
    let skip = 0;
    let newPagination = {
      current: 1,
      pageSize: fetchLimit,
      position: ["bottomCenter"],
    } as TablePaginationConfig;
    fetchPlatforms(skip, fetchLimit, searchTitle, searchCreatedBy, sortParameters, newPagination);
  };

  const deleteOnButtonClick = () => {
    let skip = getSkip(pagination);
    PlatformsService.deleteMulti(selectedRowKeys as string[])
      .then((data) => {
        message.success("Platforms were successfully deleted!", 5);
        setSelectedRowKeys([]);
        fetchPlatforms(skip, fetchLimit, searchTitle, searchCreatedBy, sortParameters);
      })
      .catch((error) => {
        message.error(error, 5);
      });
  };

  useEffect(() => {
    if (me && me.is_superuser) {
      columns = columns.filter((col) => col.title !== "Edit");
      columns = [
        {
          title: "Edit",
          align: "center",
          render: (value: any, record: Platform) => (
            <Link className={styles.icon} to={`/platforms/${record.id}/edit`}>
              <EditOutlined />
            </Link>
          ),
        },
        ...columns,
      ];
    } else columns = [...PlatformsColumns];
  }, [me]);

  useEffect(() => {
    if (!platforms) fetchPlatforms(0, fetchLimit);
    else setIsPlatformsLoading(false);
  }, []);

  return (
    <Container>
      <Title>Platforms</Title>
      <Panel>
        <Space>
          <Button icon={<SyncOutlined />} loading={isPlatformsLoading} onClick={refresh}>
            Refresh
          </Button>
          <Input
            placeholder="Title"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value === "" ? undefined : e.target.value)}
          />
          <Input
            placeholder="Created By"
            value={searchCreatedBy}
            onChange={(e) => setSearchCreatedBy(e.target.value === "" ? undefined : e.target.value)}
          />
          <Button icon={<SearchOutlined />} type="primary" loading={isPlatformsLoading} onClick={search}>
            Search
          </Button>
        </Space>
        {me && me.is_superuser ? (
          <Space>
            <span>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}</span>
            <Button
              icon={<DeleteOutlined />}
              danger
              onClick={() => {
                modal.confirm({
                  title: "Are you sure you want to delete these platforms?",
                  onOk: deleteOnButtonClick,
                });
              }}
              disabled={!hasSelected}
              loading={isPlatformsLoading}
            >
              Delete
            </Button>
            <Link to={"/platforms/create"}>
              <Button icon={<PlusOutlined />} type="primary">
                Create
              </Button>
            </Link>
          </Space>
        ) : null}
      </Panel>
      <Table
        dataSource={platforms || undefined}
        rowKey={(record) => record.id}
        columns={columns}
        bordered
        size="small"
        loading={isPlatformsLoading}
        pagination={pagination}
        rowSelection={
          me && me.is_superuser ? { type: "checkbox", onChange: setSelectedRowKeys, selectedRowKeys } : undefined
        }
        onChange={handleTableChange}
      />
    </Container>
  );
};
