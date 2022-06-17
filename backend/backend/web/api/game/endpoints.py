from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError

from backend.custom_types import GameOrderColumns, OrderColumn
from backend.db import models
from backend.db.dao import GameDAO
from backend.db.dependencies.order_validation import OrderValidation
from backend.db.dependencies.user import get_current_superuser
from backend.db.models.game import Game
from backend.exceptions import ObjectNotFoundException
from backend.web.api.game import schema
from backend.web.api.game.schema.game import Game as GameSchema

router = APIRouter()


@router.get("/", response_model=list[GameSchema])
async def get_multi(
    queries: schema.GameQueries = Depends(),
    orders: list[OrderColumn] = Depends(OrderValidation(GameOrderColumns)),
    game_dao: GameDAO = Depends(),
) -> list[Game]:
    """Get list of games.

    Args:
        queries (schema.GameQueries): Query parameters.
        orders (list[OrderColumn]): Order parameters.
        game_dao (GameDAO): Game DAO.

    Returns:
        list[Game]: List of games.
    """

    # TODO: Check if need to fix
    filters_dict = {
        "title": Game.title.ilike(f"%{queries.title}%"),
        "created_by_user": models.User.username.ilike(f"%{queries.created_by_user}%"),
        "created_by_company": models.Company.title.ilike(
            f"%{queries.created_by_company}%",
        ),
    }
    filters = queries.dict(exclude_none=True, include={*filters_dict.keys()})
    filters_list = [filters_dict[key] for key in filters.keys()]

    return await game_dao.get_ordered_multi(
        expr=filters_list,
        offset=queries.skip,
        limit=queries.limit,
        orders=orders,
    )


@router.get("/{game_id}", response_model=GameSchema)
async def get(game_id: UUID, game_dao: GameDAO = Depends()) -> Game:
    """Get game by ID.

    Args:
        game_id (UUID): Game ID.
        game_dao (GameDAO): Game DAO.

    Returns:
        Game: Game.
    """

    game = await game_dao.get(str(game_id))
    if not game:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Game not found",
        )
    return game


@router.post("/", response_model=GameSchema)
async def create(
    game: schema.GameCreate,
    game_dao: GameDAO = Depends(),
    current_superuser: models.User = Depends(get_current_superuser),
) -> Game:
    """Create game.

    Args:
        game (schema.GameCreate): Game data.
        game_dao (GameDAO): Game DAO.
        current_superuser (models.User): Current superuser.

    Returns:
        Game: Game.
    """

    try:
        return await game_dao.create_by_user(
            game.dict(exclude_none=True),
            str(current_superuser.id),
        )
    except ObjectNotFoundException as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Some object(s) not found: {str(error)}",
        )
    except IntegrityError as error:
        if "Key (created_by_company_id)" in str(error):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Company not found",
            )
        raise error


@router.patch("/{game_id}", response_model=GameSchema)
async def update(
    game_id: UUID,
    game: schema.GameUpdate,
    game_dao: GameDAO = Depends(),
    current_superuser: models.User = Depends(get_current_superuser),
) -> Game:
    """Update game.

    Args:
        game_id (UUID): Game ID.
        game (schema.GameUpdate): Game data.
        game_dao (GameDAO): Game DAO.
        current_superuser (models.User): Current superuser.

    Returns:
        Game: Game.
    """

    try:
        return await game_dao.update(
            game.dict(exclude_unset=True),
            str(game_id),
        )
    except ObjectNotFoundException as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Some object(s) not found: {str(error)}",
        )


@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
async def delete_multi(
    game_ids: list[UUID],
    game_dao: GameDAO = Depends(),
    current_superuser: models.User = Depends(get_current_superuser),
) -> None:
    """Delete games.

    Args:
        game_ids (list[UUID]): Game IDs.
        game_dao (GameDAO): Game DAO.
        current_superuser (models.User): Current superuser.

    Returns:
        None: None.
    """

    try:
        await game_dao.delete_multi(
            [str(game_id) for game_id in game_ids],
        )
    except ObjectNotFoundException as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Game(s) not found: {str(error)}",
        )


@router.delete("/{game_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete(
    game_id: UUID,
    game_dao: GameDAO = Depends(),
    current_superuser: models.User = Depends(get_current_superuser),
) -> None:
    """Delete game.

    Args:
        game_id (UUID): Game ID.
        game_dao (GameDAO): Game DAO.
        current_superuser (models.User): Current superuser.

    Returns:
        None: None.
    """

    try:
        await game_dao.delete(str(game_id))
    except ObjectNotFoundException as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Game not found",
        )