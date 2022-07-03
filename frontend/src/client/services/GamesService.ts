/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Game } from '../models/Game';
import type { GameCreate } from '../models/GameCreate';
import type { GameUpdate } from '../models/GameUpdate';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class GamesService {

    /**
     * Get Multi
     * Get list of games.
     *
     * Args:
     * response (Response): Response.
     * queries (schema.GameQueries): Query parameters.
     * sort (list[str], optional): Order parameters.
     * game_dao (GameDAO): Game DAO.
     *
     * Returns:
     * list[Game]: List of games.
     * @param skip
     * @param limit
     * @param title
     * @param createdByUser
     * @param createdByCompany
     * @param sort
     * @returns Game Successful Response
     * @throws ApiError
     */
    public static getMulti(
        skip?: number,
        limit: number = 100,
        title?: string,
        createdByUser?: string,
        createdByCompany?: string,
        sort?: string,
    ): CancelablePromise<Array<Game>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/games/',
            query: {
                'skip': skip,
                'limit': limit,
                'title': title,
                'created_by_user': createdByUser,
                'created_by_company': createdByCompany,
                'sort': sort,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Create
     * Create game.
     *
     * Args:
     * game (schema.GameCreate): Game data.
     * game_dao (GameDAO): Game DAO.
     * current_superuser (models.User): Current superuser.
     *
     * Returns:
     * Game: Game.
     * @param requestBody
     * @returns Game Successful Response
     * @throws ApiError
     */
    public static create(
        requestBody: GameCreate,
    ): CancelablePromise<Game> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/games/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete Multi
     * Delete games.
     *
     * Args:
     * game_ids (list[UUID]): Game IDs.
     * game_dao (GameDAO): Game DAO.
     * current_superuser (models.User): Current superuser.
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
            url: '/api/games/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Get
     * Get game by ID.
     *
     * Args:
     * game_id (UUID): Game ID.
     * game_dao (GameDAO): Game DAO.
     *
     * Returns:
     * Game: Game.
     * @param gameId
     * @returns Game Successful Response
     * @throws ApiError
     */
    public static get(
        gameId: string,
    ): CancelablePromise<Game> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/games/{game_id}',
            path: {
                'game_id': gameId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete
     * Delete game.
     *
     * Args:
     * game_id (UUID): Game ID.
     * game_dao (GameDAO): Game DAO.
     * current_superuser (models.User): Current superuser.
     *
     * Returns:
     * None: None.
     * @param gameId
     * @returns void
     * @throws ApiError
     */
    public static delete(
        gameId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/games/{game_id}',
            path: {
                'game_id': gameId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Update
     * Update game.
     *
     * Args:
     * game_id (UUID): Game ID.
     * game (schema.GameUpdate): Game data.
     * game_dao (GameDAO): Game DAO.
     * current_superuser (models.User): Current superuser.
     *
     * Returns:
     * Game: Game.
     * @param gameId
     * @param requestBody
     * @returns Game Successful Response
     * @throws ApiError
     */
    public static update(
        gameId: string,
        requestBody: GameUpdate,
    ): CancelablePromise<Game> {
        return __request(OpenAPI, {
            method: 'PATCH',
            url: '/api/games/{game_id}',
            path: {
                'game_id': gameId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
