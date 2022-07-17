import { Button, Form, Input, Modal, notification } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { PlatformCreate, PlatformsService } from "../../client";
import { Title } from "../../components";
import { getPrettifiedErrorString } from "../../utils";
import styles from "./CreatePlatformPage.module.css";

type CreateFields = {
  title: string;
};

export const CreatePlatformPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const processCreate = (values: CreateFields) => {
    const toCreate: PlatformCreate = {
      title: values.title,
    };

    PlatformsService.create(toCreate)
      .then((platform) => {
        notification.success({ message: `Platform ${platform.title} was created successfully` });
        navigate("/platforms");
      })
      .catch((error) => {
        Modal.error({
          closable: true,
          title: "Error",
          content: getPrettifiedErrorString(error.body.detail),
        });
      });
  };

  return (
    <>
      <Title>Create company</Title>
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
          onFinish={processCreate}
          autoComplete="off"
        >
          <Form.Item
            colon={false}
            label="Title"
            name="title"
            rules={[{ required: true, message: "Platform title is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{}}>
            <div className={styles.buttons}>
              <Button size="large" type="primary" htmlType="submit">
                Create
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </>
  );
};
