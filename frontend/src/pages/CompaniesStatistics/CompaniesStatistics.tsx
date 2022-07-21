import { Column, ColumnConfig, Pie, PieConfig } from "@ant-design/charts";
import { Divider } from "antd";
import React, { useEffect, useState } from "react";
import { CompaniesService, CompanyFoundationStatistics, CompanyGamesStatistics } from "../../client";
import { Loader, Title } from "../../components";
import styles from "../UsersStatistics/UsersStatistics.module.css";

export const CompaniesStatistics: React.FC = () => {
  const [foundationData, setFoundationData] = useState<CompanyFoundationStatistics[]>([]);
  const [isFoundationDataLoading, setIsFoundationDataLoading] = useState<boolean>(true);
  const [gamesData, setGamesData] = useState<CompanyGamesStatistics[]>([]);
  const [isGamesDataLoading, setIsGamesDataLoading] = useState<boolean>(true);
  const foundationDataConfig: ColumnConfig = {
    data: foundationData,
    xField: "year",
    yField: "companies",
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
  const gamesChartConfig: PieConfig = {
    appendPadding: 10,
    data: gamesData,
    angleField: "games_count",
    colorField: "title",
    radius: 0.75,
    legend: {
      position: "top",
      reversed: true,
    },
    label: {
      type: "spider",
      labelHeight: 28,
      content: "{name}\n{percentage}",
    },
    interactions: [
      {
        type: "element-selected",
      },
      {
        type: "element-active",
      },
    ],
  };

  const fetchFoundationData = () => {
    setIsFoundationDataLoading(true);
    CompaniesService.getFoundationStatistics().then((data) => {
      setFoundationData(data);
      setIsFoundationDataLoading(false);
    });
  };

  const fetchGamesData = () => {
    setIsGamesDataLoading(true);
    CompaniesService.getGamesStatistics().then((data) => {
      setGamesData(data);
      setIsGamesDataLoading(false);
    });
  };

  useEffect(() => {
    fetchFoundationData();
    fetchGamesData();
  }, []);

  if (isFoundationDataLoading || isGamesDataLoading) return <Loader />;

  return (
    <div className={styles.container}>
      <Title>Companies Statistics</Title>
      <div className={styles.chart}>
        <Divider orientation="right">
          <h2>Company Foundation Chart</h2>
        </Divider>
        <Column {...foundationDataConfig} />
      </div>
      <div className={styles.chart}>
        <Divider orientation="left">
          <h2>Company's Games Amount Chart</h2>
        </Divider>
        <Pie {...gamesChartConfig} />
      </div>
    </div>
  );
};
