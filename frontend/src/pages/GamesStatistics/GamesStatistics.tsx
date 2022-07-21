import { Column, ColumnConfig } from "@ant-design/charts";
import { Divider } from "antd";
import React, { useEffect, useState } from "react";
import { GamePopulationStatistics, GamesService } from "../../client";
import { Loader, Title } from "../../components";
import styles from "../UsersStatistics/UsersStatistics.module.css";

export const GamesStatistics: React.FC = () => {
  const [salesData, setSalesData] = useState<GamePopulationStatistics[]>([]);
  const [isSalesDataLoading, setIsSalesDataLoading] = useState<boolean>(true);
  const salesDataConfig: ColumnConfig = {
    data: salesData,
    xField: "title",
    yField: "sales_sum",
    xAxis: {
      label: {
        autoRotate: false,
      },
    },
    slider: {
      start: 0,
      end: 1,
    },
  };

  const fetchSalesData = () => {
    setIsSalesDataLoading(true);
    GamesService.getPopularityStatistics().then((data) => {
      setSalesData(data);
      setIsSalesDataLoading(false);
    });
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  if (isSalesDataLoading) return <Loader />;

  return (
    <div className={styles.container}>
      <Title>Games Statistics</Title>
      <div className={styles.chart}>
        <Divider orientation="left">
          <h2>Popularity Statistics</h2>
        </Divider>
        <Column {...salesDataConfig} />
      </div>
    </div>
  );
};
