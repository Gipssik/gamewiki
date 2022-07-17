import { Button, Form, Input, Modal, notification } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Platform, PlatformsService, PlatformUpdate } from "../../client";
import { getPrettifiedErrorString } from "../../utils";
import styles from "./PlatformEditForm.module.css";

type Props = {
  platform: Platform;
};

type UpdateFields = {
  title?: string;
};

export const PlatformEditForm: React.FC<Props> = ({ platform }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const validate = (values: UpdateFields): PlatformUpdate | undefined => {
    let toUpdate: PlatformUpdate = {
      title: values.title,
    };

    if (toUpdate.title && toUpdate.title === platform.title) delete toUpdate.title;

    return Object.keys(toUpdate).length === 0 ? undefined : toUpdate;
  };

  const processUpdate = (values: UpdateFields) => {
    const data = validate(values);
    if (data) {
      PlatformsService.update(platform.id, data)
        .then((u) => {
          notification.success({ message: `Platform ${platform.title} was updated successfully` });
          navigate("/platforms");
        })
        .catch((error) => {
          Modal.error({
            closable: true,
            title: "Error",
            content: getPrettifiedErrorString(error.body.detail),
          });
        });
    }
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
          initialValue={platform.title}
          rules={[{ required: true, message: "Platform title is required" }]}
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
