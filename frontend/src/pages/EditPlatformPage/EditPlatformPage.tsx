import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Platform, PlatformsService } from "../../client";
import { Loader, PlatformEditForm, Title } from "../../components";
import { useAppSelector } from "../../store";
import { PageNotFound } from "../PageNotFound";

export const EditPlatformPage: React.FC = () => {
  const platformId = useParams().id;
  const platforms = useAppSelector((s) => s.platforms.platforms);
  const [platformToEdit, setPlatformToEdit] = useState<Platform>();
  const [isPlatformLoading, setIsPlatformLoading] = useState<boolean>(true);

  useEffect(() => {
    let platform = platforms?.find((p) => p.id === platformId);
    if (platform) {
      setPlatformToEdit(platform);
      setIsPlatformLoading(false);
      return;
    }

    if (platformId) {
      PlatformsService.get(platformId)
        .then((p) => {
          setPlatformToEdit(p);
          setIsPlatformLoading(false);
        })
        .catch((error) => {
          setIsPlatformLoading(false);
        });
    }
  }, [platformId]);

  if (isPlatformLoading) return <Loader />;
  else if (!isPlatformLoading && !platformToEdit) return <PageNotFound />;

  return (
    <>
      <Title>Edit platform {platformToEdit?.title}</Title>
      {platformToEdit ? <PlatformEditForm platform={platformToEdit} /> : null}
    </>
  );
};
