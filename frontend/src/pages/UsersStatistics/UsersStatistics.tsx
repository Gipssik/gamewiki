import { Pie, PieConfig } from "@ant-design/charts";
import { Line, LineConfig } from "@ant-design/plots";
import { Button, Divider, InputNumber, Space } from "antd";
import React, { useEffect, useState } from "react";
import { UserCreationStatistics, UsersService } from "../../client";
import { Loader, Title } from "../../components";
import styles from "./UsersStatistics.module.css";

type RoleStats = {
  title: string;
  users: number;
};

export const UsersStatistics: React.FC = () => {
  const [creationData, setCreationData] = useState<UserCreationStatistics[]>([]);
  const [isCreationDataLoading, setIsCreationDataLoading] = useState<boolean>(true);
  const [rolesData, setRolesData] = useState<RoleStats[]>([]);
  const [isRolesDataLoading, setIsRolesDataLoading] = useState<boolean>(true);
  const [days, setDays] = useState<number>(14);
  const creationChartConfig: LineConfig = {
    data: creationData,
    xField: "date",
    yField: "users",
    label: {},
    point: {
      size: 5,
      shape: "diamond",
      style: {
        fill: "white",
        stroke: "#439775",
        lineWidth: 2,
      },
    },
    lineStyle: {
      stroke: "#439775",
    },
    tooltip: {
      showMarkers: false,
    },
    state: {
      active: {
        style: {
          shadowBlur: 4,
          stroke: "#000",
          fill: "red",
        },
      },
    },
    interactions: [
      {
        type: "marker-active",
      },
    ],
    smooth: true,
  };
  const rolesChartConfig: PieConfig = {
    appendPadding: 10,
    data: rolesData,
    angleField: "users",
    colorField: "title",
    radius: 0.9,
    legend: {
      position: "top",
      reversed: true,
    },
    label: {
      type: "inner",
      offset: "-30%",
      content: ({ percent }) => `${(percent * 100).toFixed(0)}%`,
      style: {
        fontSize: 14,
        textAlign: "center",
      },
    },
    interactions: [
      {
        type: "element-active",
      },
    ],
  };

  const fetchCreationData = (d: number) => {
    setIsCreationDataLoading(true);
    UsersService.getCreationStatistics(d).then((data) => {
      setCreationData(data);
      setIsCreationDataLoading(false);
    });
  };

  const fetchRolesData = () => {
    setIsRolesDataLoading(true);
    UsersService.getRoleStatistics().then((data) => {
      setRolesData(data.map((d) => ({ title: d.is_superuser ? "Superuser" : "Regular User", users: d.users })));
      setIsRolesDataLoading(false);
    });
  };

  useEffect(() => {
    fetchCreationData(days);
    fetchRolesData();
  }, []);

  if (isCreationDataLoading || isRolesDataLoading) return <Loader />;

  return (
    <div className={styles.container}>
      <Title>Users Statistics</Title>
      <div className={styles.chart}>
        <Divider orientation="right">
          <h2>Users Creation Plot</h2>
        </Divider>
        <Space style={{ marginBottom: 20 }}>
          Days:
          <InputNumber min={1} max={90} defaultValue={days} onChange={setDays} />
          <Button type="primary" onClick={() => days && fetchCreationData(days)}>
            Apply
          </Button>
        </Space>
        <Line {...creationChartConfig} />;
      </div>
      <div className={styles.chart}>
        <Divider orientation="left">
          <h2>Users Roles Chart</h2>
        </Divider>
        <Pie {...rolesChartConfig} />
      </div>
    </div>
  );
};
