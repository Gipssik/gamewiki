import { Divider, Empty, List } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Platform, PlatformsService } from "../../client";
import { Loader, Title } from "../../components";
import { useAppSelector } from "../../store";
import { PageNotFound } from "../PageNotFound";
import styles from "./PlatformPage.module.css";

export const PlatformPage: React.FC = () => {
  const platformId = useParams().id;
  const platforms = useAppSelector((s) => s.platforms.platforms);
  const [platform, setPlatform] = useState<Platform>();
  const [isPlatformLoading, setIsPlatformLoading] = useState<boolean>(true);

  useEffect(() => {
    let plat = platforms?.find((p) => p.id === platformId);
    if (plat) {
      setPlatform(plat);
      setIsPlatformLoading(false);
      return;
    }

    if (platformId) {
      PlatformsService.get(platformId)
        .then((p) => {
          setPlatform(p);
          setIsPlatformLoading(false);
        })
        .catch((error) => {
          setIsPlatformLoading(false);
        });
    }
  }, [platformId]);

  if (isPlatformLoading) return <Loader />;
  else if (!isPlatformLoading && !platform) return <PageNotFound />;

  return (
    <>
      <Title>Platform {platform?.title}</Title>
      <div className={styles.container}>
        <Divider orientation="left">
          <h2>Info</h2>
        </Divider>
        <table className={styles.datatable}>
          <tbody>
            <tr>
              <td>Created by:</td>
              <td>{platform && platform.created_by_user ? platform.created_by_user.username : "-"}</td>
            </tr>
            <tr>
              <td>Amount of games:</td>
              <td>{platform?.games?.length}</td>
            </tr>
            <tr>
              <td>Amount of sales:</td>
              <td>{platform?.sales?.length}</td>
            </tr>
          </tbody>
        </table>
        <div className={styles.objects}>
          <div>
            <Divider orientation="right">
              <h2>Games</h2>
            </Divider>
            <List
              bordered
              dataSource={platform?.games}
              renderItem={(item) => (
                <List.Item>
                  <Link to={`/games/${item.id}`}>{item.title}</Link>
                </List.Item>
              )}
              locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Games" /> }}
            />
          </div>
          <div>
            <Divider orientation="left">
              <h2>Sales</h2>
            </Divider>
            <List
              bordered
              dataSource={platform?.sales}
              renderItem={(item) => (
                <List.Item>
                  {item.game.title} - {item.platform.title}
                </List.Item>
              )}
              locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Sales" /> }}
            />
          </div>
        </div>
      </div>
    </>
  );
};
