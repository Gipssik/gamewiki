/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { BackupInDB } from './BackupInDB';
import type { CompanyInDB } from './CompanyInDB';
import type { GameInDB } from './GameInDB';
import type { GenreInDB } from './GenreInDB';
import type { PlatformInDB } from './PlatformInDB';
import type { Sale } from './Sale';

export type User = {
    id: string;
    username: string;
    email: string;
    is_superuser: boolean;
    is_primary: boolean;
    created_at: string;
    created_companies?: Array<CompanyInDB>;
    created_platforms?: Array<PlatformInDB>;
    created_games?: Array<GameInDB>;
    created_genres?: Array<GenreInDB>;
    created_sales?: Array<Sale>;
    created_backups?: Array<BackupInDB>;
};
