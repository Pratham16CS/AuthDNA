import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { useAuth } from '@/context/AuthContext';
import { rotateKey } from '@/api/auth';

export default function ApiKeysPage() {
  const { tenant, login } = useAuth();
  const [newKey, setNewKey] = useState<string | null>(null);
  const [rotating, setRotating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleRotate = async () => {
    setRotating(true);
    try {
      const res = await rotateKey();
      const key = res.data.api_key;
      setNewKey(key);
      await login(key);
    } catch (err) {
      console.error('Rotate failed:', err);
    } finally {
      setRotating(false);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">API Keys</h1>

      <Card>
        <CardHeader><CardTitle>Current API Key</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-3">
            <code className="bg-muted px-4 py-2 rounded text-sm font-mono">
              {tenant?.key_prefix || 'sk_live_xxxx'}...
            </code>
            <Badge variant="outline" className="bg-emerald-50 text-emerald-700 border-emerald-300">Active</Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Total API calls: <strong>{tenant?.total_api_calls?.toLocaleString() || 0}</strong>
          </p>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="destructive" size="sm">Rotate Key</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rotate API Key</DialogTitle>
              </DialogHeader>
              {!newKey ? (
                <>
                  <p className="text-sm text-muted-foreground">
                    This will revoke your current key and generate a new one.
                    All existing integrations will stop working until updated.
                  </p>
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button variant="destructive" onClick={handleRotate} disabled={rotating}>
                      {rotating ? 'Rotating...' : 'Confirm Rotate'}
                    </Button>
                  </DialogFooter>
                </>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm font-bold text-red-600">⚠️ Copy this key now — it won't be shown again!</p>
                  <code className="block bg-zinc-950 text-green-400 p-3 rounded text-sm font-mono break-all">
                    {newKey}
                  </code>
                  <Button className="w-full" onClick={() => {
                    navigator.clipboard.writeText(newKey);
                  }}>
                    Copy to Clipboard
                  </Button>
                  <Button variant="outline" className="w-full" onClick={() => {
                    setNewKey(null);
                    setDialogOpen(false);
                  }}>
                    Done
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}