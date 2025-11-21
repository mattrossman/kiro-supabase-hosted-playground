drop policy "Users can delete their own todos" on "public"."todos";

drop policy "Users can insert their own todos" on "public"."todos";

drop policy "Users can update their own todos" on "public"."todos";

drop policy "Users can view their own todos" on "public"."todos";

CREATE INDEX idx_todos_user_id ON public.todos USING btree (user_id);

set check_function_bodies = off;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO ''
AS $function$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$function$
;


  create policy "Users can delete their own todos"
  on "public"."todos"
  as permissive
  for delete
  to public
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Users can insert their own todos"
  on "public"."todos"
  as permissive
  for insert
  to public
with check ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Users can update their own todos"
  on "public"."todos"
  as permissive
  for update
  to public
using ((( SELECT auth.uid() AS uid) = user_id));



  create policy "Users can view their own todos"
  on "public"."todos"
  as permissive
  for select
  to public
using ((( SELECT auth.uid() AS uid) = user_id));



