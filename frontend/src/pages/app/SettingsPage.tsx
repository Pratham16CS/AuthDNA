// src/pages/app/SettingsPage.tsx
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function SettingsPage() {
  const { tenant } = useAuth();

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Settings</h2>

      <Card>
        <CardHeader><CardTitle className="text-base">Company Profile</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <Row label="Company Name" value={tenant?.company_name || "—"} />
          <Row label="Email" value={tenant?.email || "—"} />
          <Row label="Tenant ID" value={tenant?.tenant_id || "—"} mono />
          <Row label="Plan" value={<Badge variant="secondary" className="capitalize">{tenant?.tier}</Badge>} />
          <Row label="Created" value={tenant?.created_at ? new Date(tenant.created_at).toLocaleDateString() : "—"} />
          <Row label="Total API Calls" value={tenant?.total_api_calls?.toLocaleString() || "0"} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle className="text-base">Decision Thresholds</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <Row label="0 – 30" value={<Badge>ALLOW</Badge>} />
          <Row label="30 – 60" value={<Badge variant="secondary">OTP</Badge>} />
          <Row label="60 – 80" value={<Badge variant="outline">STEPUP</Badge>} />
          <Row label="80 – 100" value={<Badge variant="destructive">BLOCK</Badge>} />
          <Separator />
          <p className="text-xs text-muted-foreground">Custom thresholds available on Enterprise plan.</p>
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ label, value, mono }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className={`text-sm font-medium ${mono ? "font-mono text-xs" : ""}`}>{value}</span>
    </div>
  );
}