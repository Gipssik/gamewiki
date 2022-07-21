import React from "react";
import {
  AccountPage,
  BackupsPage,
  CompaniesPage,
  CompaniesStatistics,
  CompanyPage,
  CreateCompanyPage,
  CreateGamePage,
  CreateGenrePage,
  CreatePlatformPage,
  CreateSalePage,
  EditCompanyPage,
  EditGamePage,
  EditGenrePage,
  EditPlatformPage,
  EditSalePage,
  EditUserPage,
  GamePage,
  GamesPage,
  GamesStatistics,
  GenrePage,
  GenresPage,
  PageNotFound,
  PlatformPage,
  PlatformsPage,
  SalesPage,
  SalesStatistics,
  SignInPage,
  SignUpPage,
  UsersPage,
  UsersStatistics,
} from "../pages";

type Route = {
  path: string;
  component: React.ReactNode;
};

export const publicRoutes: Route[] = [
  { path: "/sign-in", component: <SignInPage /> },
  { path: "/sign-up", component: <SignUpPage /> },
  { path: "/companies", component: <CompaniesPage /> },
  { path: "/companies/statistics", component: <CompaniesStatistics /> },
  { path: "/companies/:id", component: <CompanyPage /> },
  { path: "/platforms", component: <PlatformsPage /> },
  { path: "/platforms/:id", component: <PlatformPage /> },
  { path: "/genres", component: <GenresPage /> },
  { path: "/genres/:id", component: <GenrePage /> },
  { path: "/games", component: <GamesPage /> },
  { path: "/games/statistics", component: <GamesStatistics /> },
  { path: "/games/:id", component: <GamePage /> },
  { path: "/sales", component: <SalesPage /> },
  { path: "/sales/statistics", component: <SalesStatistics /> },
  { path: "/*", component: <PageNotFound /> },
];

export const authenticatedRoutes: Route[] = [{ path: "/account", component: <AccountPage /> }];

export const superuserRoutes: Route[] = [
  { path: "/users", component: <UsersPage /> },
  { path: "/users/statistics", component: <UsersStatistics /> },
  { path: "/users/:id/edit", component: <EditUserPage /> },
  { path: "/backups", component: <BackupsPage /> },
  { path: "/companies/create", component: <CreateCompanyPage /> },
  { path: "/companies/:id/edit", component: <EditCompanyPage /> },
  { path: "/platforms/create", component: <CreatePlatformPage /> },
  { path: "/platforms/:id/edit", component: <EditPlatformPage /> },
  { path: "/genres/create", component: <CreateGenrePage /> },
  { path: "/genres/:id/edit", component: <EditGenrePage /> },
  { path: "/games/create", component: <CreateGamePage /> },
  { path: "/games/:id/edit", component: <EditGamePage /> },
  { path: "/sales/create", component: <CreateSalePage /> },
  { path: "/sales/:id/edit", component: <EditSalePage /> },
];
