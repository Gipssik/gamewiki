import { Divider, Empty, List } from "antd";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { CompaniesService, Company } from "../../client";
import { Loader, Title } from "../../components";
import { useAppSelector } from "../../store";
import { PageNotFound } from "../PageNotFound";
import styles from "./CompanyPage.module.css";

export const CompanyPage: React.FC = () => {
  const companyId = useParams().id;
  const companies = useAppSelector((s) => s.companies.companies);
  const [company, setCompany] = useState<Company>();
  const [isCompanyLoading, setIsCompanyLoading] = useState<boolean>(true);

  useEffect(() => {
    let comp = companies?.find((c) => c.id === companyId);
    if (comp) {
      setCompany(comp);
      setIsCompanyLoading(false);
      return;
    }

    if (companyId) {
      CompaniesService.get(companyId)
        .then((c) => {
          setCompany(c);
          setIsCompanyLoading(false);
        })
        .catch((error) => {
          setIsCompanyLoading(false);
        });
    }
  }, [companyId]);

  if (isCompanyLoading) return <Loader />;
  else if (!isCompanyLoading && !company) return <PageNotFound />;

  return (
    <>
      <Title>Company {company?.title}</Title>
      <div className={styles.container}>
        <Divider orientation="left">
          <h2>Info</h2>
        </Divider>
        <table className={styles.datatable}>
          <tbody>
            <tr>
              <td>Founded at:</td>
              <td>{company && new Date(company.founded_at).toDateString()}</td>
            </tr>
            <tr>
              <td>Created at:</td>
              <td>{company && new Date(company.created_at).toISOString()}</td>
            </tr>
            <tr>
              <td>Created by:</td>
              <td>{company && company.created_by_user ? company.created_by_user.username : "-"}</td>
            </tr>
            <tr>
              <td>Amount of games:</td>
              <td>{company?.games?.length}</td>
            </tr>
          </tbody>
        </table>
        <Divider orientation="right">
          <h2>Games</h2>
        </Divider>
        <List
          bordered
          dataSource={company?.games}
          renderItem={(item) => (
            <List.Item>
              <Link to={`/games/${item.id}`}>{item.title}</Link>
            </List.Item>
          )}
          locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No Games" /> }}
        />
      </div>
    </>
  );
};
