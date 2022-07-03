/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Backup } from '../models/Backup';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class BackupsService {

    /**
     * Get Multi
     * Get list of backups.
     *
     * Args:
     * response (Response): Response.
     * queries (BackupQueries, optional): Query parameters.
     * sort (list[str], optional): Order parameters.
     * backup_dao (BackupDAO, optional): Backup DAO.
     * current_superuser (User, optional): Current superuser.
     *
     * Returns:
     * list[Backup]: List of backups.
     * @param skip
     * @param limit
     * @param sort
     * @returns Backup Successful Response
     * @throws ApiError
     */
    public static getMulti(
        skip?: number,
        limit: number = 100,
        sort?: string,
    ): CancelablePromise<Array<Backup>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/backups/',
            query: {
                'skip': skip,
                'limit': limit,
                'sort': sort,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Create
     * Creates backup of database and uploads it to Cloudinary.
     *
     * Args:
     * background_tasks (BackgroundTasks): Background tasks.
     * backup_dao (BackupDAO, optional): Backup DAO.
     * current_superuser (User, optional): Current superuser.
     *
     * Returns:
     * Backup: Backup.
     * @returns any Successful Response
     * @throws ApiError
     */
    public static create(): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/backups/',
        });
    }

    /**
     * Delete Multi
     * Delete backups.
     *
     * Args:
     * background_tasks (BackgroundTasks): Background tasks.
     * backup_ids (list[UUID]): List of backup ids.
     * backup_dao (BackupDAO, optional): Backup DAO.
     * current_superuser (User, optional): Current superuser.
     * @param requestBody
     * @returns void
     * @throws ApiError
     */
    public static deleteMulti(
        requestBody: Array<string>,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/backups/',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Restore
     * Restores database from backup.
     *
     * Args:
     * backup_id (UUID): Backup id.
     * background_tasks (BackgroundTasks): Background tasks.
     * backup_dao (BackupDAO, optional): Backup DAO.
     * current_superuser (User, optional): Current superuser.
     *
     * Returns:
     * Backup: Backup.
     * @param backupId
     * @returns any Successful Response
     * @throws ApiError
     */
    public static restore(
        backupId: string,
    ): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/backups/restore/{backup_id}',
            path: {
                'backup_id': backupId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

    /**
     * Delete
     * Delete backups.
     *
     * Args:
     * background_tasks (BackgroundTasks): Background tasks.
     * backup_id (UUID): Backup id.
     * backup_dao (BackupDAO, optional): Backup DAO.
     * current_superuser (User, optional): Current superuser.
     * @param backupId
     * @returns void
     * @throws ApiError
     */
    public static delete(
        backupId: string,
    ): CancelablePromise<void> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/backups/{backup_id}',
            path: {
                'backup_id': backupId,
            },
            errors: {
                422: `Validation Error`,
            },
        });
    }

}
