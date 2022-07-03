/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { CompanyInDB } from './CompanyInDB';
import type { GenreInDB } from './GenreInDB';
import type { PlatformInDB } from './PlatformInDB';
import type { Sale } from './Sale';
import type { UserInDB } from './UserInDB';

export type Game = {
    id: string;
    title: string;
    released_at: string;
    created_at: string;
    created_by_company: CompanyInDB;
    created_by_user?: UserInDB;
    genres?: Array<GenreInDB>;
    platforms?: Array<PlatformInDB>;
    sales?: Array<Sale>;
};

