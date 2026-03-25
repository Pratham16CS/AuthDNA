import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { useUsage } from '@/hooks/use-usage';

export default function UsagePage() {
  const { current, history, loading, error } = useUsage();

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" /></div>;
  if (error) return <p className="text-red-500 text-center py-8">{error}</p>;
  if (!current) return <p className="text-center py-8 text-muted-foreground">No usage data yet</p>;

  const ratePercent = Math.min((current.hourly_rate / current.hourly_limit) * 100, 100);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Usage</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader><CardTitle>Current Period</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Hourly Rate</span>
                <span>{current.hourly_rate} / {current.hourly_limit}</span>
              </div>
              <Progress value={ratePercent} className="h-3" />
            </div>
            <div className="grid grid-cols-2 gap-3 text-sm">
              <div className="bg-muted rounded-lg p-3">
                <p className="text-muted-foreground text-xs">Total Calls</p>
                <p className="text-xl font-bold">{current.total_calls}</p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-muted-foreground text-xs">Avg Latency</p>
                <p className="text-xl font-bold">{current.avg_latency_ms}ms</p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-muted-foreground text-xs">Avg Score</p>
                <p className="text-xl font-bold">{current.avg_score?.toFixed(1)}</p>
              </div>
              <div className="bg-muted rounded-lg p-3">
                <p className="text-muted-foreground text-xs">Plan</p>
                <Badge className="mt-1">{current.tier}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Decision Breakdown</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {[
                { label: 'ALLOW', count: current.allow_count, color: 'bg-emerald-500' },
                { label: 'OTP', count: current.otp_count, color: 'bg-amber-500' },
                { label: 'STEPUP', count: current.stepup_count, color: 'bg-orange-500' },
                { label: 'BLOCK', count: current.block_count, color: 'bg-red-500' },
              ].map(d => {
                const pct = current.total_calls > 0 ? Math.round((d.count / current.total_calls) * 100) : 0;
                return (
                  <div key={d.label}>
                    <div className="flex justify-between text-sm mb-1">
                      <span>{d.label}</span>
                      <span>{d.count} ({pct}%)</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className={`h-full rounded-full ${d.color}`} style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>

      {history.length > 0 && (
        <Card>
          <CardHeader><CardTitle>Monthly History</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left text-muted-foreground">
                    <th className="py-2 px-2">Period</th>
                    <th className="py-2 px-2">Total</th>
                    <th className="py-2 px-2">Allow</th>
                    <th className="py-2 px-2">Block</th>
                    <th className="py-2 px-2">Avg Latency</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h, i) => (
                    <tr key={i} className="border-b">
                      <td className="py-2 px-2 font-medium">{h.period}</td>
                      <td className="py-2 px-2">{h.total_calls}</td>
                      <td className="py-2 px-2 text-emerald-600">{h.allow_count}</td>
                      <td className="py-2 px-2 text-red-600">{h.block_count}</td>
                      <td className="py-2 px-2">{h.avg_latency_ms}ms</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}