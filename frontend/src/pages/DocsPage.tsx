import { useAuth } from '@/context/AuthContext';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function DocsPage() {
  const { tenant, isAuthenticated } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL || 'https://api.authdna.com';

  // Personalized values — different for every company
  const keyDisplay = isAuthenticated && tenant
    ? `${tenant.key_prefix || 'sk_live_xxxx'}...${tenant.tenant_id?.slice(-4) || 'xxxx'}`
    : 'YOUR_API_KEY';
  const tenantDisplay = tenant?.tenant_id || 'YOUR_TENANT_ID';
  const companyName = tenant?.company_name || 'Your Company';

  return (
    <div className="max-w-5xl mx-auto py-12 px-4 space-y-8">
      {/* Personalized banner */}
      {isAuthenticated && (
        <div className="bg-gradient-to-r from-teal-600 to-emerald-600 text-white rounded-xl p-6">
          <h2 className="text-xl font-bold">🔒 Personalized Docs for {companyName}</h2>
          <p className="text-teal-100 mt-1">
            These examples use YOUR credentials. Never share this page publicly.
          </p>
          <div className="mt-3 flex gap-4 text-sm">
            <span>Tenant: <code className="bg-teal-800 px-2 py-0.5 rounded">{tenantDisplay}</code></span>
            <span>Key: <code className="bg-teal-800 px-2 py-0.5 rounded">{keyDisplay}</code></span>
            <Badge variant="outline" className="text-white border-white">{tenant?.tier}</Badge>
          </div>
        </div>
      )}

      <h1 className="text-4xl font-bold">Integration Guide</h1>
      <p className="text-muted-foreground text-lg">
        Protect your login flow in 3 steps. Takes under 10 minutes.
      </p>

      {/* Getting Started for Companies */}
      <Card className="border-teal-500/30 bg-teal-50/50 dark:bg-teal-950/10">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            🏢 For Companies: Getting Started
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            New to AuthDNA? Follow these steps to secure your application with behavioral intelligence:
          </p>
          <div className="grid md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2 p-3 rounded-lg bg-background border">
              <h4 className="font-bold flex items-center gap-2 text-teal-600">
                <span className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center text-xs">1</span>
                Register Your Company
              </h4>
              <p className="text-xs text-muted-foreground">
                Visit our <a href="/register" className="underline font-medium text-teal-600">Registration Page</a> to create your tenant. You'll need an admin secret provided by our team.
              </p>
            </div>
            <div className="space-y-2 p-3 rounded-lg bg-background border">
              <h4 className="font-bold flex items-center gap-2 text-teal-600">
                <span className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center text-xs">2</span>
                Secure Your API Key
              </h4>
              <p className="text-xs text-muted-foreground">
                Upon registration, a unique <code>sk_live_...</code> key will be generated. <strong>Save it securely</strong>; it is required for all backend API calls.
              </p>
            </div>
            <div className="space-y-2 p-3 rounded-lg bg-background border">
              <h4 className="font-bold flex items-center gap-2 text-teal-600">
                <span className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center text-xs">3</span>
                Customize Security
              </h4>
              <p className="text-xs text-muted-foreground">
                Navigate to your dashboard to configure risk thresholds, set up webhooks, and view real-time security logs.
              </p>
            </div>
            <div className="space-y-2 p-3 rounded-lg bg-background border">
              <h4 className="font-bold flex items-center gap-2 text-teal-600">
                <span className="w-5 h-5 rounded-full bg-teal-100 flex items-center justify-center text-xs">4</span>
                Go Live
              </h4>
              <p className="text-xs text-muted-foreground">
                Once configured, follow the 3-step technical guide below to integrate our SDK and API into your existing auth flow.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Step 1 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="bg-teal-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">1</span>
            Add the JavaScript SDK to your login page
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-4">
            <p className="text-muted-foreground">
              Add this one line before your <code>{'</body>'}</code> tag. It auto-collects anonymized behavioral data and device characteristics.
            </p>
            <div className="bg-teal-50 dark:bg-teal-950/20 p-3 rounded border border-teal-200 dark:border-teal-800 text-sm">
              <p className="font-medium text-teal-800 dark:text-teal-300">Why this is important:</p>
              <p className="text-xs text-teal-700 dark:text-teal-400 mt-1">
                The SDK creates a "Digital DNA" profile of your users. By analyzing typing cadence and mouse movements, 
                our engine can distinguish between the real user and an attacker, even if the password is correct.
              </p>
            </div>
          </div>
          <pre className="bg-zinc-950 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`<script src="${apiUrl}/sdk/authdna.js"></script>`}
          </pre>
          <p className="text-xs text-muted-foreground mt-2">
            This SDK collects browser, screen, timezone, and canvas fingerprint. No cookies. No PII.
          </p>
        </CardContent>
      </Card>

      {/* Step 2 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="bg-teal-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">2</span>
            Call AuthDNA from your backend after password validation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 mb-6">
            <p className="text-muted-foreground">
              After validating the user's password, send a server-to-server request to our evaluation engine.
            </p>
            <div className="bg-teal-50 dark:bg-teal-950/20 p-3 rounded border border-teal-200 dark:border-teal-800 text-sm">
              <p className="font-medium text-teal-800 dark:text-teal-300">Backend Security:</p>
              <p className="text-xs text-teal-700 dark:text-teal-400 mt-1">
                Your API key should <strong>never</strong> be exposed in the browser. 
                Perform the risk check in your secure backend to prevent bypass attempts.
              </p>
            </div>
          </div>
          <Tabs defaultValue="node" className="w-full">
            <TabsList>
              <TabsTrigger value="node">Node.js</TabsTrigger>
              <TabsTrigger value="python">Python</TabsTrigger>
              <TabsTrigger value="curl">cURL</TabsTrigger>
            </TabsList>

            <TabsContent value="node">
              <pre className="bg-zinc-950 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`// Server-side only — NEVER expose your API key!
const risk = await fetch("${apiUrl}/v1/evaluate", {
  method: "POST",
  headers: {
    "X-API-Key": "${keyDisplay}",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    user_id: user.email,                    // the user logging in
    ip: req.headers["x-forwarded-for"],     // auto-detected if omitted
    client_context: req.body.authdna_ctx,   // from JS SDK
    resource: "dashboard",
    failed_attempts: await getFailCount(user.email),
  }),
}).then(r => r.json());

switch (risk.decision) {
  case "ALLOW":  return createSession(user);
  case "OTP":    return sendOTP(user.email);
  case "STEPUP": return requireBiometric();
  case "BLOCK":  return res.status(403).json({
    error: "Login blocked for security",
    request_id: risk.request_id
  });
}`}
              </pre>
            </TabsContent>

            <TabsContent value="python">
              <pre className="bg-zinc-950 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`import requests

risk = requests.post(
    "${apiUrl}/v1/evaluate",
    headers={"X-API-Key": "${keyDisplay}"},
    json={
        "user_id": email,
        "ip": request.headers.get("X-Forwarded-For"),
        "client_context": request.json.get("authdna_ctx"),
        "resource": "dashboard",
        "failed_attempts": get_fail_count(email),
    }
).json()

if risk["decision"] == "ALLOW":
    return create_session(user)
elif risk["decision"] == "BLOCK":
    return abort(403, "Login blocked")`}
              </pre>
            </TabsContent>

            <TabsContent value="curl">
              <pre className="bg-zinc-950 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`curl -X POST ${apiUrl}/v1/evaluate \\
  -H "X-API-Key: ${keyDisplay}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "user_id": "alice@${tenantDisplay.split('_')[0] || 'example'}.com",
    "resource": "dashboard",
    "failed_attempts": 0
  }'`}
              </pre>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Step 3 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span className="bg-teal-600 text-white w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">3</span>
            Handle the decision in your frontend
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-4">
            Use the <code>decision</code> from our API to determine the next step in your authentication flow.
          </p>
          <div className="bg-teal-50 dark:bg-teal-950/20 p-3 rounded border border-teal-200 dark:border-teal-800 text-sm mb-4">
            <p className="font-medium text-teal-800 dark:text-teal-300">Handling Decisions:</p>
            <p className="text-xs text-teal-700 dark:text-teal-400 mt-1">
              A <code>BLOCK</code> decision stops an attack in its tracks. For moderate risk, <code>OTP</code> or <code>STEPUP</code> 
              allows you to challenge the user without a full lockout.
            </p>
          </div>
          <pre className="bg-zinc-950 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`// In your login form submit handler:
const ctx = window.AuthDNA?.getContext();

const res = await fetch('/api/login', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    email, password,
    authdna_ctx: ctx   // device fingerprint from SDK
  })
});
const result = await res.json();

if (result.action === 'allowed')      window.location.href = '/dashboard';
if (result.action === 'otp_required') showOTPForm();
if (result.action === 'blocked')      showError('Login blocked for security.');`}
          </pre>
        </CardContent>
      </Card>

      {/* API Reference */}
      <Card>
        <CardHeader><CardTitle>API Response Format</CardTitle></CardHeader>
        <CardContent>
          <pre className="bg-zinc-950 text-green-400 p-4 rounded-lg overflow-x-auto text-sm">
{`{
  "decision": "ALLOW",       // ALLOW | OTP | STEPUP | BLOCK
  "score": 12.5,             // 0-100 risk score
  "explanation": "Normal login from known device in India.",
  "risk_factors": [
    { "factor": "known_behavior", "contribution": -10, "description": "..." }
  ],
  "dna_match": 94.2,         // behavioral match %
  "is_new_user": false,
  "processing_time_ms": 187,
  "request_id": "req_abc123",
  "timestamp": "2026-03-24T10:30:00Z"
}`}
          </pre>
        </CardContent>
      </Card>

      {/* Security note */}
      <Card className="border-amber-500/50 bg-amber-50 dark:bg-amber-950/20">
        <CardContent className="pt-6">
          <h3 className="font-bold text-amber-700 dark:text-amber-400">🔐 Security Notes</h3>
          <ul className="mt-2 text-sm space-y-1 text-amber-800 dark:text-amber-300">
            <li>• Your API key is <strong>server-side only</strong> — never expose it in frontend code</li>
            <li>• All API calls use HTTPS — data is encrypted in transit</li>
            <li>• Webhooks are signed with HMAC-SHA256 — verify before trusting</li>
            <li>• The JS SDK collects device info only — no passwords, no PII</li>
            <li>• Rate limits protect against abuse: {tenant?.tier === 'pro' ? '1,000' : '100'}/hour</li>
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}