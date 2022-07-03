/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GameInDB } from './GameInDB';
import type { Sale } from './Sale';
import type { UserInDB } from './UserInDB';

export type Platform = {
    id: string;
    title: string;
    created_by_user?: UserInDB;
    games?: Array<GameInDB>;
    sales?: Array<Sale>;
};

