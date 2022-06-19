from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.exc import IntegrityError, NoResultFound

from backend.custom_types import GenreOrderColumns, OrderColumn
from backend.db import models
from backend.db.dao import GenreDAO
from backend.db.dependencies.order_validation import OrderValidation
from backend.db.dependencies.user import get_current_superuser
from backend.db.models.genre import Genre
from backend.exceptions import ObjectNotFoundException
from backend.web.api.genre import schema
from backend.web.api.genre.schema.genre import Genre as GenreSchema

router = APIRouter()


@router.get("/", response_model=list[GenreSchema])
async def get_multi(
    response: Response,
    queries: schema.GenreQueries = Depends(),
    sort: list[OrderColumn] = Depends(OrderValidation(GenreOrderColumns)),
    genre_dao: GenreDAO = Depends(),
) -> list[Genre]:
    """Get list of genres.

    Args:
        response (Response): Response.
        queries (GenreQueries, optional): Query parameters.
        sort (list[OrderColumn], optional): Order parameters.
        genre_dao (GenreDAO, optional): Genre DAO.

    Returns:
        list[Genre]: List of genres.
    """

    filters_dict = {
        "title": Genre.title.ilike(f"%{queries.title}%"),
        "created_by_user": models.User.username.ilike(f"%{queries.created_by_user}%"),
    }
    filters = queries.dict(exclude_none=True, include={*filters_dict.keys()})
    filters_list = [filters_dict[key] for key in filters.keys()]

    amount = await genre_dao.get_count(expr=filters_list)
    genres = await genre_dao.get_ordered_multi(
        expr=filters_list,
        offset=queries.skip,
        limit=queries.limit,
        sort=sort,
    )

    response.headers["X-Total-Count"] = str(amount)
    return genres


@router.get("/{genre_id}", response_model=GenreSchema)
async def get(genre_id: UUID, genre_dao: GenreDAO = Depends()) -> Genre:
    """Get genre by id.

    Args:
        genre_id (UUID): Genre id.
        genre_dao (GenreDAO, optional): Genre DAO.

    Returns:
        Genre: Genre.
    """

    genre = await genre_dao.get(str(genre_id))
    if not genre:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Genre not found",
        )
    return genre


@router.post("/", response_model=GenreSchema)
async def create(
    genre: schema.GenreCreate,
    genre_dao: GenreDAO = Depends(),
    current_superuser: models.User = Depends(get_current_superuser),
) -> Genre:
    """Create genre.

    Args:
        genre (GenreCreate): Genre data.
        genre_dao (GenreDAO, optional): Genre DAO.
        current_superuser (models.User, optional): Current superuser.

    Returns:
        Genre: Genre.
    """

    try:
        return await genre_dao.create_by_user(genre.dict(), str(current_superuser.id))
    except IntegrityError as error:
        if "duplicate key" in str(error.__cause__):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Genre already exists",
            )
        raise error


@router.patch("/{genre_id}", response_model=GenreSchema)
async def update(
    genre_id: UUID,
    genre: schema.GenreUpdate,
    genre_dao: GenreDAO = Depends(),
    current_superuser: models.User = Depends(get_current_superuser),
) -> Genre:
    """Update genre.

    Args:
        genre_id (UUID): Genre id.
        genre (GenreUpdate): Genre data.
        genre_dao (GenreDAO, optional): Genre DAO.
        current_superuser (models.User, optional): Current superuser.

    Returns:
        Genre: Genre.
    """

    try:
        return await genre_dao.update(genre.dict(exclude_unset=True), str(genre_id))
    except ObjectNotFoundException as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Genre not found",
        )
    except IntegrityError as error:
        if "duplicate key" in str(error.__cause__):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Genre already exists",
            )
        raise error


@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
async def delete_multi(
    genre_ids: list[UUID],
    genre_dao: GenreDAO = Depends(),
    current_superuser: models.User = Depends(get_current_superuser),
) -> None:
    """Delete multiple genres.

    Args:
        genre_ids (list[UUID]): Genre ids.
        genre_dao (GenreDAO, optional): Genre DAO.
        current_superuser (models.User, optional): Current superuser.

    Returns:
        None: None.
    """

    try:
        await genre_dao.delete_multi([str(genre_id) for genre_id in genre_ids])
    except ObjectNotFoundException as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Genre(s) not found: {str(error)}",
        )


@router.delete("/{genre_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete(
    genre_id: UUID,
    genre_dao: GenreDAO = Depends(),
    current_superuser: models.User = Depends(get_current_superuser),
) -> None:
    """Delete genre.

    Args:
        genre_id (UUID): Genre id.
        genre_dao (GenreDAO, optional): Genre DAO.
        current_superuser (models.User, optional): Current superuser.

    Returns:
        None: None.
    """

    try:
        await genre_dao.delete(str(genre_id))
    except NoResultFound as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Genre not found",
        )
