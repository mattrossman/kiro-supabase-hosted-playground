import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClient } from "@/lib/supabase/server";

interface TodoStats {
  total: number;
  completed: number;
  incomplete: number;
  completionPercentage: number;
  byPriority: {
    low: number;
    medium: number;
    high: number;
  };
}

interface TodoStatsCardProps {
  userId?: string;
}

export async function TodoStatsCard({ userId }: TodoStatsCardProps) {
  if (!userId) {
    return null;
  }

  const supabase = await createClient();

  const { data: stats, error } = await supabase.functions.invoke<TodoStats>("todo-stats");

  if (error || !stats) {
    return (
      <Card className="w-full max-w-2xl min-w-[500px]">
        <CardHeader>
          <CardTitle>Todo Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-destructive">
            {error?.message || "Failed to load statistics"}
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl min-w-[500px]">
      <CardHeader>
        <CardTitle>Todo Statistics</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{stats.total}</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Completed</p>
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {stats.completed}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Incomplete</p>
            <p className="text-2xl font-bold text-orange-600 dark:text-orange-400">
              {stats.incomplete}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Progress</p>
            <p className="text-2xl font-bold">{stats.completionPercentage}%</p>
          </div>
        </div>
        <div className="mt-6 pt-4 border-t">
          <p className="text-sm font-medium mb-3">By Priority</p>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Low</p>
              <p className="text-lg font-semibold">{stats.byPriority.low}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">Medium</p>
              <p className="text-lg font-semibold">{stats.byPriority.medium}</p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground">High</p>
              <p className="text-lg font-semibold">{stats.byPriority.high}</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
