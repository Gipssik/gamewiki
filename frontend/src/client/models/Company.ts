/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GameInDB } from './GameInDB';
import type { UserInDB } from './UserInDB';

export type Company = {
    id: string;
    title: string;
    founded_at: string;
    created_at: string;
    created_by_user?: UserInDB;
    games?: Array<GameInDB>;
};

