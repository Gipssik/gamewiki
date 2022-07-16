import { Button, DatePicker, Form, Input, Modal, notification } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { CompaniesService, CompanyCreate } from "../../client";
import { Title } from "../../components";
import { getPrettifiedErrorString } from "../../utils";
import styles from "./CreateCompanyPage.module.css";

type CreateFields = {
  title: string;
  founded_at: moment.Moment;
};

export const CreateCompanyPage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const processCreate = (values: CreateFields) => {
    const toCreate: CompanyCreate = {
      title: values.title,
      founded_at: values.founded_at?.format("YYYY-MM-DD"),
    };

    CompaniesService.create(toCreate)
      .then((company) => {
        notification.success({ message: `Company ${company.title} was created successfully` });
        navigate("/companies");
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
            rules={[{ required: true, message: "Company title is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            colon={false}
            label="Founded at"
            name="founded_at"
            rules={[{ required: true, message: "Date of company's foundation is required" }]}
          >
            <DatePicker />
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
