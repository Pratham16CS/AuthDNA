// src/pages/app/UsagePage.tsx
import { useUsage, useUsageHistory } from "@/hooks/use-usage";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function UsagePage() {
  const { usage, isLoading } = useUsage();
  const { history } = useUsageHistory(6);

  if (isLoading) return <Skeleton className="h-96 w-full" />;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Usage & Billing</h2>
        {usage && <Badge variant="secondary" className="capitalize text-sm">{usage.tier} tier</Badge>}
      </div>

      {usage && (
        <Card>
          <CardHeader><CardTitle className="text-base">This Month — {usage.period}</CardTitle></CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Hourly Rate</span>
                <span>{usage.hourly_calls_used} / {usage.hourly_rate_limit}</span>
              </div>
              <Progress value={(usage.hourly_calls_used / usage.hourly_rate_limit) * 100} />
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Stat label="Total Calls" value={usage.total_calls_this_month.toLocaleString()} />
              <Stat label="ALLOW" value={usage.breakdown.allow.toLocaleString()} color="text-green-500" />
              <Stat label="BLOCK" value={usage.breakdown.block.toLocaleString()} color="text-red-500" />
              <Stat label="OTP" value={usage.breakdown.otp.toLocaleString()} color="text-yellow-500" />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <Stat label="Avg Latency" value={`${usage.avg_latency_ms}ms`} />
              <Stat label="Avg Risk Score" value={`${usage.avg_risk_score}/100`} />
            </div>
          </CardContent>
        </Card>
      )}

      {history && history.history.length > 0 && (
        <Card>
          <CardHeader><CardTitle className="text-base">Usage History</CardTitle></CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={history.history.reverse()}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="period" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                <Tooltip />
                <Bar dataKey="total_calls" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function Stat({ label, value, color }: { label: string; value: string; color?: string }) {
  return (
    <div className="bg-muted rounded-lg p-4">
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className={`text-lg font-bold ${color || ""}`}>{value}</p>
    </div>
  );
}