import { Column, ColumnConfig } from "@ant-design/charts";
import { Divider } from "antd";
import React, { useEffect, useState } from "react";
import { SalesService } from "../../client";
import { Loader, Title } from "../../components";
import styles from "../UsersStatistics/UsersStatistics.module.css";

type SalesStats = {
  title: string;
  amount: number;
};

export const SalesStatistics: React.FC = () => {
  const [salesData, setSalesData] = useState<SalesStats[]>([]);
  const [isSalesDataLoading, setIsSalesDataLoading] = useState<boolean>(true);
  const salesDataConfig: ColumnConfig = {
    data: salesData,
    xField: "title",
    yField: "amount",
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
    SalesService.getPopularityStatistics().then((data) => {
      setSalesData(data.map((d) => ({ title: `${d.game} - ${d.platform}`, amount: d.amount })));
      setIsSalesDataLoading(false);
    });
  };

  useEffect(() => {
    fetchSalesData();
  }, []);

  if (isSalesDataLoading) return <Loader />;

  return (
    <div className={styles.container}>
      <Title>Sales Statistics</Title>
      <div className={styles.chart}>
        <Divider orientation="left">
          <h2>Popularity Statistics</h2>
        </Divider>
        <Column {...salesDataConfig} />
      </div>
    </div>
  );
};
