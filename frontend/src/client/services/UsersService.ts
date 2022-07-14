/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { User } from "../models/User";
import type { UserCreate } from "../models/UserCreate";
import type { UserUpdate } from "../models/UserUpdate";

import type { CancelablePromise } from "../core/CancelablePromise";
import { OpenAPI } from "../core/OpenAPI";
import { request as __request, requestWithHeaders } from "../core/request";

export class UsersService {
  /**
   * Get Multi
   * Get list of users.
   *
   * Args:
   * response (Response): Response.
   * queries (UserQueries, optional): User queries.
   * sort (list[str], optional): Order parameters.
   * user_dao (UserDAO, optional): User DAO.
   *
   * Returns:
   * list[User]: List of users.
   * @param skip
   * @param limit
   * @param username
   * @param email
   * @param isSuperuser
   * @param isPrimary
   * @param sort
   * @returns User Successful Response
   * @throws ApiError
   */
  public static getMulti(
    skip?: number,
    limit: number = 100,
    username?: string,
    email?: string,
    isSuperuser?: boolean,
    isPrimary?: boolean,
    sort?: string
  ): CancelablePromise<Array<User>> {
    return __request<User[]>(OpenAPI, {
      method: "GET",
      url: "/api/users/",
      query: {
        skip: skip,
        limit: limit,
        username: username,
        email: email,
        is_superuser: isSuperuser,
        is_primary: isPrimary,
        sort: sort,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  public static getMultiWithHeaders(
    skip?: number,
    limit: number = 100,
    username?: string,
    email?: string,
    isSuperuser?: boolean,
    isPrimary?: boolean,
    sort?: string
  ) {
    return requestWithHeaders<User[]>(OpenAPI, {
      method: "GET",
      url: "/api/users/",
      query: {
        skip: skip,
        limit: limit,
        username: username,
        email: email,
        is_superuser: isSuperuser,
        is_primary: isPrimary,
        sort: sort,
      },
      errors: {
        422: `Validation Error`,
      },
      responseHeader: "x-total-count",
    });
  }

  /**
   * Create
   * Create new user.
   *
   * Args:
   * user (UserCreate): User data.
   * user_dao (UserDAO, optional): User DAO.
   *
   * Raises:
   * HTTPException: User already exists.
   *
   * Returns:
   * User: User.
   * @param requestBody
   * @returns User Successful Response
   * @throws ApiError
   */
  public static create(requestBody: UserCreate): CancelablePromise<User> {
    return __request(OpenAPI, {
      method: "POST",
      url: "/api/users/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete Multi
   * Delete users.
   *
   * Args:
   * user_ids (list[UUID]): User IDs.
   * user_dao (UserDAO, optional): User DAO.
   * current_user (User, optional): Current user.
   *
   * Raises:
   * HTTPException: You are not allowed to delete users.
   *
   * Returns:
   * None: None.
   * @param requestBody
   * @returns void
   * @throws ApiError
   */
  public static deleteMulti(requestBody: Array<string>): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/users/",
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Get Me
   * Get current user.
   *
   * Args:
   * current_user (User, optional): Current user.
   *
   * Returns:
   * User: Current user.
   * @returns User Successful Response
   * @throws ApiError
   */
  public static getMe(): CancelablePromise<User> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/users/me",
    });
  }

  /**
   * Get
   * Get user by id.
   *
   * Args:
   * user_id (UUID): User ID.
   * user_dao (UserDAO, optional): User DAO.
   *
   * Returns:
   * User: User.
   * @param userId
   * @returns User Successful Response
   * @throws ApiError
   */
  public static get(userId: string): CancelablePromise<User> {
    return __request(OpenAPI, {
      method: "GET",
      url: "/api/users/{user_id}",
      path: {
        user_id: userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Delete
   * Delete user.
   *
   * Args:
   * user_id (UUID): User ID.
   * user_dao (UserDAO, optional): User DAO.
   * current_user (User, optional): Current user.
   *
   * Raises:
   * HTTPException: You are not allowed to delete this user.
   * HTTPException: User not found.
   * @param userId
   * @returns void
   * @throws ApiError
   */
  public static delete(userId: string): CancelablePromise<void> {
    return __request(OpenAPI, {
      method: "DELETE",
      url: "/api/users/{user_id}",
      path: {
        user_id: userId,
      },
      errors: {
        422: `Validation Error`,
      },
    });
  }

  /**
   * Update
   * Update user.
   *
   * Args:
   * user_id (UUID): User ID.
   * user (UserSchemaUpdate): User data.
   * user_dao (UserDAO, optional): User DAO.
   * current_user (User, optional): Current user.
   *
   * Raises:
   * HTTPException: You are not allowed to update this user.
   * HTTPException: User not found.
   * HTTPException: Username or email already exists.
   *
   * Returns:
   * User: User.
   * @param userId
   * @param requestBody
   * @returns User Successful Response
   * @throws ApiError
   */
  public static update(userId: string, requestBody: UserUpdate): CancelablePromise<User> {
    return __request(OpenAPI, {
      method: "PATCH",
      url: "/api/users/{user_id}",
      path: {
        user_id: userId,
      },
      body: requestBody,
      mediaType: "application/json",
      errors: {
        422: `Validation Error`,
      },
    });
  }
}
