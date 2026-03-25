import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getUserDna, getLogs, type UserDNA, type LoginLog } from '@/api/dashboard';

export default function UserDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [dna, setDna] = useState<UserDNA | null>(null);
  const [logs, setLogs] = useState<LoginLog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    Promise.all([
      getUserDna(id).then(r => setDna(r.data.profile)).catch(() => {}),
      getLogs({ user_id: id, limit: 20 }).then(r => setLogs(r.data.logs || [])).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={() => navigate('/app/users')}>← Back</Button>
        <h1 className="text-3xl font-bold">{id}</h1>
      </div>

      {dna ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader><CardTitle>DNA Profile</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div><span className="text-muted-foreground text-sm">Login Count:</span> <strong>{dna.login_count}</strong></div>
              <div><span className="text-muted-foreground text-sm">Avg Login Hour:</span> <strong>{dna.avg_login_hour?.toFixed(1)}:00</strong></div>
              <div><span className="text-muted-foreground text-sm">First Seen:</span> <strong>{dna.first_seen ? new Date(dna.first_seen).toLocaleDateString() : '-'}</strong></div>
              <div><span className="text-muted-foreground text-sm">Last Login:</span> <strong>{dna.last_login_timestamp ? new Date(dna.last_login_timestamp).toLocaleString() : '-'}</strong></div>
              <div><span className="text-muted-foreground text-sm">Last IP:</span> <strong className="font-mono">{dna.last_login_ip}</strong></div>
              <div><span className="text-muted-foreground text-sm">Last Country:</span> <strong>{dna.last_login_country}</strong></div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Known Signals</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Devices ({dna.known_devices.length})</p>
                <div className="flex flex-wrap gap-1">
                  {dna.known_devices.map((d, i) => <Badge key={i} variant="outline" className="text-xs">{d.substring(0, 24)}</Badge>)}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Countries ({dna.known_countries.length})</p>
                <div className="flex flex-wrap gap-1">
                  {dna.known_countries.map((c, i) => <Badge key={i} variant="secondary" className="text-xs">{c}</Badge>)}
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Resources ({dna.common_resources.length})</p>
                <div className="flex flex-wrap gap-1">
                  {dna.common_resources.map((r, i) => <Badge key={i} className="text-xs bg-teal-100 text-teal-800">{r}</Badge>)}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <Card><CardContent className="py-8 text-center text-muted-foreground">No DNA profile found</CardContent></Card>
      )}

      <Card>
        <CardHeader><CardTitle>Login History</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-2 px-2">Time</th>
                  <th className="py-2 px-2">IP</th>
                  <th className="py-2 px-2">Country</th>
                  <th className="py-2 px-2">Score</th>
                  <th className="py-2 px-2">Decision</th>
                </tr>
              </thead>
              <tbody>
                {logs.map((l, i) => (
                  <tr key={i} className="border-b">
                    <td className="py-2 px-2 text-xs">{l.timestamp ? new Date(l.timestamp).toLocaleString() : '-'}</td>
                    <td className="py-2 px-2 font-mono text-xs">{l.ip}</td>
                    <td className="py-2 px-2">{l.country}</td>
                    <td className="py-2 px-2 font-bold">{l.score}</td>
                    <td className="py-2 px-2"><Badge variant="outline">{l.decision}</Badge></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}