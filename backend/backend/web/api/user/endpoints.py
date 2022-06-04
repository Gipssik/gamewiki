from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.exc import IntegrityError

from backend.db.dao.user import UserDAO
from backend.db.dependencies.user import get_current_superuser, get_current_user
from backend.db.models.user import User
from backend.exceptions import UserIsPrimaryException, UserNotFoundException
from backend.web.api.user import schema
from backend.web.api.user.schema import UserQueries
from backend.web.api.user.schema.user import User as UserSchema

router = APIRouter()


@router.get("/", response_model=list[UserSchema])
async def get_users(
    queries: UserQueries = Depends(),
    user_dao: UserDAO = Depends(),
) -> list[User]:
    """Get list of users.

    Args:
        queries (UserQueries, optional): User queries.
        user_dao (UserDAO, optional): User DAO.

    Returns:
        list[User]: List of users.
    """

    expression_dict = {
        "username": User.username.ilike(f"%{queries.username}%"),
        "email": User.email.ilike(f"%{queries.email}%"),
        "is_superuser": User.is_superuser == queries.is_superuser,
        "is_primary": User.is_primary == queries.is_primary,
    }
    qs = queries.dict(exclude_none=True, exclude={"skip", "limit", "created_at_order"})
    queries_list = [expression_dict[key] for key in qs.keys()]

    return await user_dao.get_multi(
        expr=queries_list,
        offset=queries.skip,
        limit=queries.limit,
        created_at_order=queries.created_at_order,
    )


@router.get("/me", response_model=UserSchema)
async def get_user_me(current_user: User = Depends(get_current_user)) -> User:
    """Get current user.

    Args:
        current_user (User, optional): Current user.

    Returns:
        User: Current user.
    """

    return current_user


@router.get("/{user_id}", response_model=UserSchema)
async def get_user(user_id: UUID, user_dao: UserDAO = Depends()) -> User:
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
async def create_user(user: schema.UserCreate, user_dao: UserDAO = Depends()) -> User:
    """Create new user.

    Args:
        user (UserSchemaCreate): User data.
        user_dao (UserDAO, optional): User DAO.

    Raises:
        HTTPException: User already exists.

    Returns:
        User: User.
    """

    try:
        return await user_dao.create(user.dict())
    except IntegrityError as error:
        if "duplicate key" in str(error.__cause__):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Username or email already exists",
            )
        raise error


@router.patch("/{user_id}", response_model=UserSchema)
async def update_user(
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
    except UserNotFoundException as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        ) from error
    except IntegrityError as error:
        if "duplicate key" in str(error.__cause__):
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Username or email already exists",
            )
        raise error


@router.delete("/", status_code=status.HTTP_204_NO_CONTENT)
async def delete_users(
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
async def delete_user(
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
    except UserNotFoundException as error:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        ) from error
    except UserIsPrimaryException as error:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You are not allowed to delete this user",
        ) from error
