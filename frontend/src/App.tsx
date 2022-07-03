import React, {FC, useEffect, useState} from 'react';
import {BrowserRouter} from "react-router-dom";
import {Navbar} from "./components";
import {Spin} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import 'antd/dist/antd.css';
import {Router} from "./router";
import {authActions, useAppDispatch} from "./store";
import {UsersService} from "./client";

const spinnerStyles = {
    height: "100%",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    paddingTop: "20%"
}

const App: FC = () => {
    const dispatch = useAppDispatch()
    const [isMeLoaded, setIsMeLoaded] = useState(false)

    const loader = <LoadingOutlined style={{fontSize: 70, color: "#439775"}} spin />;

    useEffect(() => {
        UsersService.getMe()
            .then(response => {
                dispatch(authActions.login({user: response}))
                setIsMeLoaded(true)
            })
            .catch(error => {
                setIsMeLoaded(true)
            })
    }, [])

    if (!isMeLoaded)
        return <Spin style={spinnerStyles} indicator={loader}/>

  return (
    <BrowserRouter>
        <Navbar/>
        <Router/>
    </BrowserRouter>
  );
};

export default App;
