// src/pages/app/PlaygroundPage.tsx
import { useState } from "react";
import evaluateAPI, { type EvaluateResponse } from "@/api/evaluate";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";

export default function PlaygroundPage() {
  const [form, setForm] = useState({
    userId: "alice@demo.com",
    ip: "49.36.128.100",
    deviceFp: "chrome-win-1920x1080",
    resource: "general",
    failedAttempts: 0,
  });
  const [result, setResult] = useState<EvaluateResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const data = await evaluateAPI.evaluateLogin(form);
      setResult(data);
      toast.success(`Decision: ${data.decision} (Score: ${data.score})`);
    } catch (err: any) {
      toast.error(err.response?.data?.detail?.message || "Evaluation failed");
    } finally {
      setIsLoading(false);
    }
  };

  const loadPreset = (key: string) => {
    const preset = evaluateAPI.presets[key];
    if (preset) {
      setForm({
        userId: preset.userId,
        ip: preset.ip,
        deviceFp: preset.deviceFp,
        resource: preset.resource,
        failedAttempts: preset.failedAttempts,
      });
      setResult(null);
    }
  };

  const scoreColor = (score: number) => {
    if (score <= 30) return "text-green-500";
    if (score <= 60) return "text-yellow-500";
    if (score <= 80) return "text-orange-500";
    return "text-red-500";
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">API Playground</h2>
        <p className="text-muted-foreground text-sm">Test the evaluate endpoint from your dashboard</p>
      </div>

      {/* Presets */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(evaluateAPI.presets).map(([key, preset]) => (
          <Button key={key} variant="outline" size="sm" onClick={() => loadPreset(key)}>
            ▶ {preset.label}
          </Button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request */}
        <Card>
          <CardHeader><CardTitle className="text-base">Request Body</CardTitle></CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label>user_id</Label>
                <Input value={form.userId} onChange={(e) => setForm({ ...form, userId: e.target.value })} className="font-mono" />
              </div>
              <div className="space-y-2">
                <Label>ip</Label>
                <Input value={form.ip} onChange={(e) => setForm({ ...form, ip: e.target.value })} className="font-mono" />
              </div>
              <div className="space-y-2">
                <Label>device_fp</Label>
                <Input value={form.deviceFp} onChange={(e) => setForm({ ...form, deviceFp: e.target.value })} className="font-mono" />
              </div>
              <div className="space-y-2">
                <Label>resource</Label>
                <Select value={form.resource} onValueChange={(v) => setForm({ ...form, resource: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    {["general", "profile", "settings", "documents", "financial_data", "admin_panel"].map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>failed_attempts</Label>
                <Input type="number" min={0} max={20} value={form.failedAttempts}
                  onChange={(e) => setForm({ ...form, failedAttempts: parseInt(e.target.value) || 0 })} />
              </div>
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? "Evaluating..." : "🚀 Send Request"}
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Response */}
        <Card>
          <CardHeader><CardTitle className="text-base">Response</CardTitle></CardHeader>
          <CardContent>
            {result ? (
              <div className="space-y-4">
                <div className="text-center py-4">
                  <p className={`text-5xl font-bold ${scoreColor(result.score)}`}>{result.score}</p>
                  <p className="text-muted-foreground text-sm mt-1">Risk Score</p>
                  <Badge variant={result.decision === "ALLOW" ? "default" : result.decision === "BLOCK" ? "destructive" : "secondary"}
                    className="mt-2 text-lg px-4 py-1">
                    {result.decision}
                  </Badge>
                </div>

                <div className="bg-muted rounded-lg p-4">
                  <p className="text-sm italic">"{result.explanation}"</p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-medium text-muted-foreground">Risk Factors</p>
                  {result.risk_factors.map((f, i) => (
                    <div key={i} className="flex items-center justify-between bg-muted/50 rounded-lg p-3">
                      <div>
                        <p className="text-sm font-medium">{f.factor}</p>
                        <p className="text-xs text-muted-foreground">{f.description}</p>
                      </div>
                      <span className={`font-mono text-sm font-bold ${f.contribution > 0 ? "text-red-500" : "text-green-500"}`}>
                        {f.contribution > 0 ? "+" : ""}{f.contribution.toFixed(1)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-muted-foreground text-xs">DNA Match</p>
                    <p className="font-semibold">{result.dna_match}%</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-muted-foreground text-xs">Processing</p>
                    <p className="font-semibold">{result.processing_time_ms}ms</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-muted-foreground text-xs">New User</p>
                    <p className="font-semibold">{result.is_new_user ? "Yes" : "No"}</p>
                  </div>
                  <div className="bg-muted rounded-lg p-3">
                    <p className="text-muted-foreground text-xs">Request ID</p>
                    <p className="font-mono text-xs">{result.request_id}</p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-16">Choose a preset or fill the form and send a request</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}