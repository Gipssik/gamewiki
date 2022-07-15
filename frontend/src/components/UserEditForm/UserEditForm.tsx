import { Button, Form, Input, message, notification, Switch } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { User, UsersService, UserUpdate } from "../../client";
import styles from "./UserEditForm.module.css";

type Props = {
  user: User;
};

type UpdateFields = {
  username?: string;
  email?: string;
  is_superuser?: boolean;
};

export const UserEditForm: React.FC<Props> = ({ user }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const validate = (values: UpdateFields): UserUpdate | undefined => {
    let toUpdate: UserUpdate = {};

    if (values.username && values.username === user.username) delete values.username;
    else toUpdate.username = values.username;

    if (values.email && values.email === user.email) delete values.email;
    else toUpdate.email = values.email;

    if (values.is_superuser && values.is_superuser === user.is_superuser) delete values.is_superuser;
    else toUpdate.is_superuser = values.is_superuser;

    return Object.keys(toUpdate).length === 0 ? undefined : toUpdate;
  };

  const processUpdate = (values: UpdateFields) => {
    const data = validate(values);
    if (data) {
      UsersService.update(user.id, data)
        .then((u) => {
          notification.success({ message: `User ${user.username} was updated successfully` });
          navigate("/users");
        })
        .catch((error) => {
          console.log(error);
          message.error(error);
        });
    }
  };

  const reset = () => {
    form.resetFields(["username", "email", "is_superuser"]);
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
          initialValue={user.username}
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
          initialValue={user.email}
          rules={[
            {
              type: "email",
              message: "You have to provide a valid email",
            },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item initialValue={user.is_superuser} valuePropName="checked" label="Superuser" name="is_superuser">
          <Switch defaultChecked={user.is_superuser} />
        </Form.Item>

        <Form.Item wrapperCol={{}}>
          <div className={styles.buttons}>
            <Button type="primary" htmlType="submit">
              Edit
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
