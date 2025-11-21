import { createClient } from "jsr:@supabase/supabase-js@2";

Deno.serve(async (req) => {
  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Missing authorization header" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
      error: userError,
    } = await supabaseClient.auth.getUser();

    if (userError || !user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const { data: todos, error: todosError } = await supabaseClient
      .from("todos")
      .select("completed, priority")
      .eq("user_id", user.id);

    if (todosError) {
      throw todosError;
    }

    const total = todos.length;
    const completed = todos.filter((t) => t.completed).length;
    const incomplete = total - completed;
    const completionPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    const byPriority = {
      low: todos.filter((t) => t.priority === "low").length,
      medium: todos.filter((t) => t.priority === "medium").length,
      high: todos.filter((t) => t.priority === "high").length,
    };

    const stats = {
      total,
      completed,
      incomplete,
      completionPercentage,
      byPriority,
    };

    return new Response(JSON.stringify(stats), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
});
