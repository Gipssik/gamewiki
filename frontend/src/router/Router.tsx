import React from "react";
import { Route, Routes } from "react-router-dom";
import { authenticatedRoutes, publicRoutes, superuserRoutes } from "./routes";
import { useAppSelector } from "../store";

const Router: React.FC = () => {
  const { me, isAuth } = useAppSelector((s) => s.auth);

  let routes = [...publicRoutes];

  if (isAuth) routes = [...authenticatedRoutes, ...routes];

  if (me && me.is_superuser) routes = [...superuserRoutes, ...routes];

  return (
    <Routes>
      {routes.map((route) => (
        <Route key={route.path} path={route.path} element={route.component} />
      ))}
    </Routes>
  );
};

export default Router;
