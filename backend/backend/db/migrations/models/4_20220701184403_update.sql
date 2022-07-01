-- upgrade --
ALTER TABLE "backup" ADD "created_by_user_id" UUID;
ALTER TABLE "backup" ADD CONSTRAINT "fk_backup_user_7064e478" FOREIGN KEY ("created_by_user_id") REFERENCES "user" ("id") ON DELETE SET NULL;
-- downgrade --
ALTER TABLE "backup" DROP CONSTRAINT "fk_backup_user_7064e478";
ALTER TABLE "backup" DROP COLUMN "created_by_user_id";
