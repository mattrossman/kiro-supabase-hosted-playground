alter table "public"."todos" add column "priority" text not null default 'low'::text;

alter table "public"."todos" add constraint "todos_priority_check" CHECK ((priority = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text]))) not valid;

alter table "public"."todos" validate constraint "todos_priority_check";


