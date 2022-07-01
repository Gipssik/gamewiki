-- upgrade --
CREATE TABLE IF NOT EXISTS "backup" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "title" VARCHAR(512) NOT NULL UNIQUE,
    "url" VARCHAR(1024) NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS "idx_backup_title_9166e6" ON "backup" ("title");
-- downgrade --
DROP TABLE IF EXISTS "backup";
