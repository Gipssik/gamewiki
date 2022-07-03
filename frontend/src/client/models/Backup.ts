/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserInDB } from './UserInDB';

export type Backup = {
    id: string;
    title: string;
    url: string;
    created_at: string;
    created_by_user?: UserInDB;
};

