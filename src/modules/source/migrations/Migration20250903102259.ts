import { Migration } from '@mikro-orm/migrations';

export class Migration20250903102259 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table if not exists "source" ("id" text not null, "name" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "source_pkey" primary key ("id"));`);
    this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_source_deleted_at" ON "source" (deleted_at) WHERE deleted_at IS NULL;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists "source" cascade;`);
  }

}
