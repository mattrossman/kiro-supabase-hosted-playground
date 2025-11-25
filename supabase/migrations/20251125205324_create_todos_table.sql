-- Create todos table
create table public.todos (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  content text not null,
  completed boolean not null default false,
  priority text not null default 'medium',
  "order" integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Enable RLS
alter table public.todos enable row level security;

-- Create policies
create policy "Users can view their own todos"
  on public.todos for select
  using (auth.uid() = user_id);

create policy "Users can insert their own todos"
  on public.todos for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own todos"
  on public.todos for update
  using (auth.uid() = user_id);

create policy "Users can delete their own todos"
  on public.todos for delete
  using (auth.uid() = user_id);

-- Create index for better query performance
create index todos_user_id_idx on public.todos(user_id);
create index todos_order_idx on public.todos("order");

-- Create trigger to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger set_updated_at
  before update on public.todos
  for each row
  execute function public.handle_updated_at();;
