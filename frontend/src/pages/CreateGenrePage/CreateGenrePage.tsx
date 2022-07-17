import { Button, Form, Input, Modal, notification } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { GenreCreate, GenresService } from "../../client";
import { Title } from "../../components";
import { getPrettifiedErrorString } from "../../utils";
import styles from "./CreateGenrePage.module.css";

type CreateFields = {
  title: string;
};

export const CreateGenrePage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const processCreate = (values: CreateFields) => {
    const toCreate: GenreCreate = {
      title: values.title,
    };

    GenresService.create(toCreate)
      .then((genre) => {
        notification.success({ message: `Genre ${genre.title} was created successfully` });
        navigate("/genres");
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
      <Title>Create genre</Title>
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
