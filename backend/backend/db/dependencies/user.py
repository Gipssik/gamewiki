from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import jwt
from jose.exceptions import JWTError
from pydantic import ValidationError

from backend.db.dao import UserDAO
from backend.db.models.user import User
from backend.settings import settings

reusable_oauth2 = OAuth2PasswordBearer(tokenUrl=f"/api/auth/access-token")


async def get_current_user(
    user_dao: UserDAO = Depends(),
    token: str = Depends(reusable_oauth2),
) -> User:
    """Get current user.

    Args:
        user_dao (UserDAO): User DAO.
        token (str): JWT token.

    Raises:
        HTTPException: Incorrect token.
        HTTPException: User not found.

    Returns:
        User: Current user.
    """

    try:
        payload = jwt.decode(
            token,
            settings.secret_key,
            algorithms=[settings.encryption_algorithm],
        )
        token_data = payload.copy()
    except (JWTError, ValidationError):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Could not validate credentials",
        )

    user = await user_dao.get(token_data["sub"])
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found",
        )
    return user


async def get_current_superuser(current_user: User = Depends(get_current_user)) -> User:
    """Get current superuser.

    Args:
        current_user (User): Current user.

    Raises:
        HTTPException: User is not superuser.

    Returns:
        User: Current superuser.
    """

    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Not allowed",
        )
    return current_user
