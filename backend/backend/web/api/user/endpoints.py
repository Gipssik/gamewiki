from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, Response, status
from tortoise.exceptions import IntegrityError

from backend.custom_types import UserOrderColumns
from backend.db.dao import UserDAO
from backend.db.dependencies.order_validation import OrderValidation
from backend.db.dependencies.user import get_current_superuser, get_current_user
from backend.db.models.user import User
from backend.exceptions import ObjectNotFoundException
from backend.web.api.user import schema
from backend.web.api.user.schema.user import User as UserSchema

router = APIRouter()


@router.get("/", response_model=list[UserSchema])
async def get_multi(
    response: Response,
    queries: schema.UserQueries = Depends(),
    sort: list[str] = Depends(OrderValidation(UserOrderColumns)),
    user_dao: UserDAO = Depends(),
) -> list[User]:
    """Get list of users.

    Args:
        response (Response): Response.
        queries (UserQueries, optional): User queries.
        sort (list[str], optional): Order parameters.
        user_dao (UserDAO, optional): User DAO.

    Returns:
        list[User]: List of users.
    """

    filters_dict = {
        "username": ("username__icontains", queries.username),
        "email": ("email__icontains", queries.email),
        "is_superuser": ("is_superuser", queries.is_superuser),
        "is_primary": ("is_primary", queries.is_primary),
    }
    filters = queries.dict(exclude_none=True, include={*filters_dict.keys()})
    filters_list = {
        filters_dict[key][0]: filters_dict[key][1] for key in filters.keys()
    }

    amount = await user_dao.get_count(expr=filters_list)
    users = await user_dao.get_multi(
        expr=filters_list,
        offset=queries.skip,
        limit=queries.limit,
        sort=sort,
    )

    response.headers["X-Total-Count"] = str(amount)
    return users


@router.get("/creation-statistics", response_model=list[schema.UserCreationStatistics])
async def get_creation_statistics(
    days: int,
    current_superuser: User = Depends(get_current_superuser),
    user_dao: UserDAO = Depends(),
) -> list[dict]:
    """Statistics for user creation in last N days.

    Args:
        days (int): Amount of days.
        current_superuser (User, optional): Current superuser.
        user_dao (UserDAO, optional): User DAO.

    Returns:
        dict: User creation statistics.
    """

    return await user_dao.get_user_creation_statistics(days)


@router.get("/role-statistics", response_model=list[schema.UserRoleStatistics])
async def get_role_statistics(
    current_superuser: User = Depends(get_current_superuser),
    user_dao: UserDAO = Depends(),
) -> list[dict]:
    """Statistics for user roles.

    Args:
        current_superuser (User, optional): Current superuser.
        user_dao (UserDAO, optional): User DAO.

    Returns:
        dict: User roles statistics.
    """

    return await user_dao.get_users_role_statistics()


@router.get("/me", response_model=UserSchema)
async def get_me(current_user: User = Depends(get_current_user)) -> User:
    """Get current user.

    Args:
        current_user (User, optional): Current user.

    Returns:
        User: Current user.
    """

    return current_user


@router.get("/{user_id}", response_model=UserSchema)
async def get(user_id: UUID, user_dao: UserDAO = Depends()) -> User:
    """Get user by id.

    Args:
        user_id (UUID): User ID.
        user_dao (UserDAO, optional): User DAO.

    Returns:
        User: User.
    """

    user = await user_dao.get(str(user_id))
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user


@router.post("/", status_code=status.HTTP_201_CREATED, response_model=UserSchema)
async def create(user: schema.UserCreate, user_dao: UserDAO = Depends()) -> User:
    """Create new user.

    Args:
        user (UserCreate): User data.
        user_dao (UserDAO, optional): User DAO.

    Raises:
        HTTPException: User already exists.

    Returns:
        User: User.
    """

    try:
        return await user_dao.create(user.dict())
    except IntegrityError as error:
        if "already exists" in str(error):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=str(error).split(":  ")[1],
            )
        raise error


@router.patch("/{user_id}", response_model=UserSchema)
async def update(
    user_id: UUID,
    user: schema.UserUpdate,
    user_dao: UserDAO = Depends(),
    current_user: User = Depends(get_current_user),
) -> User:
    """Update user.

    Args:
        user_id (UUID): User ID.
        user (UserSchemaUpdate): User data.
        user_dao (UserDAO, optional): User DAO.
        current_user (User, optional): Current user.

    Raises:
        HTTPException: You are not allowed to update this user.
        HTTPException: User not found.
        HTTPException: Username or email already exists.

    Returns:
        User: User.
    """

    if not current_user.is_superuser and user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to update this user",
        )

    try:
        return await user_dao.update(user.dict(exclude_unset=True), str(user_id))
    except ObjectNotFoundException as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        ) from error
    except IntegrityError as error:
        if "already exists" in str(error):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=str(error).split(":  ")[1],
            )
        raise error


@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
async def delete_multi(
    user_ids: list[UUID],
    user_dao: UserDAO = Depends(),
    current_user: User = Depends(get_current_superuser),
) -> None:
    """Delete users.

    Args:
        user_ids (list[UUID]): User IDs.
        user_dao (UserDAO, optional): User DAO.
        current_user (User, optional): Current user.

    Raises:
        HTTPException: You are not allowed to delete users.

    Returns:
        None: None.
    """

    await user_dao.delete_multi([str(user_id) for user_id in user_ids])


@router.delete("/{user_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete(
    user_id: UUID,
    user_dao: UserDAO = Depends(),
    current_user: User = Depends(get_current_user),
) -> None:
    """Delete user.

    Args:
        user_id (UUID): User ID.
        user_dao (UserDAO, optional): User DAO.
        current_user (User, optional): Current user.

    Raises:
        HTTPException: You are not allowed to delete this user.
        HTTPException: User not found.
    """

    if not current_user.is_superuser and user_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to delete this user",
        )

    try:
        await user_dao.delete(str(user_id))
    except ObjectNotFoundException as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        ) from error
