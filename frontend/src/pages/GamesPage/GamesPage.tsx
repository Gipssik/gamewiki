import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Input, message, Space, Table, TablePaginationConfig } from "antd";
import modal from "antd/lib/modal";
import { FilterValue, SorterResult } from "antd/lib/table/interface";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Game, GamesService } from "../../client";
import { GamesColumns } from "../../columns";
import { Container, Panel, Title } from "../../components";
import { gamesActions, useAppDispatch, useAppSelector } from "../../store";
import { fetchLimit, getSign, getSkip, getSorts } from "../../utils";
import styles from "../../columns/columns.module.css";

let columns = [...GamesColumns];

export const GamesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { games, pagination } = useAppSelector((s) => s.games);
  const me = useAppSelector((s) => s.auth.me);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const hasSelected = selectedRowKeys.length > 0;
  const [isGamesLoading, setIsGamesLoading] = useState(true);
  const [searchTitle, setSearchTitle] = useState<string>();
  const [searchCreatedByUser, setSearchCreatedByUser] = useState<string>();
  const [searchCreatedByCompany, setSearchCreatedByCompany] = useState<string>();
  const [sortParameters, setSortParameters] = useState<string | undefined>(undefined);

  const setPagination = (newPagination: TablePaginationConfig) => {
    dispatch(gamesActions.setPagination({ pagination: newPagination }));
  };

  const fetchGames = (
    skip?: number,
    limit?: number,
    title?: string,
    createdByUser?: string,
    createdByCompany?: string,
    sort?: string,
    newPagination?: TablePaginationConfig
  ) => {
    setIsGamesLoading(true);
    GamesService.getMultiWithHeaders(skip, limit, title, createdByUser, createdByCompany, sort)
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

    fetchGames(skip, fetchLimit, searchTitle, searchCreatedByUser, searchCreatedByCompany, sorts, newPagination);
  };

  const deleteOnButtonClick = () => {
    let skip = getSkip(pagination);
    GamesService.deleteMulti(selectedRowKeys as string[])
      .then((data) => {
        message.success("Games were successfully deleted!", 5);
        setSelectedRowKeys([]);
        fetchGames(skip, fetchLimit, searchTitle, searchCreatedByUser, searchCreatedByCompany, sortParameters);
      })
      .catch((error) => {
        message.error(error, 5);
      });
  };

  const refresh = () => {
    let skip = getSkip(pagination);
    setSelectedRowKeys([]);
    fetchGames(skip, fetchLimit, searchTitle, searchCreatedByUser, searchCreatedByCompany, sortParameters);
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
      searchCreatedByUser,
      searchCreatedByCompany,
      sortParameters,
      newPagination
    );
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
    <Container>
      <Title>Games</Title>
      <Panel>
        <Space>
          <Button icon={<SyncOutlined />} loading={isGamesLoading} onClick={refresh}>
            Refresh
          </Button>
          <Input
            placeholder="Title"
            value={searchTitle}
            onChange={(e) => setSearchTitle(e.target.value === "" ? undefined : e.target.value)}
          />
          <Input
            placeholder="Created by user"
            value={searchCreatedByUser}
            onChange={(e) => setSearchCreatedByUser(e.target.value === "" ? undefined : e.target.value)}
          />
          <Input
            placeholder="Created by company"
            value={searchCreatedByCompany}
            onChange={(e) => setSearchCreatedByCompany(e.target.value === "" ? undefined : e.target.value)}
          />
          <Button icon={<SearchOutlined />} type="primary" loading={isGamesLoading} onClick={search}>
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
          </Space>
        ) : null}
      </Panel>

      <Table
        dataSource={games || undefined}
        rowKey={(record) => record.id}
        columns={columns}
        bordered
        size="small"
        loading={isGamesLoading}
        pagination={pagination}
        rowSelection={
          me && me.is_superuser ? { type: "checkbox", onChange: setSelectedRowKeys, selectedRowKeys } : undefined
        }
        onChange={handleTableChange}
      />
    </Container>
  );
};
