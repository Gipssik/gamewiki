import { Button, Form, InputNumber, Modal, notification } from "antd";
import React from "react";
import { useNavigate } from "react-router-dom";
import { Game, GamesService, Platform, PlatformsService, Sale, SalesService, SaleUpdate } from "../../client";
import { getPrettifiedErrorString } from "../../utils";
import { AjaxSelect } from "../AjaxSelect";
import styles from "./SaleEditForm.module.css";

type Props = {
  sale: Sale;
};

export const SaleEditForm: React.FC<Props> = ({ sale }) => {
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

  const validate = (values: SaleUpdate): SaleUpdate | undefined => {
    let toUpdate = { ...values };

    if (toUpdate.amount && toUpdate.amount === sale.amount) delete toUpdate.amount;

    if (toUpdate.game_id && (toUpdate.game_id === sale.game.id || toUpdate.game_id === sale.game.title))
      delete toUpdate.game_id;

    if (
      toUpdate.platform_id &&
      (toUpdate.platform_id === sale.platform.id || toUpdate.platform_id === sale.platform.title)
    )
      delete toUpdate.platform_id;

    return Object.keys(toUpdate).length === 0 ? undefined : toUpdate;
  };

  const processUpdate = (values: SaleUpdate) => {
    const data = validate(values);
    if (data) {
      SalesService.update(sale.id, data)
        .then((s) => {
          notification.success({ message: `Sale was successfully updated!` });
          navigate("/sales");
        })
        .catch((error) => {
          Modal.error({
            closable: true,
            title: "Error",
            content: getPrettifiedErrorString(error.body.detail),
          });
        });
    } else navigate("/sales");
  };

  const reset = () => {
    form.resetFields(["amount", "game_id", "platform_id"]);
  };

  return (
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
        onFinish={processUpdate}
        autoComplete="off"
      >
        <Form.Item
          colon={false}
          label="Amount"
          name="amount"
          initialValue={sale.amount}
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
          initialValue={sale.game.title}
          rules={[{ required: true, message: "Game is required" }]}
        >
          <AjaxSelect fetchData={fetchGames} placeholder="Game" />
        </Form.Item>

        <Form.Item
          colon={false}
          label="Platform"
          name="platform_id"
          initialValue={sale.platform.title}
          rules={[{ required: true, message: "Platform is required" }]}
        >
          <AjaxSelect fetchData={fetchPlatform} placeholder="Platform" />
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
