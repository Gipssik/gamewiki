import { Button, DatePicker, Form, Input, Modal, notification, Select } from "antd";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { CompaniesService, Company, GameCreate, GamesService, GenresService, PlatformsService } from "../../client";
import { AjaxSelect, DebounceSelect, Title } from "../../components";
import { getPrettifiedErrorString } from "../../utils";
import styles from "./CreateGamePage.module.css";

type Value = {
  label: string;
  value: string;
};

type CreateFields = {
  title: string;
  released_at: moment.Moment;
  created_by_company: string;
  genres: Value[];
  platforms: Value[];
};

export const CreateGamePage: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [genres, setGenres] = useState<Value[]>([]);
  const [platforms, setPlatforms] = useState<Value[]>([]);

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

  const convertGameData = (values: CreateFields): GameCreate => {
    return {
      title: values.title,
      created_by_company_id: values.created_by_company,
      released_at: values.released_at.format("YYYY-MM-DD"),
      genres: values.genres && values.genres.length ? values.genres.map((genre) => genre.value) : undefined,
      platforms:
        values.platforms && values.platforms.length ? values.platforms.map((platform) => platform.value) : undefined,
    };
  };

  const processCreate = (values: CreateFields) => {
    const data = convertGameData(values);
    GamesService.create(data)
      .then((game) => {
        notification.success({ message: `Game ${game.title} was successfully created!` });
        navigate("/games");
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
      <Title>Create game</Title>
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
            label="Title"
            name="title"
            rules={[{ required: true, message: "Game title is required" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            colon={false}
            label="Released at"
            name="released_at"
            rules={[{ required: true, message: "Date of game's release is required" }]}
          >
            <DatePicker />
          </Form.Item>

          <Form.Item
            colon={false}
            label="Created by company"
            name="created_by_company"
            rules={[{ required: true, message: "Game's creator is required" }]}
          >
            <AjaxSelect fetchData={fetchCompanies} placeholder="Company" />
          </Form.Item>

          <Form.Item colon={false} label="Genres" name="genres">
            <DebounceSelect
              mode="multiple"
              value={genres}
              placeholder="Genres"
              fetchOptions={fetchGenres}
              onChange={setGenres}
              style={{ width: "100%" }}
            />
          </Form.Item>

          <Form.Item colon={false} label="Platforms" name="platforms">
            <DebounceSelect
              mode="multiple"
              value={platforms}
              placeholder="Platforms"
              fetchOptions={fetchPlatforms}
              onChange={setPlatforms}
              style={{ width: "100%" }}
            />
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
