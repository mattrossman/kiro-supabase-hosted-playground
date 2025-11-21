-- Revert content column back to text (previous rename didn't apply)
alter table public.todos rename column content to text;
