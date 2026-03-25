import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useWebhooks } from '@/hooks/use-webhooks';

export default function WebhooksPage() {
  const { config, loading, error, update, remove, test } = useWebhooks();
  const [url, setUrl] = useState('');
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);
  const [testResult, setTestResult] = useState<boolean | null>(null);

  const handleSave = async () => {
    setSaving(true);
    await update(url);
    setUrl('');
    setSaving(false);
  };

  const handleTest = async () => {
    setTesting(true);
    setTestResult(null);
    const ok = await test();
    setTestResult(ok);
    setTesting(false);
  };

  if (loading) return <div className="flex justify-center py-12"><div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600" /></div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Webhooks</h1>

      <Card>
        <CardHeader><CardTitle>Webhook Configuration</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {config?.url ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <code className="bg-muted px-3 py-1.5 rounded text-sm flex-1">{config.url}</code>
                <Badge className="bg-emerald-100 text-emerald-700">Active</Badge>
              </div>
              <div className="flex flex-wrap gap-1">
                {config.events.map(e => (
                  <Badge key={e} variant="outline" className="text-xs">{e}</Badge>
                ))}
              </div>
              <div className="flex gap-2">
                <Button size="sm" onClick={handleTest} disabled={testing}>
                  {testing ? 'Sending...' : 'Test Webhook'}
                </Button>
                <Button size="sm" variant="destructive" onClick={remove}>Remove</Button>
              </div>
              {testResult !== null && (
                <p className={`text-sm ${testResult ? 'text-emerald-600' : 'text-red-600'}`}>
                  {testResult ? '✅ Webhook delivered successfully!' : '❌ Delivery failed'}
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-muted-foreground text-sm">No webhook configured</p>
              <div className="flex gap-2">
                <Input
                  placeholder="https://your-server.com/webhook"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                />
                <Button onClick={handleSave} disabled={!url || saving}>
                  {saving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}