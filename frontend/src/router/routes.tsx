import React from "react";
import { AccountPage, BackupsPage, EditUserPage, PageNotFound, SignInPage, SignUpPage, UsersPage } from "../pages";

type Route = {
  path: string;
  component: React.ReactNode;
};

export const publicRoutes: Route[] = [
  { path: "/sign-in", component: <SignInPage /> },
  { path: "/sign-up", component: <SignUpPage /> },
  { path: "/*", component: <PageNotFound /> },
];

export const authenticatedRoutes: Route[] = [{ path: "/account", component: <AccountPage /> }];

export const superuserRoutes: Route[] = [
  { path: "/users", component: <UsersPage /> },
  { path: "/users/:id/edit", component: <EditUserPage /> },
  { path: "/backups", component: <BackupsPage /> },
];
