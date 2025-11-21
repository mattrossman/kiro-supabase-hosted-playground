-- create todos table
-- this table stores todo items for authenticated users
create table public.todos (
  id uuid primary key default gen_random_uuid(),
  text text not null,
  completed boolean not null default false,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

comment on table public.todos is 'A list of todo items for authenticated users.';

-- enable row level security
alter table public.todos enable row level security;

-- create index on user_id for better performance with rls policies
create index todos_user_id_idx on public.todos using btree (user_id);

-- create index on created_at for sorting
create index todos_created_at_idx on public.todos using btree (created_at);

-- rls policy: users can select their own todos
create policy "Users can view their own todos"
on public.todos
for select
to authenticated
using ( (select auth.uid()) = user_id );

-- rls policy: users can insert their own todos
create policy "Users can create their own todos"
on public.todos
for insert
to authenticated
with check ( (select auth.uid()) = user_id );

-- rls policy: users can update their own todos
create policy "Users can update their own todos"
on public.todos
for update
to authenticated
using ( (select auth.uid()) = user_id )
with check ( (select auth.uid()) = user_id );

-- rls policy: users can delete their own todos
create policy "Users can delete their own todos"
on public.todos
for delete
to authenticated
using ( (select auth.uid()) = user_id );

-- create function to automatically update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- create trigger to automatically update updated_at on todos
create trigger set_updated_at
before update on public.todos
for each row
execute function public.handle_updated_at();;
