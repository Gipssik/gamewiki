/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GameInDB } from './GameInDB';
import type { UserInDB } from './UserInDB';

export type Genre = {
    id: string;
    title: string;
    created_by_user?: UserInDB;
    games?: Array<GameInDB>;
};

