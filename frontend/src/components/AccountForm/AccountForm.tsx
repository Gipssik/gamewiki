import React from "react";
import styles from "./AccountForm.module.css";
import { Button, Form, Input, message, Modal } from "antd";
import { authActions, useAppDispatch, useAppSelector } from "../../store";
import { AuthService, Body_auth_login_access_token, UsersService, UserUpdate } from "../../client";
import { getPrettifiedErrorString } from "../../utils";

type UpdateFields = {
  username?: string;
  email?: string;
  oldPassword?: string;
  newPassword?: string;
};

const AccountForm: React.FC = () => {
  const dispatch = useAppDispatch();
  const me = useAppSelector((s) => s.auth.me);
  const [form] = Form.useForm();

  const validate = (values: UpdateFields): UserUpdate | undefined => {
    let toUpdate: UserUpdate = {};

    if (values.username && values.username === me?.username) delete values.username;
    else toUpdate.username = values.username;

    if (values.email && values.email === me?.email) delete values.email;
    else toUpdate.email = values.email;

    if ((values.newPassword && !values.oldPassword) || (values.oldPassword && !values.newPassword)) {
      message.error("You have to provide old and new passwords both", 5);
      return;
    }

    if (values.newPassword) toUpdate.password = values.newPassword;

    return toUpdate;
  };

  const update = (data: UserUpdate) => {
    if (!me) return;

    UsersService.update(me.id, data)
      .then((user) => {
        dispatch(authActions.login({ user }));
        message.success("Your account data was updated successfully!", 5);
        form.resetFields(["oldPassword", "newPassword"]);
      })
      .catch((error) => {
        Modal.error({
          closable: true,
          title: "Error",
          content: getPrettifiedErrorString(error.body.detail),
        });
      });
  };

  const updateWithAuth = (data: UserUpdate, oldPassword: string) => {
    if (!me) return;

    let authData = { username: me.username, password: oldPassword } as Body_auth_login_access_token;
    AuthService.loginAccessToken(authData)
      .then((token) => {
        update(data);
      })
      .catch((error) => {
        Modal.error({
          closable: true,
          title: "Error",
          content: "Incorrect password",
        });
      });
  };

  const processUpdate = (values: UpdateFields) => {
    const updates = validate(values);
    if (updates && me && Object.keys(updates as Object).length) {
      if (updates.password) {
        updateWithAuth(updates, values.oldPassword as string);
      } else {
        update(updates);
      }
    }
  };

  const reset = () => {
    form.resetFields(["username", "email", "oldPassword", "newPassword"]);
  };

  return (
    <div className={styles.container}>
      <Form
        form={form}
        name="basic"
        labelCol={{
          span: 6,
        }}
        wrapperCol={{
          span: 16,
        }}
        onFinish={processUpdate}
        autoComplete="off"
      >
        <Form.Item
          colon={false}
          label="Username"
          name="username"
          initialValue={me?.username}
          rules={[
            {
              min: 4,
              message: "Username must be at least 4 characters long",
            },
            {
              max: 20,
              message: "Username must be maximum 20 characters long",
            },
            {
              pattern: /^\w+$/,
              message: "Username must contain only letters, numbers and underscore sign",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          colon={false}
          label="Email"
          name="email"
          initialValue={me?.email}
          rules={[
            {
              type: "email",
              message: "You have to provide a valid email",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          colon={false}
          label="Old Password"
          name="oldPassword"
          rules={[
            {
              min: 8,
              message: "Password must be at least 8 characters long",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          colon={false}
          label="New Password"
          name="newPassword"
          rules={[
            {
              min: 8,
              message: "Password must be at least 8 characters long",
            },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item wrapperCol={{}}>
          <div className={styles.buttons}>
            <Button type="primary" htmlType="submit">
              Update
            </Button>
            <Button type="ghost" onClick={reset}>
              Reset
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AccountForm;
