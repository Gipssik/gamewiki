import React, { useEffect, useState } from "react";
import { UsersService } from "../../client";
import { Container, Loader, Title } from "../../components";
import { useAppDispatch, useAppSelector, usersActions } from "../../store";
import { fetchLimit } from "../../utils";

const UsersPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const users = useAppSelector((s) => s.users.users);
  const [isUsersLoading, setIsUsersLoading] = useState(false);

  useEffect(() => {
    if (!users) {
      UsersService.getMulti(0, fetchLimit)
        .then((usersData) => {
          dispatch(usersActions.setAll({ users: usersData }));
          setIsUsersLoading(true);
        })
        .catch((error) => {
          setIsUsersLoading(true);
        });
    }
  }, [users]);

  if (!isUsersLoading) return <Loader />;

  return (
    <Container>
      <Title>Users</Title>
    </Container>
  );
};

export default UsersPage;
