class UserNotFoundException(Exception):
    """Raised when a user is not found in the database"""


class InvalidPasswordException(Exception):
    """Raised when an invalid password is provided"""


class UserIsPrimaryException(Exception):
    """Raised when a user is trying to delete a primary user"""
