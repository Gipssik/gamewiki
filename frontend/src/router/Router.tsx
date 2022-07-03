import React from 'react';
import { Route, Routes } from 'react-router-dom';
import {authenticatedRoutes, publicRoutes} from "./routes";
import {useAppSelector} from "../store";

const Router: React.FC = () => {
	const isAuth = useAppSelector(s => s.auth.isAuth)

	let routes = [...publicRoutes]

	if (isAuth)
		routes = [...authenticatedRoutes, ...routes]

	return (
		<Routes>
			{routes.map(route => <Route key={route.path} path={route.path} element={route.component}/>)}
		</Routes>
	);
};

export default Router;