-- upgrade --
ALTER TABLE "game" RENAME COLUMN "founded_at" TO "released_at";
-- downgrade --
ALTER TABLE "game" RENAME COLUMN "released_at" TO "founded_at";
