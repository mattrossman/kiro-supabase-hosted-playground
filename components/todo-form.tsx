"use client";

import { useState, FormEvent } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";

interface TodoFormProps {
  onAddTodo: (text: string, priority: "low" | "medium" | "high") => void;
}

const priorityLabels = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export function TodoForm({ onAddTodo }: TodoFormProps) {
  const [inputValue, setInputValue] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("low");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedValue = inputValue.trim();
    if (trimmedValue) {
      onAddTodo(trimmedValue, priority);
      setInputValue("");
      setPriority("low");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        type="text"
        placeholder="Add a new todo..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        className="flex-1"
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="outline" className="gap-1">
            {priorityLabels[priority]}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem onClick={() => setPriority("low")}>
            Low
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setPriority("medium")}>
            Medium
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setPriority("high")}>
            High
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
      <Button type="submit">Add</Button>
    </form>
  );
}

