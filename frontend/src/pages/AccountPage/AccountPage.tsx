import React from "react";
import { AccountForm, CreatedObjects, Title } from "../../components";
import { useAppSelector } from "../../store";
import styles from "./AccountPage.module.css";
import { Divider } from "antd";

const AccountPage: React.FC = () => {
  const me = useAppSelector((s) => s.auth.me);

  return (
    <>
      <Title>Your Account</Title>
      <Divider />
      <div className={styles.container}>
        <AccountForm />
        {me && me.is_superuser ? <CreatedObjects /> : null}
      </div>
    </>
  );
};

export default AccountPage;
