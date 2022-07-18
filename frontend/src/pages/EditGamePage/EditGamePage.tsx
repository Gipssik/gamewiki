import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Game, GamesService } from "../../client";
import { GameEditForm, Loader, Title } from "../../components";
import { useAppSelector } from "../../store";
import { PageNotFound } from "../PageNotFound";

export const EditGamePage: React.FC = () => {
  const gameId = useParams().id;
  const games = useAppSelector((s) => s.games.games);
  const [gameToEdit, setGameToEdit] = useState<Game>();
  const [isGameLoading, setIsGameLoading] = useState<boolean>(true);

  useEffect(() => {
    let game = games?.find((g) => g.id === gameId);
    if (game) {
      setGameToEdit(game);
      setIsGameLoading(false);
      return;
    }

    if (gameId) {
      GamesService.get(gameId)
        .then((g) => {
          setGameToEdit(g);
          setIsGameLoading(false);
        })
        .catch((error) => {
          setIsGameLoading(false);
        });
    }
  }, [gameId]);

  if (isGameLoading) return <Loader />;
  else if (!isGameLoading && !gameToEdit) return <PageNotFound />;

  return (
    <>
      <Title>Edit game {gameToEdit?.title}</Title>
      {gameToEdit ? <GameEditForm game={gameToEdit} /> : null}
    </>
  );
};
