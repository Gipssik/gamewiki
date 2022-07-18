import { Divider, Empty, List } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Genre, GenresService } from "../../client";
import { Loader, Title } from "../../components";
import { useAppSelector } from "../../store";
import { PageNotFound } from "../PageNotFound";
import styles from "./GenrePage.module.css";

export const GenrePage: React.FC = () => {
  const genreId = useParams().id;
  const genres = useAppSelector((s) => s.genres.genres);
  const [genre, setGenre] = useState<Genre>();
  const [isGenreLoading, setIsGenreLoading] = useState<boolean>(true);

  useEffect(() => {
    let gen = genres?.find((g) => g.id === genreId);
    if (gen) {
      setGenre(gen);
      setIsGenreLoading(false);
      return;
    }

    if (genreId) {
      GenresService.get(genreId)
        .then((g) => {
          setGenre(g);
          setIsGenreLoading(false);
        })
        .catch((error) => {
          setIsGenreLoading(false);
        });
    }
  }, [genreId]);

  if (isGenreLoading) return <Loader />;
  else if (!isGenreLoading && !genre) return <PageNotFound />;

  return (
    <>
      <Title>Genre {genre?.title}</Title>
      <div className={styles.container}>
        <Divider orientation="left">
          <h2>Info</h2>
        </Divider>
        <table className={styles.datatable}>
          <tbody>
            <tr>
              <td>Created by:</td>
              <td>{genre && genre.created_by_user ? genre.created_by_user.username : "-"}</td>
            </tr>
            <tr>
              <td>Amount of games:</td>
              <td>{genre?.games?.length}</td>
            </tr>
          </tbody>
        </table>
        <div>
          <Divider orientation="right">
            <h2>Games</h2>
          </Divider>
          <List
            bordered
            dataSource={genre?.games}
            renderItem={(item) => (
              <List.Item>
                <Link to={`/games/${item.id}`}>{item.title}</Link>
              </List.Item>
            )}
            locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Games" /> }}
          />
        </div>
      </div>
    </>
  );
};
