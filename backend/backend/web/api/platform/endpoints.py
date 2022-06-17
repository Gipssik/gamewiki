from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy.exc import IntegrityError, NoResultFound

from backend.custom_types import OrderColumn, PlatformOrderColumns
from backend.db import models
from backend.db.dao.platform import PlatformDAO
from backend.db.dependencies.order_validation import OrderValidation
from backend.db.dependencies.user import get_current_superuser
from backend.db.models.platform import Platform
from backend.exceptions import ObjectNotFoundException
from backend.web.api.platform import schema
from backend.web.api.platform.schema.platform import Platform as PlatformSchema

router = APIRouter()


@router.get("/", response_model=list[PlatformSchema])
async def get_multi(
    response: Response,
    queries: schema.PlatformQueries = Depends(),
    sort: list[OrderColumn] = Depends(OrderValidation(PlatformOrderColumns)),
    platform_dao: PlatformDAO = Depends(),
) -> list[Platform]:
    """Get list of platforms.

    Args:
        response (Response): Response.
        queries (schema.PlatformQueries): Query parameters.
        sort (list[OrderColumn], optional): Order parameters.
        platform_dao (PlatformDAO): Platform DAO.

    Returns:
        list[Platform]: List of platforms.
    """

    filters_dict = {
        "title": Platform.title.ilike(f"%{queries.title}%"),
        "created_by_user": models.User.username.ilike(f"%{queries.created_by_user}%"),
    }
    filters = queries.dict(exclude_none=True, include={*filters_dict.keys()})
    filters_list = [filters_dict[key] for key in filters.keys()]

    amount = await platform_dao.get_count(expr=filters_list)
    platforms = await platform_dao.get_ordered_multi(
        expr=filters_list,
        offset=queries.skip,
        limit=queries.limit,
        sort=sort,
    )

    response.headers["X-Total-Count"] = str(amount)
    return platforms


@router.get("/{platform_id}", response_model=PlatformSchema)
async def get(platform_id: UUID, platform_dao: PlatformDAO = Depends()) -> Platform:
    """Get platform by ID.

    Args:
        platform_id (UUID): Platform ID.
        platform_dao (PlatformDAO): Platform DAO.

    Returns:
        Platform: Platform.
    """

    platform = await platform_dao.get(str(platform_id))
    if not platform:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Platform not found",
        )
    return platform


@router.post("/", response_model=PlatformSchema)
async def create(
    platform: schema.PlatformCreate,
    platform_dao: PlatformDAO = Depends(),
    current_superuser: models.User = Depends(get_current_superuser),
) -> Platform:
    """Create platform.

    Args:
        platform (schema.PlatformCreate): Platform data.
        platform_dao (PlatformDAO): Platform DAO.
        current_superuser (models.User): Current superuser.

    Returns:
        Platform: Platform.
    """

    try:
        return await platform_dao.create_by_user(
            platform.dict(),
            str(current_superuser.id),
        )
    except IntegrityError as error:
        if "duplicate key" in str(error.__cause__):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Platform already exists",
            )
        raise error


@router.patch("/{platform_id}", response_model=PlatformSchema)
async def update(
    platform_id: UUID,
    platform: schema.PlatformUpdate,
    platform_dao: PlatformDAO = Depends(),
    current_superuser: models.User = Depends(get_current_superuser),
) -> Platform:
    """Update platform.

    Args:
        platform_id (UUID): Platform id.
        platform (CompanyUpdate): Platform data.
        platform_dao (CompanyDAO, optional): Platform DAO.
        current_superuser (User, optional): Current superuser.

    Returns:
        Platform: Platform.
    """

    try:
        return await platform_dao.update(
            platform.dict(exclude_unset=True),
            str(platform_id),
        )
    except ObjectNotFoundException as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Platform not found",
        )
    except IntegrityError as error:
        if "duplicate key" in str(error.__cause__):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Platform already exists",
            )
        raise error


@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
async def delete_multi(
    platform_ids: list[UUID],
    platform_dao: PlatformDAO = Depends(),
    current_superuser: models.User = Depends(get_current_superuser),
) -> None:
    """Delete platforms.

    Args:
        platform_ids (list[UUID]): Platform ids.
        platform_dao (CompanyDAO, optional): Platform DAO.
        current_superuser (User, optional): Current superuser.

    Returns:
        None: None.
    """

    try:
        await platform_dao.delete_multi(
            [str(platform_id) for platform_id in platform_ids],
        )
    except ObjectNotFoundException as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Platform(s) not found: {str(error)}",
        )


@router.delete("/{platform_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete(
    platform_id: UUID,
    platform_dao: PlatformDAO = Depends(),
    current_superuser: models.User = Depends(get_current_superuser),
) -> None:
    """Delete platform.

    Args:
        platform_id (UUID): Platform id.
        platform_dao (CompanyDAO, optional): Platform DAO.
        current_superuser (User, optional): Current superuser.

    Returns:
        None: None.
    """

    try:
        await platform_dao.delete(str(platform_id))
    except NoResultFound as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Platform not found",
        ) from error
