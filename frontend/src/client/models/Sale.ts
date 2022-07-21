/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { GameInDB } from './GameInDB';
import type { PlatformInDB } from './PlatformInDB';
import type { UserInDB } from './UserInDB';

export type Sale = {
    id: string;
    amount: number;
    game: GameInDB;
    platform: PlatformInDB;
    created_by_user?: UserInDB;
};
