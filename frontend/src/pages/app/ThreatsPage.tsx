// src/pages/app/ThreatsPage.tsx
import { useLogs } from "@/hooks/use-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";

export default function ThreatsPage() {
  const { logs, isLoading } = useLogs({ limit: 100 });
  const threats = logs.filter((l) => l.decision !== "ALLOW");

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Live Threat Feed</h2>
      <p className="text-muted-foreground text-sm">
        Showing blocked, OTP, and step-up logins — {threats.length} threats detected
      </p>

      {isLoading ? (
        <div className="space-y-4">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-32 w-full" />)}</div>
      ) : threats.length > 0 ? (
        <div className="space-y-4">
          {threats.map((log, idx) => (
            <Card key={idx}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant={log.decision === "BLOCK" ? "destructive" : "secondary"} className="text-sm">
                      {log.decision}
                    </Badge>
                    <div>
                      <p className="font-mono font-medium">{log.user_id}</p>
                      <p className="text-sm text-muted-foreground">
                        {log.country || "Unknown"} · {log.ip} · {log.resource}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-red-500">{log.score}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                </div>
                <p className="mt-3 text-sm text-muted-foreground italic bg-muted rounded-lg p-3">
                  "{log.explanation}"
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-4xl mb-4">🎉</p>
            <p className="text-muted-foreground">No threats detected. Your users are safe!</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}