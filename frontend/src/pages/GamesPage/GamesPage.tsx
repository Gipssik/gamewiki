import {
  BarChartOutlined,
  DeleteOutlined,
  EditOutlined,
  OneToOneOutlined,
  PlusOutlined,
  SearchOutlined,
  SyncOutlined,
} from "@ant-design/icons";
import { Button, DatePicker, Input, message, Modal, Space, Table, TablePaginationConfig } from "antd";
import modal from "antd/lib/modal";
import { FilterValue, SorterResult } from "antd/lib/table/interface";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Game, GamesService } from "../../client";
import { GamesColumns } from "../../columns";
import { Container, Panel, Title } from "../../components";
import { gamesActions, useAppDispatch, useAppSelector } from "../../store";
import { fetchLimit, getSkip, getSorts } from "../../utils";
import styles from "../../columns/columns.module.css";
import { BidirectionalBar, BidirectionalBarConfig } from "@ant-design/charts";

let columns = [...GamesColumns];

type DateRange = {
  start: string;
  end: string;
};

export const GamesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { games, pagination } = useAppSelector((s) => s.games);
  const me = useAppSelector((s) => s.auth.me);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const hasSelected = selectedRowKeys.length > 0;
  const isPairSelected = selectedRowKeys.length === 2;
  const [isCompareModalVisible, setIsCompareModalVisible] = useState<boolean>(false);
  const [isGamesLoading, setIsGamesLoading] = useState(true);
  const [searchTitle, setSearchTitle] = useState<string>();
  const [searchCreatedByUser, setSearchCreatedByUser] = useState<string>();
  const [searchCreatedByCompany, setSearchCreatedByCompany] = useState<string>();
  const [searchDateRange, setSearchDateRange] = useState<DateRange>();
  const [sortParameters, setSortParameters] = useState<string | undefined>(undefined);
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
    dispatch(gamesActions.setPagination({ pagination: newPagination }));
  };

  const setDateRange = (range: moment.Moment[]) => {
    if (!range) {
      setSearchDateRange(undefined);
      return;
    }
    const dateRange: DateRange = {
      start: range[0].format("YYYY-MM-DD"),
      end: range[1].format("YYYY-MM-DD"),
    };
    setSearchDateRange(dateRange);
  };

  const fetchGames = (
    skip?: number,
    limit?: number,
    title?: string,
    dateRange?: DateRange,
    createdByUser?: string,
    createdByCompany?: string,
    sort?: string,
    newPagination?: TablePaginationConfig
  ) => {
    setIsGamesLoading(true);
    GamesService.getMultiWithHeaders(
      skip,
      limit,
      title,
      dateRange?.start,
      dateRange?.end,
      createdByUser,
      createdByCompany,
      sort
    )
      .then((data) => {
        dispatch(gamesActions.setAll({ games: data.body || [] }));

        if (newPagination) setPagination({ ...newPagination, total: Number(data.count) });
        else setPagination({ ...pagination, total: Number(data.count) });

        setIsGamesLoading(false);
      })
      .catch((error) => {
        setIsGamesLoading(false);
      });
  };

  const handleTableChange = (
    newPagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<Game> | SorterResult<Game>[]
  ) => {
    let skip = getSkip(newPagination);
    let sorts = getSorts<Game>(sorter);

    setSortParameters(sorts);

    fetchGames(
      skip,
      fetchLimit,
      searchTitle,
      searchDateRange,
      searchCreatedByUser,
      searchCreatedByCompany,
      sorts,
      newPagination
    );
  };

  const deleteOnButtonClick = () => {
    let skip = getSkip(pagination);
    GamesService.deleteMulti(selectedRowKeys as string[])
      .then((data) => {
        message.success("Games were successfully deleted!", 5);
        setSelectedRowKeys([]);
        fetchGames(
          skip,
          fetchLimit,
          searchTitle,
          searchDateRange,
          searchCreatedByUser,
          searchCreatedByCompany,
          sortParameters
        );
      })
      .catch((error) => {
        message.error(error, 5);
      });
  };

  const refresh = () => {
    let skip = getSkip(pagination);
    setSelectedRowKeys([]);
    fetchGames(
      skip,
      fetchLimit,
      searchTitle,
      searchDateRange,
      searchCreatedByUser,
      searchCreatedByCompany,
      sortParameters
    );
  };

  const search = () => {
    let skip = 0;
    let newPagination = {
      current: 1,
      pageSize: fetchLimit,
      position: ["bottomCenter"],
    } as TablePaginationConfig;
    fetchGames(
      skip,
      fetchLimit,
      searchTitle,
      searchDateRange,
      searchCreatedByUser,
      searchCreatedByCompany,
      sortParameters,
      newPagination
    );
  };

  const compare = () => {
    let selected1 = games?.find((g) => g.id === selectedRowKeys[0]);
    let selected2 = games?.find((g) => g.id === selectedRowKeys[1]);
    if (!selected1 || !selected2) return;

    setComparables([selected1.title, selected2.title]);

    let data: any[] = [
      { property: "Amount of genres" },
      { property: "Amount of platforms" },
      { property: "Hundred thousands of sales" },
    ];

    data[0][selected1.title] = selected1.genres?.length;
    data[0][selected2.title] = selected2.genres?.length;
    data[1][selected1.title] = selected1.platforms?.length;
    data[1][selected2.title] = selected2.platforms?.length;
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
          render: (value: any, record: Game) => (
            <Link className={styles.icon} to={`/games/${record.id}/edit`}>
              <EditOutlined />
            </Link>
          ),
        },
        ...columns,
      ];
    } else columns = [...GamesColumns];
  }, [me]);

  useEffect(() => {
    fetchGames(0, fetchLimit);
  }, []);

  return (
    <>
      <Container>
        <Title>Games</Title>
        <Panel>
          <Space>
            <Button icon={<SyncOutlined />} loading={isGamesLoading} onClick={refresh}>
              Refresh
            </Button>
            <Input
              style={{ width: 150 }}
              placeholder="Title"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value === "" ? undefined : e.target.value)}
            />
            <Input
              style={{ width: 150 }}
              placeholder="Created by user"
              value={searchCreatedByUser}
              onChange={(e) => setSearchCreatedByUser(e.target.value === "" ? undefined : e.target.value)}
            />
            <Input
              style={{ width: 150 }}
              placeholder="Created by company"
              value={searchCreatedByCompany}
              onChange={(e) => setSearchCreatedByCompany(e.target.value === "" ? undefined : e.target.value)}
            />
            <DatePicker.RangePicker
              placeholder={["released start", "released end"]}
              onChange={(v) => setDateRange(v as Array<moment.Moment>)}
            />
            <Button icon={<SearchOutlined />} type="primary" loading={isGamesLoading} onClick={search}>
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
                      title: "Are you sure you want to delete these games?",
                      onOk: deleteOnButtonClick,
                    });
                  }}
                  disabled={!hasSelected}
                  loading={isGamesLoading}
                >
                  Delete
                </Button>
                <Link to={"/games/create"}>
                  <Button icon={<PlusOutlined />} type="primary">
                    Create
                  </Button>
                </Link>
              </>
            ) : null}
            <Link to={"/games/statistics"}>
              <Button icon={<BarChartOutlined />} type="dashed">
                Statistics
              </Button>
            </Link>
            <Button disabled={!isPairSelected} icon={<OneToOneOutlined />} onClick={() => compare()} type="dashed">
              Compare
            </Button>
          </Space>
        </Panel>

        <Table
          dataSource={games || undefined}
          rowKey={(record) => record.id}
          columns={columns}
          bordered
          size="small"
          loading={isGamesLoading}
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
