import React, { useEffect, useState } from "react";
import { BrowserRouter } from "react-router-dom";
import { Loader, Navbar } from "./components";
import "antd/dist/antd.css";
import { Router } from "./router";
import { authActions, useAppDispatch } from "./store";
import { UsersService } from "./client";

const App: React.FC = () => {
  const dispatch = useAppDispatch();
  const [isMeLoaded, setIsMeLoaded] = useState(false);

  useEffect(() => {
    UsersService.getMe()
      .then((response) => {
        dispatch(authActions.login({ user: response }));
        setIsMeLoaded(true);
      })
      .catch((error) => {
        setIsMeLoaded(true);
      });
  }, []);

  if (!isMeLoaded) return <Loader />;

  return (
    <BrowserRouter>
      <Navbar />
      <Router />
    </BrowserRouter>
  );
};

export default App;
