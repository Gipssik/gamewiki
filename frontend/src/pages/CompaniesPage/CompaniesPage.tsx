import { DeleteOutlined, EditOutlined, PlusOutlined, SearchOutlined, SyncOutlined } from "@ant-design/icons";
import { Button, Input, message, Space, Table, TablePaginationConfig } from "antd";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CompaniesService, Company } from "../../client";
import { CompaniesColumns } from "../../columns";
import { Container, Panel, Title } from "../../components";
import { companiesActions, useAppDispatch, useAppSelector } from "../../store";
import styles from "../../columns/columns.module.css";
import { fetchLimit, getSign, getSkip } from "../../utils";
import { FilterValue, SorterResult } from "antd/lib/table/interface";
import modal from "antd/lib/modal";

let columns = [...CompaniesColumns];

export const CompaniesPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { companies, pagination } = useAppSelector((s) => s.companies);
  const me = useAppSelector((s) => s.auth.me);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const hasSelected = selectedRowKeys.length > 0;
  const [isCompaniesLoading, setIsCompaniesLoading] = useState<boolean>(true);
  const [sortParameters, setSortParameters] = useState<string | undefined>(undefined);
  const [searchTitle, setSearchTitle] = useState<string | undefined>(undefined);
  const [searchCreatedBy, setSearchCreatedBy] = useState<string | undefined>(undefined);

  const setPagination = (newPagination: TablePaginationConfig) => {
    dispatch(companiesActions.setPagination({ pagination: newPagination }));
  };

  const fetchCompanies = (
    skip?: number,
    limit?: number,
    title?: string,
    createdByUser?: string,
    sort?: string,
    newPagination?: TablePaginationConfig
  ) => {
    setIsCompaniesLoading(true);
    CompaniesService.getMultiWithHeaders(skip, limit, title, createdByUser, sort)
      .then((data) => {
        dispatch(companiesActions.setAll({ companies: data.body || [] }));

        if (newPagination) setPagination({ ...newPagination, total: Number(data.count) });
        else setPagination({ ...pagination, total: Number(data.count) });

        setIsCompaniesLoading(false);
      })
      .catch((error) => {
        setIsCompaniesLoading(false);
      });
  };

  const handleTableChange = (
    newPagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<Company> | SorterResult<Company>[]
  ) => {
    let skip = getSkip(newPagination);
    let sorts: string | undefined;
    if (sorter && sorter instanceof Array) {
      sorts = sorter.map((sort) => getSign(sort.order || null) + sort.field).join(",");
    } else if (sorter && sorter instanceof Object && sorter.column !== undefined) {
      sorts = getSign(sorter.order || null) + sorter.field;
    }

    setSortParameters(sorts);

    fetchCompanies(skip, fetchLimit, searchTitle, searchCreatedBy, sorts, newPagination);
  };

  const refresh = () => {
    let skip = getSkip(pagination);
    setSelectedRowKeys([]);
    fetchCompanies(skip, fetchLimit, searchTitle, searchCreatedBy, sortParameters);
  };

  const search = () => {
    let skip = 0;
    let newPagination = {
      current: 1,
      pageSize: fetchLimit,
      position: ["bottomCenter"],
    } as TablePaginationConfig;
    fetchCompanies(skip, fetchLimit, searchTitle, searchCreatedBy, sortParameters, newPagination);
  };

  const deleteOnButtonClick = () => {
    let skip = getSkip(pagination);
    CompaniesService.deleteMulti(selectedRowKeys as string[])
      .then((data) => {
        message.success("Companies were successfully deleted!", 5);
        setSelectedRowKeys([]);
        fetchCompanies(skip, fetchLimit, searchTitle, searchCreatedBy, sortParameters);
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
          render: (value: any, record: Company) => (
            <Link className={styles.icon} to={`/companies/${record.id}/edit`}>
              <EditOutlined />
            </Link>
          ),
        },
        ...columns,
      ];
    } else columns = [...CompaniesColumns];
  }, [me]);

  useEffect(() => {
    if (!companies) fetchCompanies(0, fetchLimit);
    else setIsCompaniesLoading(false);
  }, []);

  return (
    <Container>
      <Title>Companies</Title>
      <Panel>
        <Space>
          <Button icon={<SyncOutlined />} loading={isCompaniesLoading} onClick={refresh}>
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
          <Button icon={<SearchOutlined />} type="primary" loading={isCompaniesLoading} onClick={search}>
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
                  title: "Are you sure you want to delete these companies?",
                  onOk: deleteOnButtonClick,
                });
              }}
              disabled={!hasSelected}
              loading={isCompaniesLoading}
            >
              Delete
            </Button>
            <Link to={"/companies/create"}>
              <Button icon={<PlusOutlined />} type="primary">
                Create
              </Button>
            </Link>
          </Space>
        ) : null}
      </Panel>
      <Table
        dataSource={companies || undefined}
        rowKey={(record) => record.id}
        columns={columns}
        bordered
        size="small"
        loading={isCompaniesLoading}
        pagination={pagination}
        rowSelection={
          me && me.is_superuser ? { type: "checkbox", onChange: setSelectedRowKeys, selectedRowKeys } : undefined
        }
        onChange={handleTableChange}
      />
    </Container>
  );
};
