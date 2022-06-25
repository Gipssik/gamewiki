-- upgrade --
ALTER TABLE "genre" DROP COLUMN "founded_at";
-- downgrade --
ALTER TABLE "genre" ADD "founded_at" DATE NOT NULL;
