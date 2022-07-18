import { Button, DatePicker, Form, Input, Modal, notification } from "antd";
import lodash from "lodash";
import moment from "moment";
import React from "react";
import { useNavigate } from "react-router-dom";
import {
  CompaniesService,
  Company,
  Game,
  GamesService,
  GameUpdate,
  GenresService,
  PlatformsService,
} from "../../client";
import { getPrettifiedErrorString } from "../../utils";
import { AjaxSelect } from "../AjaxSelect";
import { DebounceSelect } from "../DebounceSelect";
import { Title } from "../Title";
import styles from "./GameEditForm.module.css";

type Props = {
  game: Game;
};

type Value = {
  label: string;
  value: string;
};

type UpdateFields = {
  title?: string;
  released_at?: moment.Moment;
  created_by_company?: string;
  genres?: Value[];
  platforms?: Value[];
};

export const GameEditForm: React.FC<Props> = ({ game }) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();

  const fetchCompanies = (value: string, callback: (data: Company[]) => void) => {
    CompaniesService.getMulti(0, 100, value).then((c) => {
      callback(c);
    });
  };

  const fetchGenres = (value: string): Promise<Value[]> => {
    return GenresService.getMulti(0, 100, value).then((g) => {
      return g.map((genre) => ({ label: genre.title, value: genre.id }));
    });
  };

  const fetchPlatforms = (value: string): Promise<Value[]> => {
    return PlatformsService.getMulti(0, 100, value).then((p) => {
      return p.map((platform) => ({ label: platform.title, value: platform.id }));
    });
  };

  const validate = (values: UpdateFields): GameUpdate | undefined => {
    let toUpdate: GameUpdate = {
      title: values.title,
      released_at: values.released_at?.format("YYYY-MM-DD"),
      created_by_company_id: values.created_by_company,
    };
    let gs = values.genres?.map((g) => g.value),
      ps = values.platforms?.map((p) => p.value);

    if (toUpdate.title && toUpdate.title === game.title) delete toUpdate.title;

    if (toUpdate.released_at && toUpdate.released_at === game.released_at) delete toUpdate.released_at;

    if (
      toUpdate.created_by_company_id &&
      (toUpdate.created_by_company_id === game.created_by_company.id ||
        toUpdate.created_by_company_id === game.created_by_company.title)
    )
      delete toUpdate.created_by_company_id;

    if (
      values.genres &&
      !lodash.isEqual(
        gs,
        game.genres?.map((g) => g.id)
      )
    )
      toUpdate.genres = gs;

    if (
      values.platforms &&
      !lodash.isEqual(
        ps,
        game.platforms?.map((p) => p.id)
      )
    )
      toUpdate.platforms = ps;

    return Object.keys(toUpdate).length === 0 ? undefined : toUpdate;
  };

  const processUpdate = (values: UpdateFields) => {
    const data = validate(values);
    if (data) {
      GamesService.update(game.id, data)
        .then((g) => {
          notification.success({ message: `Game ${g.title} was successfully updated!` });
          navigate("/games");
        })
        .catch((error) => {
          Modal.error({
            closable: true,
            title: "Error",
            content: getPrettifiedErrorString(error.body.detail),
          });
        });
    } else navigate("/games");
  };

  const reset = () => {
    form.resetFields(["title", "released_at", "created_by_company", "genres", "platforms"]);
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
          label="Title"
          name="title"
          initialValue={game.title}
          rules={[{ required: true, message: "Game title is required" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          colon={false}
          label="Released at"
          name="released_at"
          initialValue={moment(game.released_at)}
          rules={[{ required: true, message: "Date of game's release is required" }]}
        >
          <DatePicker />
        </Form.Item>

        <Form.Item
          colon={false}
          label="Created by company"
          name="created_by_company"
          initialValue={game.created_by_company.title}
          rules={[{ required: true, message: "Game's creator is required" }]}
        >
          <AjaxSelect fetchData={fetchCompanies} placeholder="Company" />
        </Form.Item>

        <Form.Item
          colon={false}
          label="Genres"
          name="genres"
          initialValue={game.genres?.map((g) => ({ label: g.title, value: g.id }))}
        >
          <DebounceSelect mode="multiple" placeholder="Genres" fetchOptions={fetchGenres} style={{ width: "100%" }} />
        </Form.Item>

        <Form.Item
          colon={false}
          label="Platforms"
          name="platforms"
          initialValue={game.platforms?.map((p) => ({ label: p.title, value: p.id }))}
        >
          <DebounceSelect
            mode="multiple"
            placeholder="Platforms"
            fetchOptions={fetchPlatforms}
            style={{ width: "100%" }}
          />
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
