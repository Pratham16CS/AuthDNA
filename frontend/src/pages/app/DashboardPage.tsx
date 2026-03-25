import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getStats } from '@/api/dashboard';
import { useAuth } from '@/context/AuthContext';

interface Stats {
  total_logins: number;
  blocked: number;
  otp_triggered: number;
  stepup_count: number;
  avg_risk_score: number;
  decisions: Record<string, number>;
  recent_evaluations: any[];
  usage: {
    hourly_rate: number; hourly_limit: number; remaining: number;
    total_this_month: number; avg_latency: number; tier: string;
  };
}

const DECISION_COLORS: Record<string, string> = {
  ALLOW: 'bg-emerald-500', OTP: 'bg-amber-500', STEPUP: 'bg-orange-500', BLOCK: 'bg-red-500',
};
const DECISION_BG: Record<string, string> = {
  ALLOW: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/30',
  OTP: 'bg-amber-500/10 text-amber-700 border-amber-500/30',
  STEPUP: 'bg-orange-500/10 text-orange-700 border-orange-500/30',
  BLOCK: 'bg-red-500/10 text-red-700 border-red-500/30',
};

export default function DashboardPage() {
  const { tenant } = useAuth();
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getStats().then(r => setStats(r.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" /></div>;
  if (!stats) return <div className="text-center py-12 text-muted-foreground">Failed to load dashboard</div>;

  const total = Object.values(stats.decisions).reduce((a, b) => a + b, 0) || 1;
  const ratePercent = Math.min((stats.usage.hourly_rate / stats.usage.hourly_limit) * 100, 100);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back, {tenant?.company_name}</p>
        </div>
        <Badge variant="outline" className="text-sm px-3 py-1">
          {tenant?.tier?.toUpperCase()} Plan
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-md bg-gradient-to-br from-teal-50 to-white dark:from-teal-950/30 dark:to-zinc-900">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Total Evaluations</p>
            <p className="text-3xl font-bold text-teal-700 dark:text-teal-400">{stats.total_logins.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-red-50 to-white dark:from-red-950/30 dark:to-zinc-900">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Blocked</p>
            <p className="text-3xl font-bold text-red-600">{stats.blocked}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-amber-50 to-white dark:from-amber-950/30 dark:to-zinc-900">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">OTP Triggered</p>
            <p className="text-3xl font-bold text-amber-600">{stats.otp_triggered}</p>
          </CardContent>
        </Card>
        <Card className="border-0 shadow-md bg-gradient-to-br from-blue-50 to-white dark:from-blue-950/30 dark:to-zinc-900">
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground">Avg Risk Score</p>
            <p className="text-3xl font-bold text-blue-600">{stats.avg_risk_score.toFixed(1)}<span className="text-lg text-muted-foreground">/100</span></p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Decision Distribution */}
        <Card className="shadow-md">
          <CardHeader><CardTitle className="text-lg">Decision Distribution</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(stats.decisions).map(([dec, count]) => (
                <div key={dec} className="space-y-1">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{dec}</span>
                    <span className="text-muted-foreground">{count} ({Math.round((count/total)*100)}%)</span>
                  </div>
                  <div className="h-2 rounded-full bg-zinc-100 dark:bg-zinc-800 overflow-hidden">
                    <div className={`h-full rounded-full ${DECISION_COLORS[dec] || 'bg-zinc-400'}`}
                         style={{width: `${Math.round((count/total)*100)}%`}} />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* API Usage */}
        <Card className="shadow-md lg:col-span-2">
          <CardHeader><CardTitle className="text-lg">API Usage</CardTitle></CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Hourly Rate</span>
                  <span className={ratePercent > 80 ? 'text-red-500 font-bold' : ''}>
                    {stats.usage.hourly_rate} / {stats.usage.hourly_limit}
                  </span>
                </div>
                <Progress value={ratePercent} className="h-3" />
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">This Month</p>
                  <p className="text-xl font-bold">{stats.usage.total_this_month}</p>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Avg Latency</p>
                  <p className="text-xl font-bold">{stats.usage.avg_latency}ms</p>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Plan</p>
                  <p className="text-xl font-bold capitalize">{stats.usage.tier}</p>
                </div>
                <div className="bg-zinc-50 dark:bg-zinc-800/50 rounded-lg p-3">
                  <p className="text-xs text-muted-foreground">Remaining/hr</p>
                  <p className="text-xl font-bold">{stats.usage.remaining}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Evaluations */}
      <Card className="shadow-md">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">Recent Evaluations</CardTitle>
          <a href="/app/logs" className="text-sm text-teal-600 hover:underline">View All →</a>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.recent_evaluations.length === 0 && (
              <p className="text-center text-muted-foreground py-8">No evaluations yet. Make your first API call!</p>
            )}
            {stats.recent_evaluations.map((ev, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/50 hover:bg-zinc-100 dark:hover:bg-zinc-800 transition">
                <div className="flex items-center gap-3">
                  <Badge className={`${DECISION_BG[ev.decision] || ''} text-xs font-bold px-2 py-0.5`}>
                    {ev.decision}
                  </Badge>
                  <div>
                    <p className="font-medium text-sm">{ev.user_id}</p>
                    <p className="text-xs text-muted-foreground">{ev.country} · {ev.ip}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`text-lg font-bold ${
                    ev.score < 30 ? 'text-emerald-600' : ev.score < 60 ? 'text-amber-600' : 'text-red-600'
                  }`}>{ev.score}</p>
                  <p className="text-xs text-muted-foreground">
                    {ev.timestamp ? new Date(ev.timestamp).toLocaleTimeString() : ''}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}