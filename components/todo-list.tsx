"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TodoItem, Todo } from "@/components/todo-item";
import { TodoForm } from "@/components/todo-form";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/database.types";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";

type TodoRow = Tables<"todos">;

interface TodoListProps {
  initialTodos: TodoRow[];
  userId?: string;
}

function mapTodoFromDb(todo: TodoRow): Todo {
  return {
    id: todo.id,
    text: todo.content,
    completed: todo.completed,
    priority: todo.priority as "low" | "medium" | "high",
    order: todo.order,
  };
}

export function TodoList({ initialTodos, userId }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>(
    initialTodos.map(mapTodoFromDb).sort((a, b) => a.order - b.order)
  );
  const supabase = createClient();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddTodo = async (text: string, priority: "low" | "medium" | "high") => {
    if (!userId) return;

    const maxOrder = todos.length > 0 ? Math.max(...todos.map((t) => t.order)) : 0;

    const { data, error } = await supabase
      .from("todos")
      .insert({ content: text, user_id: userId, priority, order: maxOrder + 1 })
      .select()
      .single();

    if (error) {
      console.error("Error adding todo:", error);
    } else {
      setTodos([...todos, mapTodoFromDb(data)]);
    }
  };

  const handleToggleTodo = async (id: string) => {
    const todo = todos.find((t) => t.id === id);
    if (!todo) return;

    const { error } = await supabase
      .from("todos")
      .update({ completed: !todo.completed })
      .eq("id", id);

    if (error) {
      console.error("Error updating todo:", error);
    } else {
      setTodos(todos.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
    }
  };

  const handleDeleteTodo = async (id: string) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) {
      console.error("Error deleting todo:", error);
    } else {
      setTodos(todos.filter((todo) => todo.id !== id));
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) return;

    const oldIndex = todos.findIndex((t) => t.id === active.id);
    const newIndex = todos.findIndex((t) => t.id === over.id);

    const newTodos = arrayMove(todos, oldIndex, newIndex);
    
    // Update local state immediately for smooth UX
    setTodos(newTodos);

    // Update order values in database
    const updates = newTodos.map((todo, index) => ({
      id: todo.id,
      order: index,
    }));

    for (const update of updates) {
      await supabase
        .from("todos")
        .update({ order: update.order })
        .eq("id", update.id);
    }
  };

  if (!userId) {
    return (
      <Card className="w-full max-w-2xl min-w-[500px]">
        <CardHeader>
          <CardTitle>Todo List</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Please sign in to view your todos
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl min-w-[500px]">
      <CardHeader>
        <CardTitle>Todo List</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <TodoForm onAddTodo={handleAddTodo} />
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={todos} strategy={verticalListSortingStrategy}>
            <div className="space-y-1">
              {todos.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-4">
                  No todos yet. Add one above to get started!
                </p>
              ) : (
                todos.map((todo) => (
                  <TodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggleTodo}
                    onDelete={handleDeleteTodo}
                  />
                ))
              )}
            </div>
          </SortableContext>
        </DndContext>
      </CardContent>
    </Card>
  );
}

