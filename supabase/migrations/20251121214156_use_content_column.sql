-- Ensure todos table uses content column (not text)
-- This migration documents the current remote state where the column is named 'content'
-- No actual changes needed as remote DB already has this schema

-- For reference, the current todos table structure:
-- - id: uuid (primary key)
-- - content: text (the todo text)
-- - completed: boolean
-- - user_id: uuid (foreign key to auth.users)
-- - created_at: timestamptz
-- - updated_at: timestamptz
-- - priority: text (check constraint: 'low', 'medium', 'high')
-- - order: integer

-- This migration serves as documentation that we're using 'content' not 'text'
