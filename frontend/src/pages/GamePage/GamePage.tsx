import { Divider, Empty, List } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Game, GamesService } from "../../client";
import { Loader, Title } from "../../components";
import { useAppSelector } from "../../store";
import { PageNotFound } from "../PageNotFound";
import styles from "./GamePage.module.css";

export const GamePage: React.FC = () => {
  const gameId = useParams().id;
  const games = useAppSelector((s) => s.games.games);
  const [game, setGame] = useState<Game>();
  const [isGameLoading, setIsGameLoading] = useState<boolean>(true);

  useEffect(() => {
    let gameObj = games?.find((g) => g.id === gameId);
    if (gameObj) {
      setGame(gameObj);
      setIsGameLoading(false);
      return;
    }

    if (gameId) {
      GamesService.get(gameId)
        .then((g) => {
          setGame(g);
          setIsGameLoading(false);
        })
        .catch((error) => {
          setIsGameLoading(false);
        });
    }
  }, [gameId]);

  if (isGameLoading) return <Loader />;
  else if (!isGameLoading && !game) return <PageNotFound />;

  return (
    <>
      <Title>Game {game?.title}</Title>
      <div className={styles.container}>
        <Divider orientation="left">
          <h2>Info</h2>
        </Divider>
        <table className={styles.datatable}>
          <tbody>
            <tr>
              <td>Created by company:</td>
              <td>{game && game.created_by_company.title}</td>
            </tr>
            <tr>
              <td>Released at:</td>
              <td>{game && new Date(game.released_at).toDateString()}</td>
            </tr>
            <tr>
              <td>Created at:</td>
              <td>{game && new Date(game.created_at).toISOString()}</td>
            </tr>
            <tr>
              <td>Created by user:</td>
              <td>{game && game.created_by_user ? game.created_by_user.username : "-"}</td>
            </tr>
            <tr>
              <td>Amount of genres:</td>
              <td>{game?.genres?.length}</td>
            </tr>
            <tr>
              <td>Amount of platforms:</td>
              <td>{game?.platforms?.length}</td>
            </tr>
          </tbody>
        </table>
        <div className={styles.objects}>
          <div>
            <Divider orientation="right">
              <h2>Genres</h2>
            </Divider>
            <List
              bordered
              dataSource={game?.genres}
              renderItem={(item) => (
                <List.Item>
                  <Link to={`/genres/${item.id}`}>{item.title}</Link>
                </List.Item>
              )}
              locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Genres" /> }}
            />
          </div>
          <div>
            <Divider orientation="left">
              <h2>Platforms</h2>
            </Divider>
            <List
              bordered
              dataSource={game?.platforms}
              renderItem={(item) => (
                <List.Item>
                  <Link to={`/platforms/${item.id}`}>{item.title}</Link>
                </List.Item>
              )}
              locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Platforms" /> }}
            />
          </div>
        </div>

        <Divider>
          <h2>Sales</h2>
        </Divider>
        <List
          bordered
          dataSource={game?.sales}
          renderItem={(item) => (
            <List.Item>
              {item.game.title} - {item.platform.title}
            </List.Item>
          )}
          locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Sales" /> }}
        />
      </div>
    </>
  );
};
