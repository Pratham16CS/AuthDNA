// src/pages/app/WebhooksPage.tsx
import { useState } from "react";
import { useWebhooks } from "@/hooks/use-webhooks";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

export default function WebhooksPage() {
  const { webhook, isLoading, updateWebhook, deleteWebhook, testWebhook } = useWebhooks();
  const [url, setUrl] = useState("");
  const [saving, setSaving] = useState(false);
  const [testing, setTesting] = useState(false);

  const handleSave = async () => {
    if (!url) return;
    setSaving(true);
    try {
      await updateWebhook(url);
      setUrl("");
    } finally {
      setSaving(false);
    }
  };

  const handleTest = async () => {
    setTesting(true);
    try { await testWebhook(); } finally { setTesting(false); }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold">Webhook Configuration</h2>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Webhook URL</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {webhook?.webhook_url ? (
            <div className="bg-muted rounded-lg p-4 flex items-center justify-between">
              <code className="font-mono text-sm break-all">{webhook.webhook_url}</code>
              <Badge variant="default">Active</Badge>
            </div>
          ) : (
            <p className="text-muted-foreground">No webhook configured</p>
          )}

          <div className="flex gap-2">
            <Input
              placeholder="https://your-server.com/webhook"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
            />
            <Button onClick={handleSave} disabled={saving || !url}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button variant="secondary" onClick={handleTest} disabled={testing || !webhook?.webhook_url}>
              {testing ? "Sending..." : "🧪 Test Webhook"}
            </Button>
            {webhook?.webhook_url && (
              <Button variant="destructive" onClick={deleteWebhook}>Remove</Button>
            )}
          </div>

          <div>
            <Label className="text-sm text-muted-foreground">Events delivered:</Label>
            <div className="flex gap-2 mt-1">
              {["risk.block", "risk.stepup", "risk.otp"].map((e) => (
                <Badge key={e} variant="outline">{e}</Badge>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}