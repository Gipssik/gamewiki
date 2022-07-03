/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Genre } from '../models/Genre';
import type { GenreCreate } from '../models/GenreCreate';
import type { GenreUpdate } from '../models/GenreUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class GenresService {

    /**
     * Get Multi
     * Get list of genres.
     *
     * Args:
     * response (Response): Response.
     * queries (GenreQueries, optional): Query parameters.
     * sort (list[str], optional): Order parameters.
     * genre_dao (GenreDAO, optional): Genre DAO.
     *
     * Returns:
     * list[Genre]: List of genres.
     * @param skip
     * @param limit
     * @param title
     * @param createdByUser
     * @param sort
     * @returns Genre Successful Response
     * @throws ApiError
     */
    public static getMulti(
        skip?: number,
        limit: number = 100,
        title?: string,
        createdByUser?: string,
        sort?: string,
    ): CancelablePromise<Array<Genre>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/genres/',
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
     * Create genre.
     *
     * Args:
     * genre (GenreCreate): Genre data.
     * genre_dao (GenreDAO, optional): Genre DAO.
     * current_superuser (models.User, optional): Current superuser.
     *
     * Returns:
     * Genre: Genre.
     * @param requestBody
     * @returns Genre Successful Response
     * @throws ApiError
     */
    public static create(
        requestBody: GenreCreate,
    ): CancelablePromise<Genre> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/genres/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Multi
     * Delete multiple genres.
     *
     * Args:
     * genre_ids (list[UUID]): Genre ids.
     * genre_dao (GenreDAO, optional): Genre DAO.
     * current_superuser (models.User, optional): Current superuser.
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
            url: '/api/genres/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get
     * Get genre by id.
     *
     * Args:
     * genre_id (UUID): Genre id.
     * genre_dao (GenreDAO, optional): Genre DAO.
     *
     * Returns:
     * Genre: Genre.
     * @param genreId
     * @returns Genre Successful Response
     * @throws ApiError
     */
    public static get(
        genreId: string,
    ): CancelablePromise<Genre> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/genres/{genre_id}',
            path: {
                'genre_id': genreId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete
     * Delete genre.
     *
     * Args:
     * genre_id (UUID): Genre id.
     * genre_dao (GenreDAO, optional): Genre DAO.
     * current_superuser (models.User, optional): Current superuser.
     *
     * Returns:
     * None: None.
     * @param genreId
     * @returns void
     * @throws ApiError
     */
    public static delete(
        genreId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/genres/{genre_id}',
            path: {
                'genre_id': genreId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update
     * Update genre.
     *
     * Args:
     * genre_id (UUID): Genre id.
     * genre (GenreUpdate): Genre data.
     * genre_dao (GenreDAO, optional): Genre DAO.
     * current_superuser (models.User, optional): Current superuser.
     *
     * Returns:
     * Genre: Genre.
     * @param genreId
     * @param requestBody
     * @returns Genre Successful Response
     * @throws ApiError
     */
    public static update(
        genreId: string,
        requestBody: GenreUpdate,
    ): CancelablePromise<Genre> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/genres/{genre_id}',
            path: {
                'genre_id': genreId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
