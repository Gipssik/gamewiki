import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Sale, SalesService } from "../../client";
import { Loader, SaleEditForm, Title } from "../../components";
import { useAppSelector } from "../../store";
import { PageNotFound } from "../PageNotFound";

export const EditSalePage: React.FC = () => {
  const saleId = useParams().id;
  const sales = useAppSelector((s) => s.sales.sales);
  const [saleToEdit, setSaleToEdit] = useState<Sale>();
  const [isSaleLoading, setIsSaleLoading] = useState<boolean>(true);

  useEffect(() => {
    let sale = sales?.find((s) => s.id === saleId);
    if (sale) {
      setSaleToEdit(sale);
      setIsSaleLoading(false);
      return;
    }

    if (saleId) {
      SalesService.get(saleId)
        .then((s) => {
          setSaleToEdit(s);
          setIsSaleLoading(false);
        })
        .catch((error) => {
          setIsSaleLoading(false);
        });
    }
  }, [saleId]);

  if (isSaleLoading) return <Loader />;
  else if (!isSaleLoading && !saleToEdit) return <PageNotFound />;

  return (
    <>
      <Title>
        Edit sale "{saleToEdit?.game.title} - {saleToEdit?.platform.title}"
      </Title>
      {saleToEdit ? <SaleEditForm sale={saleToEdit} /> : null}
    </>
  );
};
