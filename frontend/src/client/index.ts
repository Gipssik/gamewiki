/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
export { ApiError } from "./core/ApiError";
export { CancelablePromise, CancelError } from "./core/CancelablePromise";
export { OpenAPI } from "./core/OpenAPI";
export type { OpenAPIConfig } from "./core/OpenAPI";

export type { Backup } from "./models/Backup";
export type { BackupInDB } from "./models/BackupInDB";
export type { Body_auth_login_access_token } from "./models/Body_auth_login_access_token";
export type { Company } from "./models/Company";
export type { CompanyCreate } from "./models/CompanyCreate";
export type { CompanyInDB } from "./models/CompanyInDB";
export type { CompanyUpdate } from "./models/CompanyUpdate";
export type { Game } from "./models/Game";
export type { GameCreate } from "./models/GameCreate";
export type { GameInDB } from "./models/GameInDB";
export type { GameUpdate } from "./models/GameUpdate";
export type { Genre } from "./models/Genre";
export type { GenreCreate } from "./models/GenreCreate";
export type { GenreInDB } from "./models/GenreInDB";
export type { GenreUpdate } from "./models/GenreUpdate";
export type { HTTPValidationError } from "./models/HTTPValidationError";
export type { Platform } from "./models/Platform";
export type { PlatformCreate } from "./models/PlatformCreate";
export type { PlatformInDB } from "./models/PlatformInDB";
export type { PlatformUpdate } from "./models/PlatformUpdate";
export type { Sale } from "./models/Sale";
export type { SaleCreate } from "./models/SaleCreate";
export type { SaleUpdate } from "./models/SaleUpdate";
export type { Token } from "./models/Token";
export type { User } from "./models/User";
export type { UserCreate } from "./models/UserCreate";
export type { UserInDB } from "./models/UserInDB";
export type { UserUpdate } from "./models/UserUpdate";
export type { ValidationError } from "./models/ValidationError";

export { AuthService } from "./services/AuthService";
export { BackupsService } from "./services/BackupsService";
export { CompaniesService } from "./services/CompaniesService";
export { GamesService } from "./services/GamesService";
export { GenresService } from "./services/GenresService";
export { HealthService } from "./services/HealthService";
export { PlatformsService } from "./services/PlatformsService";
export { SalesService } from "./services/SalesService";
export { UsersService } from "./services/UsersService";
