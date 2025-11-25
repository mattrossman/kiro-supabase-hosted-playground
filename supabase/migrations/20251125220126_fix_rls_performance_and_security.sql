-- Fix RLS policies for todos table to use subquery for better performance
drop policy if exists "Users can view their own todos" on public.todos;
drop policy if exists "Users can insert their own todos" on public.todos;
drop policy if exists "Users can update their own todos" on public.todos;
drop policy if exists "Users can delete their own todos" on public.todos;

create policy "Users can view their own todos"
  on public.todos for select
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own todos"
  on public.todos for insert
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own todos"
  on public.todos for update
  using ((select auth.uid()) = user_id);

create policy "Users can delete their own todos"
  on public.todos for delete
  using ((select auth.uid()) = user_id);

-- Fix RLS policies for notes table to use subquery for better performance
drop policy if exists "Users can view their own notes" on public.notes;
drop policy if exists "Users can insert their own notes" on public.notes;
drop policy if exists "Users can update their own notes" on public.notes;
drop policy if exists "Users can delete their own notes" on public.notes;

create policy "Users can view their own notes"
  on public.notes for select
  using ((select auth.uid()) = user_id);

create policy "Users can insert their own notes"
  on public.notes for insert
  with check ((select auth.uid()) = user_id);

create policy "Users can update their own notes"
  on public.notes for update
  using ((select auth.uid()) = user_id);

create policy "Users can delete their own notes"
  on public.notes for delete
  using ((select auth.uid()) = user_id);

-- Remove unused index
drop index if exists public.todos_order_idx;

-- Fix function search_path security issue
alter function public.handle_updated_at() set search_path = '';;
