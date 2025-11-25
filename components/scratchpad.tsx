"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import type { Tables } from "@/lib/supabase/database.types";

type NoteRow = Tables<"notes">;

interface ScratchpadProps {
  initialNote: NoteRow | null;
  userId?: string;
}

export function Scratchpad({ initialNote, userId }: ScratchpadProps) {
  const [content, setContent] = useState(initialNote?.text || "");
  const [noteId, setNoteId] = useState(initialNote?.id);
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanged, setHasChanged] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    if (!userId || !hasChanged) return;

    const timeoutId = setTimeout(async () => {
      setIsSaving(true);
      
      if (noteId) {
        await supabase
          .from("notes")
          .update({ text: content, updated_at: new Date().toISOString() })
          .eq("id", noteId);
      } else {
        const { data } = await supabase
          .from("notes")
          .insert({ text: content, user_id: userId })
          .select()
          .single();
        
        if (data) {
          setNoteId(data.id);
        }
      }
      
      setIsSaving(false);
      setHasChanged(false);
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [content, userId, noteId, supabase, hasChanged]);

  if (!userId) {
    return (
      <Card className="w-full max-w-2xl min-w-[500px]">
        <CardHeader>
          <CardTitle>Scratchpad</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-4">
            Please sign in to use the scratchpad
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl min-w-[500px]">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>Scratchpad</span>
          {isSaving && (
            <span className="text-xs text-muted-foreground font-normal">Saving...</span>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Textarea
          value={content}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => {
            setContent(e.target.value);
            setHasChanged(true);
          }}
          placeholder="Jot down your thoughts, ideas, or quick notes here..."
          className="min-h-[120px] resize-none"
        />
      </CardContent>
    </Card>
  );
}
