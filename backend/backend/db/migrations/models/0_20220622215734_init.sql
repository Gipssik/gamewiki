-- upgrade --
CREATE TABLE IF NOT EXISTS "user" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "username" VARCHAR(32) NOT NULL UNIQUE,
    "email" VARCHAR(128) NOT NULL UNIQUE,
    "hashed_password" VARCHAR(256) NOT NULL,
    "is_superuser" BOOL NOT NULL  DEFAULT False,
    "is_primary" BOOL NOT NULL  DEFAULT False,
    "created_at" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "salt" VARCHAR(1024) NOT NULL
);
CREATE INDEX IF NOT EXISTS "idx_user_usernam_9987ab" ON "user" ("username");
CREATE INDEX IF NOT EXISTS "idx_user_email_1b4f1c" ON "user" ("email");
CREATE TABLE IF NOT EXISTS "company" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "title" VARCHAR(512) NOT NULL UNIQUE,
    "founded_at" DATE NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID REFERENCES "user" ("id") ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS "idx_company_title_3ed35f" ON "company" ("title");
CREATE TABLE IF NOT EXISTS "game" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "title" VARCHAR(512) NOT NULL UNIQUE,
    "founded_at" DATE NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "created_by_company_id" UUID NOT NULL REFERENCES "company" ("id") ON DELETE CASCADE,
    "created_by_user_id" UUID REFERENCES "user" ("id") ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS "idx_game_title_0dda4a" ON "game" ("title");
CREATE TABLE IF NOT EXISTS "genre" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "title" VARCHAR(512) NOT NULL UNIQUE,
    "founded_at" DATE NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL  DEFAULT CURRENT_TIMESTAMP,
    "created_by_user_id" UUID REFERENCES "user" ("id") ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS "idx_genre_title_ce6ddd" ON "genre" ("title");
CREATE TABLE IF NOT EXISTS "platform" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "title" VARCHAR(512) NOT NULL UNIQUE,
    "created_by_user_id" UUID REFERENCES "user" ("id") ON DELETE SET NULL
);
CREATE INDEX IF NOT EXISTS "idx_platform_title_f60386" ON "platform" ("title");
CREATE TABLE IF NOT EXISTS "sale" (
    "id" UUID NOT NULL  PRIMARY KEY,
    "amount" BIGINT NOT NULL,
    "created_by_user_id" UUID REFERENCES "user" ("id") ON DELETE SET NULL,
    "game_id" UUID NOT NULL REFERENCES "game" ("id") ON DELETE CASCADE,
    "platform_id" UUID NOT NULL REFERENCES "platform" ("id") ON DELETE CASCADE,
    CONSTRAINT "uid_sale_game_id_eb7dea" UNIQUE ("game_id", "platform_id")
);
CREATE TABLE IF NOT EXISTS "aerich" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "version" VARCHAR(255) NOT NULL,
    "app" VARCHAR(100) NOT NULL,
    "content" JSONB NOT NULL
);
CREATE TABLE IF NOT EXISTS "game_platform" (
    "game_id" UUID NOT NULL REFERENCES "game" ("id") ON DELETE CASCADE,
    "platform_id" UUID NOT NULL REFERENCES "platform" ("id") ON DELETE CASCADE
);
CREATE TABLE IF NOT EXISTS "game_genre" (
    "game_id" UUID NOT NULL REFERENCES "game" ("id") ON DELETE CASCADE,
    "genre_id" UUID NOT NULL REFERENCES "genre" ("id") ON DELETE CASCADE
);
