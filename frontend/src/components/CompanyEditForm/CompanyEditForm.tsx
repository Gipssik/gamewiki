import { Button, DatePicker, Form, Input, Modal, notification } from "antd";
import moment from "moment";
import React from "react";
import { useNavigate } from "react-router-dom";
import { CompaniesService, Company, CompanyUpdate } from "../../client";
import { getPrettifiedErrorString } from "../../utils";
import styles from "./CompanyEditForm.module.css";

type Props = {
  company: Company;
};

type UpdateFields = {
  title?: string;
  founded_at?: moment.Moment;
};

export const CompanyEditForm: React.FC<Props> = ({ company }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const validate = (values: UpdateFields): CompanyUpdate | undefined => {
    let toUpdate: CompanyUpdate = {
      title: values.title,
      founded_at: values.founded_at?.format("YYYY-MM-DD"),
    };

    if (toUpdate.title && toUpdate.title === company.title) delete toUpdate.title;

    if (toUpdate.founded_at && toUpdate.founded_at === company.founded_at) delete toUpdate.founded_at;

    return Object.keys(toUpdate).length === 0 ? undefined : toUpdate;
  };

  const processUpdate = (values: UpdateFields) => {
    const data = validate(values);
    if (data) {
      CompaniesService.update(company.id, data)
        .then((u) => {
          notification.success({ message: `Company ${company.title} was updated successfully` });
          navigate("/companies");
        })
        .catch((error) => {
          Modal.error({
            closable: true,
            title: "Error",
            content: getPrettifiedErrorString(error.body.detail),
          });
        });
    } else navigate("/companies");
  };

  const reset = () => {
    form.resetFields(["title", "founded_at"]);
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
          initialValue={company.title}
          rules={[{ required: true, message: "Company title is required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          colon={false}
          label="Founded at"
          name="founded_at"
          initialValue={moment(company.founded_at)}
          rules={[{ required: true, message: "Date of company's foundation is required" }]}
        >
          <DatePicker />
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
