"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Migration20250326054631 = void 0;
const migrations_1 = require("@mikro-orm/migrations");
class Migration20250326054631 extends migrations_1.Migration {
    async up() {
        this.addSql(`create table if not exists "brand" ("id" text not null, "name" text not null, "created_at" timestamptz not null default now(), "updated_at" timestamptz not null default now(), "deleted_at" timestamptz null, constraint "brand_pkey" primary key ("id"));`);
        this.addSql(`CREATE INDEX IF NOT EXISTS "IDX_brand_deleted_at" ON "brand" (deleted_at) WHERE deleted_at IS NULL;`);
    }
    async down() {
        this.addSql(`drop table if exists "brand" cascade;`);
    }
}
exports.Migration20250326054631 = Migration20250326054631;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiTWlncmF0aW9uMjAyNTAzMjYwNTQ2MzEuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9zcmMvbW9kdWxlcy9icmFuZC9taWdyYXRpb25zL01pZ3JhdGlvbjIwMjUwMzI2MDU0NjMxLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7OztBQUFBLHNEQUFrRDtBQUVsRCxNQUFhLHVCQUF3QixTQUFRLHNCQUFTO0lBRTNDLEtBQUssQ0FBQyxFQUFFO1FBQ2YsSUFBSSxDQUFDLE1BQU0sQ0FBQyw2UEFBNlAsQ0FBQyxDQUFDO1FBQzNRLElBQUksQ0FBQyxNQUFNLENBQUMscUdBQXFHLENBQUMsQ0FBQztJQUNySCxDQUFDO0lBRVEsS0FBSyxDQUFDLElBQUk7UUFDakIsSUFBSSxDQUFDLE1BQU0sQ0FBQyx1Q0FBdUMsQ0FBQyxDQUFDO0lBQ3ZELENBQUM7Q0FFRjtBQVhELDBEQVdDIn0=