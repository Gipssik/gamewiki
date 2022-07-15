import { Button, message, Space, Table, TablePaginationConfig } from "antd";
import modal from "antd/lib/modal";
import { FilterValue, SorterResult } from "antd/lib/table/interface";
import React, { useEffect, useState } from "react";
import { Backup, BackupsService } from "../../client";
import { BackupsColumns } from "../../columns";
import { Container, Panel, Title } from "../../components";
import { backupsActions, useAppDispatch, useAppSelector } from "../../store";
import { fetchLimit, getSign } from "../../utils";

export const BackupsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { backups, pagination } = useAppSelector((s) => s.backups);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const hasSelected = selectedRowKeys.length > 0;
  const isOneSelected = selectedRowKeys.length === 1;
  const [isBackupsLoading, setIsBackupsLoading] = useState(true);
  const [sortParameters, setSortParameters] = useState<string | undefined>(undefined);
  const [skipParameter, setSkipParameter] = useState<number>(0);

  const setPagination = (newPagination: TablePaginationConfig) => {
    dispatch(backupsActions.setPagination({ pagination: newPagination }));
  };

  const fetchBackups = (
    skip?: number | undefined,
    limit?: number | undefined,
    sorts?: string | undefined,
    newPagination?: TablePaginationConfig
  ) => {
    setIsBackupsLoading(true);
    BackupsService.getMultiWithHeaders(skip, limit, sorts)
      .then((data) => {
        dispatch(backupsActions.setAll({ backups: data.body || [] }));

        if (newPagination) setPagination({ ...newPagination, total: Number(data.count) });
        else setPagination({ ...pagination, total: Number(data.count) });

        setIsBackupsLoading(false);
      })
      .catch((error) => {
        setIsBackupsLoading(false);
      });
  };

  const deleteOnButtonClick = () => {
    BackupsService.deleteMulti(selectedRowKeys as string[])
      .then((data) => {
        message.success("Backups deletion was started!", 5);
        setSelectedRowKeys([]);
      })
      .catch((error) => {
        message.error(error, 5);
      });
  };

  const handleTableChange = (
    newPagination: TablePaginationConfig,
    filters: Record<string, FilterValue | null>,
    sorter: SorterResult<Backup> | SorterResult<Backup>[]
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

    fetchBackups(skip, fetchLimit, sorts, newPagination);
  };

  const refresh = () => {
    let skip = pagination.current && (pagination.current - 1) * fetchLimit;
    setSelectedRowKeys([]);
    fetchBackups(skip, fetchLimit, sortParameters);
  };

  const create = () => {
    BackupsService.create()
      .then((data) => {
        message.success(data.message, 5);
      })
      .catch((error) => {
        message.error(error, 5);
        console.log(error);
      });
  };

  const apply = () => {
    BackupsService.restore(selectedRowKeys[0] as string)
      .then((data) => {
        message.success(data.message, 5);
      })
      .catch((error) => {
        message.error(error, 5);
        console.log(error);
      });
  };

  useEffect(() => {
    if (!backups) fetchBackups(0, fetchLimit);
    else setIsBackupsLoading(false);
  }, [backups]);

  return (
    <Container>
      <Title>Backups</Title>
      <Panel>
        <Space>
          <Button loading={isBackupsLoading} onClick={refresh}>
            Refresh
          </Button>
          <Button
            type="primary"
            loading={isBackupsLoading}
            onClick={() => {
              modal.confirm({
                title: "Are you sure you want to create backup?",
                onOk: create,
              });
            }}
          >
            Create
          </Button>
        </Space>
        <Space>
          <span>{hasSelected ? `Selected ${selectedRowKeys.length} items` : ""}</span>
          <Button
            type="primary"
            danger
            onClick={() => {
              modal.confirm({
                title: "Are you sure you want to delete these backups?",
                onOk: deleteOnButtonClick,
              });
            }}
            disabled={!hasSelected}
            loading={isBackupsLoading}
          >
            Delete
          </Button>
          <Button
            onClick={() => {
              modal.confirm({
                title: "Are you sure you want to apply backup? A lot of data could be lost!",
                onOk: apply,
              });
            }}
            disabled={!isOneSelected}
            loading={isBackupsLoading}
          >
            Apply
          </Button>
        </Space>
      </Panel>
      <Table
        dataSource={backups || undefined}
        rowKey={(recourd) => recourd.id}
        columns={BackupsColumns}
        bordered
        size="small"
        loading={isBackupsLoading}
        pagination={pagination}
        rowSelection={{ type: "checkbox", onChange: setSelectedRowKeys, selectedRowKeys }}
        onChange={handleTableChange}
      />
    </Container>
  );
};
