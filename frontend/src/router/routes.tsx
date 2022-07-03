import React from "react";
import {AccountPage, PageNotFound, SignInPage, SignUpPage} from "../pages";

type Route = {
	path: string,
	component: React.ReactNode
}

export const publicRoutes: Route[] = [
	{path: '/sign-in', component: <SignInPage/>},
	{path: '/sign-up', component: <SignUpPage/>},
	{path: '/*', component: <PageNotFound/>}
]

export const authenticatedRoutes: Route[] = [
	{path: '/account', component: <AccountPage/>}
]
