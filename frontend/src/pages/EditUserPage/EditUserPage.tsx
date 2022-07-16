import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { User, UsersService } from "../../client";
import { Loader, Title, UserEditForm } from "../../components";
import { useAppSelector } from "../../store";
import { PageNotFound } from "../PageNotFound";

export const EditUserPage: React.FC = () => {
  const userId = useParams().id;
  const users = useAppSelector((s) => s.users.users);
  const [userToEdit, setUserToEdit] = useState<User>();
  const [isUserLoading, setIsUserLoading] = useState<boolean>(true);

  useEffect(() => {
    let user = users?.find((u) => u.id === userId);
    if (user) {
      setUserToEdit(user);
      setIsUserLoading(false);
      return;
    }

    if (userId) {
      UsersService.get(userId)
        .then((u) => {
          setUserToEdit(u);
          setIsUserLoading(false);
        })
        .catch((error) => {
          setIsUserLoading(false);
        });
    }
  }, [userId]);

  if (isUserLoading) return <Loader />;
  else if (!isUserLoading && !userToEdit) return <PageNotFound />;
  else if (!isUserLoading && userToEdit && userToEdit.is_primary) return <PageNotFound />;

  return (
    <>
      <Title>Edit user {userToEdit?.username}</Title>
      {userToEdit ? <UserEditForm user={userToEdit} /> : null}
    </>
  );
};
