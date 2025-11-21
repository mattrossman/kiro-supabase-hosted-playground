-- Add order column to todos table
ALTER TABLE todos ADD COLUMN "order" INTEGER;

-- Set initial order values based on created_at
UPDATE todos SET "order" = row_number FROM (
  SELECT id, ROW_NUMBER() OVER (PARTITION BY user_id ORDER BY created_at) as row_number
  FROM todos
) AS numbered
WHERE todos.id = numbered.id;

-- Make order column NOT NULL with default
ALTER TABLE todos ALTER COLUMN "order" SET NOT NULL;
ALTER TABLE todos ALTER COLUMN "order" SET DEFAULT 0;;
