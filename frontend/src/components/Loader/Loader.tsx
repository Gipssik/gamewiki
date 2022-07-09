import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import React from "react";

const spinnerStyles = {
  height: "100%",
  width: "100%",
  display: "flex",
  justifyContent: "center",
  paddingTop: "20%",
};

export const Loader: React.FC = () => {
  const loader = <LoadingOutlined style={{ fontSize: 70, color: "#439775" }} spin />;

  return <Spin style={spinnerStyles} indicator={loader} />;
};
