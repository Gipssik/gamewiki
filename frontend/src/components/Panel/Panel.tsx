import React from "react";
import styles from "./Panel.module.css";

type Props = {
  children?: React.ReactNode;
};

export const Panel: React.FC<Props> = ({ children }) => {
  return <div className={styles.panel}>{children}</div>;
};
