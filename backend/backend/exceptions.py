class ObjectNotFoundException(Exception):
    """Raised when a requested object is not found in the database."""


class UserNotFoundException(Exception):
    """Raised when a user is not found in the database"""


class InvalidPasswordException(Exception):
    """Raised when an invalid password is provided"""
