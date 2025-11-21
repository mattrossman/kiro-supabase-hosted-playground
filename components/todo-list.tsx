"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
    text: todo.title,
    completed: todo.completed || false,
    priority: (todo.priority as "low" | "medium" | "high") || "low",
    position: todo.position || 0,
  };
}

export function TodoList({ initialTodos, userId }: TodoListProps) {
  const [todos, setTodos] = useState<Todo[]>(
    initialTodos.map(mapTodoFromDb).sort((a, b) => a.position - b.position)
  );
  const supabase = createClient();
  const router = useRouter();

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleAddTodo = async (text: string, priority: "low" | "medium" | "high") => {
    if (!userId) return;

    const { data, error } = await supabase
      .from("todos")
      .insert({ title: text, user_id: userId, priority, position: 0 })
      .select()
      .single();

    if (error) {
      console.error("Error adding todo:", error);
    } else {
      const newTodos = [mapTodoFromDb(data), ...todos].map((todo, index) => ({
        ...todo,
        position: index,
      }));
      setTodos(newTodos);
      
      // Update positions in database
      await Promise.all(
        newTodos.map((todo) =>
          supabase.from("todos").update({ position: todo.position }).eq("id", todo.id)
        )
      );
      router.refresh();
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
      router.refresh();
    }
  };

  const handleDeleteTodo = async (id: string) => {
    const { error } = await supabase.from("todos").delete().eq("id", id);

    if (error) {
      console.error("Error deleting todo:", error);
    } else {
      setTodos(todos.filter((todo) => todo.id !== id));
      router.refresh();
    }
  };

  const handlePriorityChange = async (id: string, priority: "low" | "medium" | "high") => {
    const { error } = await supabase
      .from("todos")
      .update({ priority })
      .eq("id", id);

    if (error) {
      console.error("Error updating priority:", error);
    } else {
      setTodos(todos.map((t) => (t.id === id ? { ...t, priority } : t)));
      router.refresh();
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = todos.findIndex((todo) => todo.id === active.id);
      const newIndex = todos.findIndex((todo) => todo.id === over.id);

      const newTodos = arrayMove(todos, oldIndex, newIndex).map((todo, index) => ({
        ...todo,
        position: index,
      }));

      setTodos(newTodos);

      // Update positions in database
      await Promise.all(
        newTodos.map((todo) =>
          supabase.from("todos").update({ position: todo.position }).eq("id", todo.id)
        )
      );
      router.refresh();
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
          <SortableContext items={todos.map((t) => t.id)} strategy={verticalListSortingStrategy}>
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
                    onPriorityChange={handlePriorityChange}
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

