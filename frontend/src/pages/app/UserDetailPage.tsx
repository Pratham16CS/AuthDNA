// src/pages/app/UserDetailPage.tsx
import { useParams, useNavigate } from "react-router-dom";
import { useUserDNA, useLogs } from "@/hooks/use-dashboard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

export default function UserDetailPage() {
  const { userId } = useParams<{ userId: string }>();
  const decodedUserId = userId ? decodeURIComponent(userId) : "";
  const { dna, isLoading: dnaLoading, error: dnaError } = useUserDNA(decodedUserId);
  const { logs, isLoading: logsLoading } = useLogs({ limit: 20, userId: decodedUserId });
  const navigate = useNavigate();

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => navigate("/app/users")}>← Back</Button>
        <h2 className="text-xl font-semibold">👤 {decodedUserId}</h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* DNA Profile */}
        <Card>
          <CardHeader><CardTitle className="text-base">Behavioral DNA</CardTitle></CardHeader>
          <CardContent>
            {dnaLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : dnaError ? (
              <p className="text-muted-foreground text-sm">{dnaError}</p>
            ) : dna ? (
              <div className="space-y-4">
                <InfoRow label="Total Logins" value={dna.login_count.toString()} />
                <InfoRow label="Avg Login Hour" value={`${dna.avg_login_hour.toFixed(1)}:00`} />
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Known Devices</p>
                  <div className="flex gap-1 flex-wrap">
                    {dna.common_devices.map((d, i) => <Badge key={i} variant="outline">{d}</Badge>)}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Known Locations</p>
                  <div className="flex gap-1 flex-wrap">
                    {dna.common_locations.map((l, i) => <Badge key={i} variant="secondary">{l}</Badge>)}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Resources Accessed</p>
                  <div className="flex gap-1 flex-wrap">
                    {dna.common_resources.map((r, i) => <Badge key={i} variant="outline">{r}</Badge>)}
                  </div>
                </div>
                <InfoRow label="Last Seen" value={dna.last_seen ? new Date(dna.last_seen).toLocaleString() : "—"} />
              </div>
            ) : null}
          </CardContent>
        </Card>

        {/* Login History */}
        <Card>
          <CardHeader><CardTitle className="text-base">Login History</CardTitle></CardHeader>
          <CardContent>
            {logsLoading ? (
              <div className="space-y-3">{[1, 2, 3].map((i) => <Skeleton key={i} className="h-16 w-full" />)}</div>
            ) : logs.length > 0 ? (
              <div className="space-y-3 max-h-[500px] overflow-y-auto">
                {logs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-3 border-l-2 pl-4 py-2"
                    style={{ borderColor: log.decision === "ALLOW" ? "#22c55e" : log.decision === "BLOCK" ? "#ef4444" : "#f59e0b" }}>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={log.decision === "BLOCK" ? "destructive" : log.decision === "OTP" ? "secondary" : "default"} className="text-xs">
                          {log.decision}
                        </Badge>
                        <span className="font-mono text-sm">{log.score}</span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        {log.country || "Unknown"} · {log.ip} · {log.resource}
                      </p>
                      <p className="text-xs text-muted-foreground italic mt-1">{log.explanation}</p>
                    </div>
                    <p className="text-xs text-muted-foreground shrink-0">
                      {new Date(log.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-8">No login history</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-center">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-medium">{value}</span>
    </div>
  );
}