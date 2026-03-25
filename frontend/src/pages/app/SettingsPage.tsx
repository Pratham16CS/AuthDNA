import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/context/AuthContext';

export default function SettingsPage() {
  const { tenant } = useAuth();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Settings</h1>

      <Card>
        <CardHeader><CardTitle>Tenant Profile</CardTitle></CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Company Name</p>
              <p className="font-medium text-lg">{tenant?.company_name}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Email</p>
              <p className="font-medium">{tenant?.email}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Tenant ID</p>
              <code className="font-mono bg-muted px-2 py-1 rounded text-xs">{tenant?.tenant_id}</code>
            </div>
            <div>
              <p className="text-muted-foreground">Plan</p>
              <Badge className="mt-1">{tenant?.tier?.toUpperCase()}</Badge>
            </div>
            <div>
              <p className="text-muted-foreground">Total API Calls</p>
              <p className="font-medium">{tenant?.total_api_calls?.toLocaleString()}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <Badge variant="outline" className={tenant?.is_active ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}>
                {tenant?.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Decision Thresholds</CardTitle></CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-2 px-3">Score Range</th>
                  <th className="py-2 px-3">Decision</th>
                  <th className="py-2 px-3">Action</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b"><td className="py-2 px-3">0 – 30</td><td className="py-2 px-3"><Badge className="bg-emerald-500">ALLOW</Badge></td><td className="py-2 px-3">Grant access</td></tr>
                <tr className="border-b"><td className="py-2 px-3">30 – 60</td><td className="py-2 px-3"><Badge className="bg-amber-500">OTP</Badge></td><td className="py-2 px-3">Send verification code</td></tr>
                <tr className="border-b"><td className="py-2 px-3">60 – 80</td><td className="py-2 px-3"><Badge className="bg-orange-500">STEPUP</Badge></td><td className="py-2 px-3">Require stronger auth</td></tr>
                <tr><td className="py-2 px-3">80 – 100</td><td className="py-2 px-3"><Badge className="bg-red-500">BLOCK</Badge></td><td className="py-2 px-3">Deny access</td></tr>
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}