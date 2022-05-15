from backend.web.api.genre.schema.genre_base import GenreBase


class GenreCreate(GenreBase):
    title: str
