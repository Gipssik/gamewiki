import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Input, message, Space, Table, TablePaginationConfig } from "antd";
import { FilterValue, SorterResult } from "antd/lib/table/interface";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Sale, SalesService } from "../../client";
import { SalesColumns } from "../../columns";
import { salesActions, useAppDispatch, useAppSelector } from "../../store";
import { fetchLimit, getSign, getSkip, getSorts } from "../../utils";
import styles from "../../columns/columns.module.css";
import { Container, Panel, Title } from "../../components";
import modal from "antd/lib/modal";

let columns = [...SalesColumns];

export const SalesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { sales, pagination } = useAppSelector((s) => s.sales);
  const me = useAppSelector((s) => s.auth.me);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const hasSelected = selectedRowKeys.length > 0;
  const [isSalesLoading, setIsSalesLoading] = useState<boolean>(true);
  const [sortParameters, setSortParameters] = useState<string | undefined>(undefined);
  const [searchGame, setSearchGame] = useState<string | undefined>(undefined);
  const [searchPlatform, setSearchPlatform] = useState<string | undefined>(undefined);
  const [searchCreatedBy, setSearchCreatedBy] = useState<string | undefined>(undefined);

  const setPagination = (newPagination: TablePaginationConfig) => {
    dispatch(salesActions.setPagination({ pagination: newPagination }));
  };

  const fetchSales = (
    skip?: number,
    limit?: number,
    game?: string,
    platform?: string,
    createdByUser?: string,
    sort?: string,
    newPagination?: TablePaginationConfig
  ) => {
    setIsSalesLoading(true);
    SalesService.getMultiWithHeaders(skip, limit, game, platform, createdByUser, sort)
      .then((data) => {
        dispatch(salesActions.setAll({ sales: data.body || [] }));

        if (newPagination) setPagination({ ...newPagination, total: Number(data.count) });
        else setPagination({ ...pagination, total: Number(data.count) });

        setIsSalesLoading(false);
      })
      .catch((error) => {
        setIsSalesLoading(false);
      });
  };

  const handleTableChange = (
    newPagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<Sale> | SorterResult<Sale>[]
  ) => {
    let skip = getSkip(newPagination);
    let sorts = getSorts<Sale>(sorter);

    setSortParameters(sorts);

    fetchSales(skip, fetchLimit, searchGame, searchPlatform, searchCreatedBy, sorts, newPagination);
  };

  const refresh = () => {
    let skip = getSkip(pagination);
    setSelectedRowKeys([]);
    fetchSales(skip, fetchLimit, searchGame, searchPlatform, searchCreatedBy, sortParameters);
  };

  const search = () => {
    let skip = 0;
    let newPagination = {
      current: 1,
      pageSize: fetchLimit,
      position: ["bottomCenter"],
    } as TablePaginationConfig;
    fetchSales(skip, fetchLimit, searchGame, searchPlatform, searchCreatedBy, sortParameters, newPagination);
  };

  const deleteOnButtonClick = () => {
    let skip = getSkip(pagination);
    SalesService.deleteMulti(selectedRowKeys as string[])
      .then((data) => {
        message.success("Sales were successfully deleted!", 5);
        setSelectedRowKeys([]);
        fetchSales(skip, fetchLimit, searchGame, searchPlatform, searchCreatedBy, sortParameters);
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
          render: (value: any, record: Sale) => (
            <Link className={styles.icon} to={`/sales/${record.id}/edit`}>
              <EditOutlined />
            </Link>
          ),
        },
        ...columns,
      ];
    } else columns = [...SalesColumns];
  }, [me]);

  useEffect(() => {
    fetchSales(0, fetchLimit);
  }, []);

  return (
    <Container>
      <Title>Sales</Title>
      <Panel>
        <Space>
          <Button icon={<SyncOutlined />} loading={isSalesLoading} onClick={refresh}>
            Refresh
          </Button>
          <Input
            placeholder="Game"
            value={searchGame}
            onChange={(e) => setSearchGame(e.target.value === "" ? undefined : e.target.value)}
          />
          <Input
            placeholder="Platform"
            value={searchPlatform}
            onChange={(e) => setSearchPlatform(e.target.value === "" ? undefined : e.target.value)}
          />
          <Input
            placeholder="Created By"
            value={searchCreatedBy}
            onChange={(e) => setSearchCreatedBy(e.target.value === "" ? undefined : e.target.value)}
          />
          <Button icon={<SearchOutlined />} type="primary" loading={isSalesLoading} onClick={search}>
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
                  title: "Are you sure you want to delete these sales?",
                  onOk: deleteOnButtonClick,
                });
              }}
              disabled={!hasSelected}
              loading={isSalesLoading}
            >
              Delete
            </Button>
            <Link to={"/sales/create"}>
              <Button icon={<PlusOutlined />} type="primary">
                Create
              </Button>
            </Link>
          </Space>
        ) : null}
      </Panel>
      <Table
        dataSource={sales || undefined}
        rowKey={(record) => record.id}
        columns={columns}
        bordered
        size="small"
        loading={isSalesLoading}
        pagination={pagination}
        rowSelection={
          me && me.is_superuser ? { type: "checkbox", onChange: setSelectedRowKeys, selectedRowKeys } : undefined
        }
        onChange={handleTableChange}
      />
    </Container>
  );
};
