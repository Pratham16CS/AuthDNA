// src/pages/app/DashboardPage.tsx
import { useDashboard, useLogs } from "@/hooks/use-dashboard";
import { useUsage } from "@/hooks/use-usage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";

const COLORS: Record<string, string> = {
  ALLOW: "#22c55e",
  OTP: "#f59e0b",
  STEPUP: "#f97316",
  BLOCK: "#ef4444",
};

const decisionBadge: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  ALLOW: "default",
  OTP: "secondary",
  STEPUP: "outline",
  BLOCK: "destructive",
};

export default function DashboardPage() {
  const { stats, isLoading: statsLoading } = useDashboard();
  const { logs, isLoading: logsLoading } = useLogs({ limit: 8 });
  const { usage } = useUsage();

  if (statsLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i}><CardContent className="pt-6"><Skeleton className="h-16 w-full" /></CardContent></Card>
          ))}
        </div>
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  const pieData = stats
    ? [
        { name: "ALLOW", value: stats.allowed_logins },
        { name: "OTP", value: stats.otp_triggered },
        { name: "BLOCK", value: stats.blocked_logins },
      ].filter((d) => d.value > 0)
    : [];

  return (
    <div className="space-y-6">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Total Logins" value={stats?.total_logins ?? 0} icon="📊" />
        <StatCard title="Blocked" value={stats?.blocked_logins ?? 0} icon="🔴" />
        <StatCard title="OTP Triggered" value={stats?.otp_triggered ?? 0} icon="🟡" />
        <StatCard title="Avg Risk Score" value={`${stats?.avg_risk_score ?? 0}/100`} icon="📈" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Pie Chart */}
        <Card>
          <CardHeader><CardTitle className="text-base">Decision Distribution</CardTitle></CardHeader>
          <CardContent>
            {pieData.length > 0 ? (
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie data={pieData} cx="50%" cy="50%" innerRadius={55} outerRadius={90} dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                    {pieData.map((entry) => (
                      <Cell key={entry.name} fill={COLORS[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-muted-foreground text-center py-12">No data yet</p>
            )}
          </CardContent>
        </Card>

        {/* Usage Card */}
        <Card className="lg:col-span-2">
          <CardHeader><CardTitle className="text-base">API Usage</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            {usage ? (
              <>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Hourly Rate</span>
                    <span>{usage.hourly_calls_used} / {usage.hourly_rate_limit}</span>
                  </div>
                  <Progress value={(usage.hourly_calls_used / usage.hourly_rate_limit) * 100} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <MiniStat label="Total This Month" value={usage.total_calls_this_month.toLocaleString()} />
                  <MiniStat label="Avg Latency" value={`${usage.avg_latency_ms}ms`} />
                  <MiniStat label="Tier" value={usage.tier} />
                  <MiniStat label="Remaining/hr" value={usage.hourly_remaining.toString()} />
                </div>
              </>
            ) : (
              <Skeleton className="h-32 w-full" />
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Logs */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Recent Evaluations</CardTitle>
          <a href="/app/logs" className="text-sm text-primary hover:underline">View All →</a>
        </CardHeader>
        <CardContent>
          {logsLoading ? (
            <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-14 w-full" />)}</div>
          ) : logs.length > 0 ? (
            <div className="space-y-2">
              {logs.map((log, idx) => (
                <div key={idx} className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <Badge variant={decisionBadge[log.decision] || "secondary"}>{log.decision}</Badge>
                    <div>
                      <p className="text-sm font-medium">{log.user_id}</p>
                      <p className="text-xs text-muted-foreground">{log.country || "Unknown"} · {log.ip}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-mono">{log.score}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(log.timestamp).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-center py-8">No evaluations yet. Make your first API call!</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function StatCard({ title, value, icon }: { title: string; value: number | string; icon: string }) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold mt-1">{typeof value === "number" ? value.toLocaleString() : value}</p>
          </div>
          <span className="text-3xl">{icon}</span>
        </div>
      </CardContent>
    </Card>
  );
}

function MiniStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-muted rounded-lg p-3">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="text-sm font-semibold capitalize">{value}</p>
    </div>
  );
}