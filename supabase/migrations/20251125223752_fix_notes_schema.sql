drop extension if exists "pg_net";

alter table "public"."notes" drop column "content";

alter table "public"."notes" add column "text" text not null default ''::text;


