import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Input, message, Space, Table, TablePaginationConfig } from "antd";
import { FilterValue, SorterResult } from "antd/lib/table/interface";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Genre, GenresService } from "../../client";
import { GenresColumns } from "../../columns";
import { genresActions, useAppDispatch, useAppSelector } from "../../store";
import { fetchLimit, getSign, getSkip, getSorts } from "../../utils";
import styles from "../../columns/columns.module.css";
import { Container, Panel, Title } from "../../components";
import modal from "antd/lib/modal";

let columns = [...GenresColumns];

export const GenresPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { genres, pagination } = useAppSelector((s) => s.genres);
  const me = useAppSelector((s) => s.auth.me);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const hasSelected = selectedRowKeys.length > 0;
  const [isGenresLoading, setIsGenresLoading] = useState<boolean>(true);
  const [sortParameters, setSortParameters] = useState<string | undefined>(undefined);
  const [searchTitle, setSearchTitle] = useState<string | undefined>(undefined);
  const [searchCreatedBy, setSearchCreatedBy] = useState<string | undefined>(undefined);

  const setPagination = (newPagination: TablePaginationConfig) => {
    dispatch(genresActions.setPagination({ pagination: newPagination }));
  };

  const fetchGenres = (
    skip?: number,
    limit?: number,
    title?: string,
    createdByUser?: string,
    sort?: string,
    newPagination?: TablePaginationConfig
  ) => {
    setIsGenresLoading(true);
    GenresService.getMultiWithHeaders(skip, limit, title, createdByUser, sort)
      .then((data) => {
        dispatch(genresActions.setAll({ genres: data.body || [] }));

        if (newPagination) setPagination({ ...newPagination, total: Number(data.count) });
        else setPagination({ ...pagination, total: Number(data.count) });

        setIsGenresLoading(false);
      })
      .catch((error) => {
        setIsGenresLoading(false);
      });
  };

  const handleTableChange = (
    newPagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<Genre> | SorterResult<Genre>[]
  ) => {
    let skip = getSkip(newPagination);

    let sorts = getSorts<Genre>(sorter);

    setSortParameters(sorts);

    fetchGenres(skip, fetchLimit, searchTitle, searchCreatedBy, sorts, newPagination);
  };

  const refresh = () => {
    let skip = getSkip(pagination);
    setSelectedRowKeys([]);
    fetchGenres(skip, fetchLimit, searchTitle, searchCreatedBy, sortParameters);
  };

  const search = () => {
    let skip = 0;
    let newPagination = {
      current: 1,
      pageSize: fetchLimit,
      position: ["bottomCenter"],
    } as TablePaginationConfig;
    fetchGenres(skip, fetchLimit, searchTitle, searchCreatedBy, sortParameters, newPagination);
  };

  const deleteOnButtonClick = () => {
    let skip = getSkip(pagination);
    GenresService.deleteMulti(selectedRowKeys as string[])
      .then((data) => {
        message.success("Genres were successfully deleted!", 5);
        setSelectedRowKeys([]);
        fetchGenres(skip, fetchLimit, searchTitle, searchCreatedBy, sortParameters);
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
          render: (value: any, record: Genre) => (
            <Link className={styles.icon} to={`/genres/${record.id}/edit`}>
              <EditOutlined />
            </Link>
          ),
        },
        ...columns,
      ];
    } else columns = [...GenresColumns];
  }, [me]);

  useEffect(() => {
    fetchGenres(0, fetchLimit);
  }, []);

  return (
    <Container>
      <Title>Genres</Title>
      <Panel>
        <Space>
          <Button icon={<SyncOutlined />} loading={isGenresLoading} onClick={refresh}>
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
          <Button icon={<SearchOutlined />} type="primary" loading={isGenresLoading} onClick={search}>
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
                  title: "Are you sure you want to delete these genres?",
                  onOk: deleteOnButtonClick,
                });
              }}
              disabled={!hasSelected}
              loading={isGenresLoading}
            >
              Delete
            </Button>
            <Link to={"/genres/create"}>
              <Button icon={<PlusOutlined />} type="primary">
                Create
              </Button>
            </Link>
          </Space>
        ) : null}
      </Panel>
      <Table
        dataSource={genres || undefined}
        rowKey={(record) => record.id}
        columns={columns}
        bordered
        size="small"
        loading={isGenresLoading}
        pagination={pagination}
        rowSelection={
          me && me.is_superuser ? { type: "checkbox", onChange: setSelectedRowKeys, selectedRowKeys } : undefined
        }
        onChange={handleTableChange}
      />
    </Container>
  );
};
