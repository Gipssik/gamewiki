import React from "react";
import {
  AccountPage,
  BackupsPage,
  CompaniesPage,
  CompanyPage,
  CreateCompanyPage,
  CreatePlatformPage,
  EditCompanyPage,
  EditPlatformPage,
  EditUserPage,
  PageNotFound,
  PlatformPage,
  PlatformsPage,
  SignInPage,
  SignUpPage,
  UsersPage,
} from "../pages";

type Route = {
  path: string;
  component: React.ReactNode;
};

export const publicRoutes: Route[] = [
  { path: "/sign-in", component: <SignInPage /> },
  { path: "/sign-up", component: <SignUpPage /> },
  { path: "/companies", component: <CompaniesPage /> },
  { path: "/companies/:id", component: <CompanyPage /> },
  { path: "/platforms", component: <PlatformsPage /> },
  { path: "/platforms/:id", component: <PlatformPage /> },
  { path: "/*", component: <PageNotFound /> },
];

export const authenticatedRoutes: Route[] = [{ path: "/account", component: <AccountPage /> }];

export const superuserRoutes: Route[] = [
  { path: "/users", component: <UsersPage /> },
  { path: "/users/:id/edit", component: <EditUserPage /> },
  { path: "/backups", component: <BackupsPage /> },
  { path: "/companies/create", component: <CreateCompanyPage /> },
  { path: "/companies/:id/edit", component: <EditCompanyPage /> },
  { path: "/platforms/create", component: <CreatePlatformPage /> },
  { path: "/platforms/:id/edit", component: <EditPlatformPage /> },
];
