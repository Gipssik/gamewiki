import React from "react";
import styles from "./Title.module.css";

type Props = {
  children?: React.ReactNode;
};

const Title: React.FC<Props> = ({ children }) => {
  return <h1 className={styles.title}>{children}</h1>;
};

export default Title;
