import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { CompaniesService, Company } from "../../client";
import { CompanyEditForm, Loader, Title } from "../../components";
import { useAppSelector } from "../../store";
import { PageNotFound } from "../PageNotFound";

export const EditCompanyPage: React.FC = () => {
  const companyId = useParams().id;
  const companies = useAppSelector((s) => s.companies.companies);
  const [companyToEdit, setCompanyToEdit] = useState<Company>();
  const [isCompanyLoading, setIsCompanyLoading] = useState<boolean>(true);

  useEffect(() => {
    let company = companies?.find((c) => c.id === companyId);
    if (company) {
      setCompanyToEdit(company);
      setIsCompanyLoading(false);
      return;
    }

    if (companyId) {
      CompaniesService.get(companyId)
        .then((c) => {
          setCompanyToEdit(c);
          setIsCompanyLoading(false);
        })
        .catch((error) => {
          setIsCompanyLoading(false);
        });
    }
  }, [companyId]);

  if (isCompanyLoading) return <Loader />;
  else if (!isCompanyLoading && !companyToEdit) return <PageNotFound />;

  return (
    <>
      <Title>Edit company {companyToEdit?.title}</Title>
      {companyToEdit ? <CompanyEditForm company={companyToEdit} /> : null}
    </>
  );
};
