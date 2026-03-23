// src/pages/app/ApiKeysPage.tsx
import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export default function ApiKeysPage() {
  const { maskedApiKey, tenant, rotateKey } = useAuth();
  const [newKey, setNewKey] = useState<string | null>(null);
  const [rotating, setRotating] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleRotate = async () => {
    setRotating(true);
    try {
      const data = await rotateKey();
      setNewKey(data.new_api_key);
    } catch {
      toast.error("Failed to rotate key");
    } finally {
      setRotating(false);
    }
  };

  const copyNewKey = () => {
    if (newKey) {
      navigator.clipboard.writeText(newKey);
      toast.success("New API key copied!");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">API Keys</h2>

      <Alert>
        <AlertDescription>
          Your API key is only shown when created or rotated. If you've lost it, rotate to generate a new one.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Active Key</CardTitle>
          <CardDescription>Used for all API requests via the X-API-Key header</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between bg-muted rounded-lg p-4">
            <code className="font-mono text-sm">{maskedApiKey || "No key found"}</code>
            <Badge>Active</Badge>
          </div>

          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Total API Calls</span>
            <span className="font-medium">{tenant?.total_api_calls?.toLocaleString() || 0}</span>
          </div>

          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">🔄 Rotate Key</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Rotate API Key?</DialogTitle>
                <DialogDescription>
                  Your current key will be revoked immediately. Any service using the old key will stop working.
                </DialogDescription>
              </DialogHeader>

              {newKey ? (
                <div className="space-y-4">
                  <div className="bg-muted rounded-lg p-4 flex items-center gap-3 border border-green-500/30">
                    <code className="font-mono text-sm text-green-500 flex-1 break-all">{newKey}</code>
                    <Button size="sm" variant="secondary" onClick={copyNewKey}>📋 Copy</Button>
                  </div>
                  <Alert variant="destructive">
                    <AlertDescription>Save this now — it won't be shown again!</AlertDescription>
                  </Alert>
                </div>
              ) : null}

              <DialogFooter>
                {newKey ? (
                  <Button onClick={() => { setDialogOpen(false); setNewKey(null); }}>Done</Button>
                ) : (
                  <Button variant="destructive" onClick={handleRotate} disabled={rotating}>
                    {rotating ? "Rotating..." : "Yes, Rotate Key"}
                  </Button>
                )}
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </div>
  );
}