/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Platform } from '../models/Platform';
import type { PlatformCreate } from '../models/PlatformCreate';
import type { PlatformUpdate } from '../models/PlatformUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class PlatformsService {

    /**
     * Get Multi
     * Get list of platforms.
     *
     * Args:
     * response (Response): Response.
     * queries (schema.PlatformQueries): Query parameters.
     * sort (list[str], optional): Order parameters.
     * platform_dao (PlatformDAO): Platform DAO.
     *
     * Returns:
     * list[Platform]: List of platforms.
     * @param skip
     * @param limit
     * @param title
     * @param createdByUser
     * @param sort
     * @returns Platform Successful Response
     * @throws ApiError
     */
    public static getMulti(
        skip?: number,
        limit: number = 100,
        title?: string,
        createdByUser?: string,
        sort?: string,
    ): CancelablePromise<Array<Platform>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/platforms/',
            query: {
                'skip': skip,
                'limit': limit,
                'title': title,
                'created_by_user': createdByUser,
                'sort': sort,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Create
     * Create platform.
     *
     * Args:
     * platform (schema.PlatformCreate): Platform data.
     * platform_dao (PlatformDAO): Platform DAO.
     * current_superuser (models.User): Current superuser.
     *
     * Returns:
     * Platform: Platform.
     * @param requestBody
     * @returns Platform Successful Response
     * @throws ApiError
     */
    public static create(
        requestBody: PlatformCreate,
    ): CancelablePromise<Platform> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/platforms/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Multi
     * Delete platforms.
     *
     * Args:
     * platform_ids (list[UUID]): Platform ids.
     * platform_dao (CompanyDAO, optional): Platform DAO.
     * current_superuser (User, optional): Current superuser.
     *
     * Returns:
     * None: None.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static deleteMulti(
        requestBody: Array<string>,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/platforms/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get
     * Get platform by ID.
     *
     * Args:
     * platform_id (UUID): Platform ID.
     * platform_dao (PlatformDAO): Platform DAO.
     *
     * Returns:
     * Platform: Platform.
     * @param platformId
     * @returns Platform Successful Response
     * @throws ApiError
     */
    public static get(
        platformId: string,
    ): CancelablePromise<Platform> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/platforms/{platform_id}',
            path: {
                'platform_id': platformId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete
     * Delete platform.
     *
     * Args:
     * platform_id (UUID): Platform id.
     * platform_dao (CompanyDAO, optional): Platform DAO.
     * current_superuser (User, optional): Current superuser.
     *
     * Returns:
     * None: None.
     * @param platformId
     * @returns void
     * @throws ApiError
     */
    public static delete(
        platformId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/platforms/{platform_id}',
            path: {
                'platform_id': platformId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update
     * Update platform.
     *
     * Args:
     * platform_id (UUID): Platform id.
     * platform (CompanyUpdate): Platform data.
     * platform_dao (CompanyDAO, optional): Platform DAO.
     * current_superuser (User, optional): Current superuser.
     *
     * Returns:
     * Platform: Platform.
     * @param platformId
     * @param requestBody
     * @returns Platform Successful Response
     * @throws ApiError
     */
    public static update(
        platformId: string,
        requestBody: PlatformUpdate,
    ): CancelablePromise<Platform> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/platforms/{platform_id}',
            path: {
                'platform_id': platformId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
