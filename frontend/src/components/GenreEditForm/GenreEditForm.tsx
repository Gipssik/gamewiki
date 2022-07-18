import { Button, Form, Input, Modal, notification } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Genre, GenresService, GenreUpdate } from "../../client";
import { getPrettifiedErrorString } from "../../utils";
import styles from "./GenreEditForm.module.css";

type Props = {
  genre: Genre;
};

type UpdateFields = {
  title?: string;
};

export const GenreEditForm: React.FC<Props> = ({ genre }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const validate = (values: UpdateFields): GenreUpdate | undefined => {
    let toUpdate: GenreUpdate = {
      title: values.title,
    };

    if (toUpdate.title && toUpdate.title === genre.title) delete toUpdate.title;

    return Object.keys(toUpdate).length === 0 ? undefined : toUpdate;
  };

  const processUpdate = (values: UpdateFields) => {
    const data = validate(values);
    if (data) {
      GenresService.update(genre.id, data)
        .then((u) => {
          notification.success({ message: `Genre ${genre.title} was updated successfully` });
          navigate("/genres");
        })
        .catch((error) => {
          Modal.error({
            closable: true,
            title: "Error",
            content: getPrettifiedErrorString(error.body.detail),
          });
        });
    } else navigate("/genres");
  };

  const reset = () => {
    form.resetFields(["title"]);
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
          label="Title"
          name="title"
          initialValue={genre.title}
          rules={[{ required: true, message: "Genre title is required" }]}
        >
          <Input />
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
