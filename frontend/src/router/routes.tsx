import React from "react";
import {
  AccountPage,
  BackupsPage,
  CompaniesPage,
  CompanyPage,
  CreateCompanyPage,
  EditCompanyPage,
  EditUserPage,
  PageNotFound,
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
  { path: "/*", component: <PageNotFound /> },
];

export const authenticatedRoutes: Route[] = [{ path: "/account", component: <AccountPage /> }];

export const superuserRoutes: Route[] = [
  { path: "/users", component: <UsersPage /> },
  { path: "/users/:id/edit", component: <EditUserPage /> },
  { path: "/backups", component: <BackupsPage /> },
  { path: "/companies/create", component: <CreateCompanyPage /> },
  { path: "/companies/:id/edit", component: <EditCompanyPage /> },
];
