import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Genre, GenresService } from "../../client";
import { GenreEditForm, Loader, Title } from "../../components";
import { useAppSelector } from "../../store";
import { PageNotFound } from "../PageNotFound";

export const EditGenrePage: React.FC = () => {
  const genreId = useParams().id;
  const genres = useAppSelector((s) => s.genres.genres);
  const [genreToEdit, setGenreToEdit] = useState<Genre>();
  const [isGenreLoading, setIsGenreLoading] = useState<boolean>(true);

  useEffect(() => {
    let genre = genres?.find((g) => g.id === genreId);
    if (genre) {
      setGenreToEdit(genre);
      setIsGenreLoading(false);
      return;
    }

    if (genreId) {
      GenresService.get(genreId)
        .then((g) => {
          setGenreToEdit(g);
          setIsGenreLoading(false);
        })
        .catch((error) => {
          setIsGenreLoading(false);
        });
    }
  }, [genreId]);

  if (isGenreLoading) return <Loader />;
  else if (!isGenreLoading && !genreToEdit) return <PageNotFound />;

  return (
    <>
      <Title>Edit genre {genreToEdit?.title}</Title>
      {genreToEdit ? <GenreEditForm genre={genreToEdit} /> : null}
    </>
  );
};
