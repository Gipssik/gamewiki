import {
  DeleteOutlined,
  EditOutlined,
  OneToOneOutlined,
  PlusOutlined,
  SearchOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Button, Input, message, Modal, Space, Table, TablePaginationConfig } from "antd";
import { FilterValue, SorterResult } from "antd/lib/table/interface";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Platform, PlatformsService } from "../../client";
import { PlatformsColumns } from "../../columns";
import { platformsActions, useAppDispatch, useAppSelector } from "../../store";
import { fetchLimit, getSkip, getSorts } from "../../utils";
import styles from "../../columns/columns.module.css";
import { Container, Panel, Title } from "../../components";
import modal from "antd/lib/modal";
import { BidirectionalBar, BidirectionalBarConfig } from "@ant-design/charts";

let columns = [...PlatformsColumns];

export const PlatformsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { platforms, pagination } = useAppSelector((s) => s.platforms);
  const me = useAppSelector((s) => s.auth.me);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const hasSelected = selectedRowKeys.length > 0;
  const isPairSelected = selectedRowKeys.length === 2;
  const [isCompareModalVisible, setIsCompareModalVisible] = useState<boolean>(false);
  const [isPlatformsLoading, setIsPlatformsLoading] = useState<boolean>(true);
  const [sortParameters, setSortParameters] = useState<string | undefined>(undefined);
  const [searchTitle, setSearchTitle] = useState<string | undefined>(undefined);
  const [searchCreatedBy, setSearchCreatedBy] = useState<string | undefined>(undefined);
  const [comparables, setComparables] = useState<string[]>([]);
  const [compareData, setCompareData] = useState<any[]>([]);
  const compareConfig: BidirectionalBarConfig = {
    data: compareData,
    xField: "property",
    xAxis: {
      position: "bottom",
    },
    interactions: [
      {
        type: "active-region",
      },
    ],
    yField: [comparables[0], comparables[1]],
    tooltip: {
      shared: true,
      showMarkers: false,
    },
  };

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
    let sorts = getSorts<Platform>(sorter);

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

  const compare = () => {
    let selected1 = platforms?.find((p) => p.id === selectedRowKeys[0]);
    let selected2 = platforms?.find((p) => p.id === selectedRowKeys[1]);
    if (!selected1 || !selected2) return;

    setComparables([selected1.title, selected2.title]);

    let data: any[] = [
      { property: "Amount of games" },
      { property: "Amount of sale pairs" },
      { property: "Hundred thousands of sales" },
    ];

    data[0][selected1.title] = selected1.games?.length;
    data[0][selected2.title] = selected2.games?.length;
    data[1][selected1.title] = selected1.sales?.length;
    data[1][selected2.title] = selected2.sales?.length;
    data[2][selected1.title] = selected1.sales
      ?.map((s) => s.amount)
      .reduce((accumulator, current) => {
        return accumulator + current;
      }, 0);
    data[2][selected2.title] = selected2.sales
      ?.map((s) => s.amount)
      .reduce((accumulator, current) => {
        return accumulator + current;
      }, 0);

    if (data[2][selected1.title]) data[2][selected1.title] /= 100000;
    if (data[2][selected2.title]) data[2][selected2.title] /= 100000;

    setCompareData(data);
    setIsCompareModalVisible(true);
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
    fetchPlatforms(0, fetchLimit);
  }, []);

  return (
    <>
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
          <Space>
            {me && me.is_superuser ? (
              <>
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
              </>
            ) : null}
            <Button disabled={!isPairSelected} icon={<OneToOneOutlined />} onClick={() => compare()} type="dashed">
              Compare
            </Button>
          </Space>
        </Panel>
        <Table
          dataSource={platforms || undefined}
          rowKey={(record) => record.id}
          columns={columns}
          bordered
          size="small"
          loading={isPlatformsLoading}
          pagination={pagination}
          rowSelection={{ type: "checkbox", onChange: setSelectedRowKeys, selectedRowKeys }}
          onChange={handleTableChange}
        />
      </Container>
      <Modal
        title="Compare"
        centered
        closable
        visible={isCompareModalVisible}
        onCancel={() => setIsCompareModalVisible(false)}
        footer={[
          <Button key={new Date().getTime()} type="primary" onClick={() => setIsCompareModalVisible(false)}>
            OK
          </Button>,
        ]}
      >
        <BidirectionalBar style={{ height: 250 }} {...compareConfig} />
      </Modal>
    </>
  );
};
