import { Button, Form, InputNumber, Modal, notification } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Game, GamesService, Platform, PlatformsService, SaleCreate, SalesService } from "../../client";
import { AjaxSelect, Title } from "../../components";
import { getPrettifiedErrorString } from "../../utils";
import styles from "./CreateSalePage.module.css";

type CreateFields = {
  amount: number;
  game: string;
  platform: string;
};

export const CreateSalePage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const fetchGames = (value: string, callback: (data: Game[]) => void) => {
    GamesService.getMulti(0, 100, value).then((g) => {
      callback(g);
    });
  };

  const fetchPlatform = (value: string, callback: (data: Platform[]) => void) => {
    PlatformsService.getMulti(0, 100, value).then((p) => {
      callback(p);
    });
  };

  const processCreate = (values: SaleCreate) => {
    SalesService.create(values)
      .then((sale) => {
        notification.success({
          message: `Sale "${sale.game.title} - ${sale.platform.title}" was successfully created!`,
        });
        navigate("/sales");
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
      <Title>Create sale</Title>
      <div className={styles.container}>
        <Form
          form={form}
          name="basic"
          labelCol={{
            span: 10,
          }}
          wrapperCol={{
            span: 16,
          }}
          onFinish={processCreate}
          autoComplete="off"
        >
          <Form.Item
            colon={false}
            label="Amount"
            name="amount"
            rules={[
              { required: true, message: "Sale amount is required" },
              { type: "number", min: 0 },
            ]}
          >
            <InputNumber />
          </Form.Item>

          <Form.Item
            colon={false}
            label="Game"
            name="game_id"
            rules={[{ required: true, message: "Game is required" }]}
          >
            <AjaxSelect fetchData={fetchGames} placeholder="Game" />
          </Form.Item>

          <Form.Item
            colon={false}
            label="Platform"
            name="platform_id"
            rules={[{ required: true, message: "Platform is required" }]}
          >
            <AjaxSelect fetchData={fetchPlatform} placeholder="Platform" />
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
