import { useState } from "react";
import { Link } from "react-router-dom";
import ScrollReveal from "@/components/ScrollReveal";
import { Button } from "@/components/ui/button";
import {
  BookOpen, Code2, Plug, Package, FileText, ChevronRight,
  Copy, Check, ArrowRight, Terminal, Search
} from "lucide-react";

const sidebarNav = [
  { label: "Getting Started", id: "getting-started", icon: BookOpen },
  { label: "API Reference", id: "api-reference", icon: Code2 },
  { label: "Integration Guides", id: "integration", icon: Plug },
  { label: "SDKs & Libraries", id: "sdks", icon: Package },
  { label: "Changelog", id: "changelog", icon: FileText },
];

const endpoints = [
  { method: "POST", path: "/v1/tenants/register", desc: "Register a new company/tenant" },
  { method: "GET", path: "/v1/tenants/me", desc: "Get current tenant info" },
  { method: "POST", path: "/v1/tenants/rotate-key", desc: "Rotate your API key" },
  { method: "POST", path: "/v1/evaluate", desc: "Evaluate a login event (core endpoint)" },
  { method: "GET", path: "/v1/dashboard/stats", desc: "Get dashboard statistics" },
  { method: "GET", path: "/v1/dashboard/logs", desc: "Get login evaluation logs" },
  { method: "GET", path: "/v1/dashboard/users/:id/dna", desc: "Get user behavioral DNA profile" },
  { method: "GET", path: "/v1/usage/current", desc: "Get current billing period usage" },
  { method: "GET", path: "/v1/usage/history", desc: "Get usage history" },
  { method: "GET", path: "/v1/webhooks", desc: "Get webhook configuration" },
  { method: "PUT", path: "/v1/webhooks", desc: "Update webhook URL" },
  { method: "DELETE", path: "/v1/webhooks", desc: "Remove webhook" },
  { method: "POST", path: "/v1/webhooks/test", desc: "Send test webhook" },
];

const CodeBlock = ({ code, language = "bash" }: { code: string; language?: string }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative group">
      <div className="code-block pr-12">
        <pre className="whitespace-pre-wrap text-xs sm:text-sm"><code>{code}</code></pre>
      </div>
      <button
        onClick={handleCopy}
        className="absolute top-3 right-3 p-1.5 rounded-md bg-background/10 hover:bg-background/20 transition-colors opacity-0 group-hover:opacity-100"
        aria-label="Copy code"
      >
        {copied ? <Check size={14} className="text-success" /> : <Copy size={14} className="text-background/60" />}
      </button>
    </div>
  );
};

const MethodBadge = ({ method }: { method: string }) => {
  const colors: Record<string, string> = {
    GET: "bg-[hsl(var(--decision-allow))]/15 text-[hsl(var(--decision-allow))]",
    POST: "bg-primary/15 text-primary",
    PUT: "bg-warning/15 text-warning",
    DELETE: "bg-destructive/15 text-destructive",
  };
  return (
    <span className={`inline-flex text-[10px] font-bold font-mono px-1.5 py-0.5 rounded ${colors[method] || ""}`}>
      {method}
    </span>
  );
};

const DocsPage = () => {
  const [activeSection, setActiveSection] = useState("getting-started");
  const [activeTab, setActiveTab] = useState("curl");

  const codeExamples: Record<string, string> = {
    curl: `curl -X POST https://api.authdna.com/v1/evaluate \\
  -H "X-API-Key: sk_live_your_key_here" \\
  -H "Content-Type: application/json" \\
  -d '{
    "user_id": "bob@acme.com",
    "ip": "203.0.113.42",
    "device_fp": "chrome-win-1920x1080",
    "resource": "dashboard",
    "failed_attempts": 0
  }'`,
    node: `const response = await fetch(
  "https://api.authdna.com/v1/evaluate",
  {
    method: "POST",
    headers: {
      "X-API-Key": process.env.AUTHDNA_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: "bob@acme.com",
      ip: req.ip,
      device_fp: req.headers["user-agent"],
      resource: "dashboard",
      failed_attempts: 0,
    }),
  }
);

const result = await response.json();

if (result.decision === "BLOCK") {
  return res.status(403).json({ error: "Login blocked" });
} else if (result.decision === "OTP") {
  return trigger2FA(user);
} else {
  return allowLogin(user);
}`,
    python: `import requests

response = requests.post(
    "https://api.authdna.com/v1/evaluate",
    headers={
        "X-API-Key": os.environ["AUTHDNA_API_KEY"],
        "Content-Type": "application/json",
    },
    json={
        "user_id": "bob@acme.com",
        "ip": request.remote_addr,
        "device_fp": request.headers.get("User-Agent"),
        "resource": "dashboard",
        "failed_attempts": 0,
    },
)

result = response.json()

if result["decision"] == "BLOCK":
    abort(403, "Login blocked")
elif result["decision"] == "OTP":
    trigger_2fa(user)
else:
    allow_login(user)`,
  };

  const responseExample = `{
  "decision": "ALLOW",
  "score": 8.4,
  "explanation": "Normal login from known device in Mumbai, India during usual hours.",
  "risk_factors": [
    { "factor": "known_device", "contribution": -5, "detail": "chrome-win-1920x1080" },
    { "factor": "known_location", "contribution": -3, "detail": "Mumbai, India" },
    { "factor": "normal_time", "contribution": -2, "detail": "10:32 AM (usual: 9-11 AM)" }
  ],
  "dna_match": 94.2,
  "is_new_user": false,
  "processing_time_ms": 187
}`;

  return (
    <div className="pt-24 min-h-screen">
      <div className="container-wide section-padding">
        <div className="flex gap-8">
          {/* Sidebar */}
          <aside className="hidden lg:block w-56 shrink-0 sticky top-24 self-start">
            <nav className="space-y-1">
              {sidebarNav.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors ${
                    activeSection === item.id
                      ? "bg-primary/10 text-primary font-medium"
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <item.icon size={15} />
                  {item.label}
                </button>
              ))}
            </nav>
          </aside>

          {/* Content */}
          <main className="flex-1 min-w-0 pb-20">
            {/* Mobile nav */}
            <div className="lg:hidden mb-6 flex gap-2 overflow-x-auto pb-2">
              {sidebarNav.map((item) => (
                <button
                  key={item.id}
                  onClick={() => setActiveSection(item.id)}
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    activeSection === item.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>

            {activeSection === "getting-started" && (
              <div className="space-y-10">
                <ScrollReveal>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Getting Started</h1>
                    <p className="text-muted-foreground text-lg">Make your first API call in under 5 minutes.</p>
                  </div>
                </ScrollReveal>

                <ScrollReveal>
                  <div className="space-y-6">
                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">1</span>
                        Register your company
                      </h2>
                      <p className="text-sm text-muted-foreground mb-3">Create an account and receive your API key instantly.</p>
                      <CodeBlock code={`curl -X POST https://api.authdna.com/v1/tenants/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "company_name": "Acme Corp",
    "email": "admin@acme.com",
    "password": "your_secure_password"
  }'`} />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">2</span>
                        Save your API key
                      </h2>
                      <p className="text-sm text-muted-foreground mb-3">Store your API key securely in environment variables. It's only shown once.</p>
                      <CodeBlock code={`# Add to your .env file
AUTHDNA_API_KEY=sk_live_a7f3b2e1d9c845_acme_corp_f8a2

# NEVER commit this to version control!`} />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">3</span>
                        Make your first evaluate call
                      </h2>
                      <p className="text-sm text-muted-foreground mb-3">Choose your language:</p>
                      <div className="flex gap-1 mb-3">
                        {["curl", "node", "python"].map((tab) => (
                          <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                              activeTab === tab ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:text-foreground"
                            }`}
                          >
                            {tab === "curl" ? "cURL" : tab === "node" ? "Node.js" : "Python"}
                          </button>
                        ))}
                      </div>
                      <CodeBlock code={codeExamples[activeTab]} language={activeTab} />
                    </div>

                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-3 flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">4</span>
                        Handle the response
                      </h2>
                      <p className="text-sm text-muted-foreground mb-3">Here's what a typical response looks like:</p>
                      <CodeBlock code={responseExample} language="json" />

                      <div className="mt-4 glass-card p-4">
                        <h4 className="text-sm font-semibold text-foreground mb-2">Decision types:</h4>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                          {[
                            { label: "ALLOW", desc: "Score 0-30", cls: "badge-allow" },
                            { label: "OTP", desc: "Score 30-60", cls: "badge-otp" },
                            { label: "STEPUP", desc: "Score 60-80", cls: "badge-stepup" },
                            { label: "BLOCK", desc: "Score 80+", cls: "badge-block" },
                          ].map((d) => (
                            <div key={d.label} className="text-center">
                              <span className={d.cls}>{d.label}</span>
                              <p className="text-xs text-muted-foreground mt-1">{d.desc}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            )}

            {activeSection === "api-reference" && (
              <div className="space-y-8">
                <ScrollReveal>
                  <div>
                    <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">API Reference</h1>
                    <p className="text-muted-foreground text-lg mb-2">Complete list of available endpoints.</p>
                    <div className="glass-card p-3 inline-flex items-center gap-2 text-sm">
                      <Terminal size={14} className="text-primary" />
                      <span className="font-mono text-xs text-muted-foreground">Base URL:</span>
                      <code className="font-mono text-xs font-semibold text-foreground">https://api.authdna.com</code>
                    </div>
                  </div>
                </ScrollReveal>

                <ScrollReveal>
                  <div className="glass-card p-4 mb-4">
                    <h3 className="text-sm font-semibold text-foreground mb-2">Authentication</h3>
                    <p className="text-sm text-muted-foreground mb-2">All requests require an API key in the header:</p>
                    <CodeBlock code='X-API-Key: sk_live_your_key_here' />
                  </div>
                </ScrollReveal>

                <ScrollReveal>
                  <div className="space-y-2">
                    {endpoints.map((ep, i) => (
                      <div key={i} className="glass-card p-4 flex items-start gap-3 hover:bg-muted/20 transition-colors">
                        <MethodBadge method={ep.method} />
                        <div className="min-w-0">
                          <code className="text-sm font-mono font-medium text-foreground">{ep.path}</code>
                          <p className="text-xs text-muted-foreground mt-0.5">{ep.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollReveal>

                <ScrollReveal>
                  <div className="glass-card p-4">
                    <h3 className="text-sm font-semibold text-foreground mb-2">Error Codes</h3>
                    <div className="space-y-1.5 text-sm">
                      <div className="flex gap-4"><code className="font-mono text-destructive">401</code><span className="text-muted-foreground">Unauthorized — invalid or missing API key</span></div>
                      <div className="flex gap-4"><code className="font-mono text-warning">429</code><span className="text-muted-foreground">Rate limit exceeded — resets every hour</span></div>
                      <div className="flex gap-4"><code className="font-mono text-destructive">500</code><span className="text-muted-foreground">Internal server error — retry with exponential backoff</span></div>
                    </div>
                  </div>
                </ScrollReveal>
              </div>
            )}

            {activeSection === "integration" && (
              <div className="space-y-8">
                <ScrollReveal>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Integration Guides</h1>
                  <p className="text-muted-foreground text-lg">Step-by-step guides for popular frameworks.</p>
                </ScrollReveal>
                {[
                  { lang: "Node.js / Express", code: `const express = require('express');
const app = express();

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Authenticate user first
  const user = await authenticateUser(email, password);
  if (!user) return res.status(401).json({ error: "Invalid credentials" });

  // Then evaluate risk with AuthDNA
  const risk = await fetch("https://api.authdna.com/v1/evaluate", {
    method: "POST",
    headers: {
      "X-API-Key": process.env.AUTHDNA_API_KEY,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      user_id: email,
      ip: req.ip,
      device_fp: req.headers["user-agent"],
    }),
  }).then(r => r.json());

  if (risk.decision === "BLOCK") {
    return res.status(403).json({ error: "Suspicious login blocked" });
  }
  if (risk.decision === "OTP") {
    return res.json({ require_2fa: true });
  }
  
  // ALLOW — issue session
  req.session.user = user;
  res.json({ success: true });
});` },
                  { lang: "Python / Flask", code: `from flask import Flask, request, jsonify
import requests

app = Flask(__name__)

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    
    # Authenticate user first
    user = authenticate_user(data['email'], data['password'])
    if not user:
        return jsonify(error="Invalid credentials"), 401

    # Evaluate risk with AuthDNA
    risk = requests.post(
        "https://api.authdna.com/v1/evaluate",
        headers={"X-API-Key": os.environ["AUTHDNA_API_KEY"]},
        json={
            "user_id": data["email"],
            "ip": request.remote_addr,
            "device_fp": request.headers.get("User-Agent"),
        },
    ).json()

    if risk["decision"] == "BLOCK":
        return jsonify(error="Suspicious login blocked"), 403
    if risk["decision"] == "OTP":
        return jsonify(require_2fa=True)
    
    # ALLOW
    session["user"] = user.id
    return jsonify(success=True)` },
                ].map((guide, i) => (
                  <ScrollReveal key={i}>
                    <div>
                      <h2 className="text-xl font-bold text-foreground mb-3">{guide.lang}</h2>
                      <CodeBlock code={guide.code} language={guide.lang.includes("Node") ? "javascript" : "python"} />
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            )}

            {activeSection === "sdks" && (
              <div className="space-y-8">
                <ScrollReveal>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">SDKs & Libraries</h1>
                  <p className="text-muted-foreground text-lg mb-6">Official and community SDKs for popular languages.</p>
                </ScrollReveal>
                {[
                  { lang: "Node.js", install: "npm install @authdna/node", status: "Official" },
                  { lang: "Python", install: "pip install authdna", status: "Official" },
                  { lang: "Go", install: "go get github.com/authdna/go-sdk", status: "Official" },
                  { lang: "PHP", install: "composer require authdna/php-sdk", status: "Community" },
                  { lang: "Ruby", install: "gem install authdna", status: "Community" },
                ].map((sdk, i) => (
                  <ScrollReveal key={i} delay={i * 0.05}>
                    <div className="glass-card p-5 flex items-center justify-between gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="text-sm font-semibold text-foreground">{sdk.lang}</h3>
                          <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${sdk.status === "Official" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}>
                            {sdk.status}
                          </span>
                        </div>
                        <code className="text-xs font-mono text-muted-foreground">{sdk.install}</code>
                      </div>
                      <Button variant="ghost" size="sm" onClick={() => navigator.clipboard.writeText(sdk.install)}>
                        <Copy size={14} />
                      </Button>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            )}

            {activeSection === "changelog" && (
              <div className="space-y-8">
                <ScrollReveal>
                  <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Changelog</h1>
                  <p className="text-muted-foreground text-lg">Latest updates and improvements.</p>
                </ScrollReveal>
                {[
                  { version: "v1.4.0", date: "March 15, 2026", changes: ["Added Graph Privilege Analysis engine", "Improved impossible travel detection accuracy by 12%", "New webhook retry mechanism with exponential backoff"] },
                  { version: "v1.3.0", date: "February 1, 2026", changes: ["Explainable AI powered by Mistral AI integration", "Dashboard analytics export (CSV/PDF)", "Custom risk threshold configuration"] },
                  { version: "v1.2.0", date: "January 10, 2026", changes: ["Behavioral DNA profiling v2 with 5-axis radar", "Multi-tenant data isolation improvements", "API response time reduced to <200ms average"] },
                  { version: "v1.1.0", date: "December 5, 2025", changes: ["Webhook support for BLOCK, OTP, STEPUP events", "Team member management", "Usage analytics dashboard"] },
                  { version: "v1.0.0", date: "November 1, 2025", changes: ["Initial release with ML ensemble engine", "Risk scoring with IF + XGB + RF", "14 API endpoints", "Basic dashboard"] },
                ].map((release, i) => (
                  <ScrollReveal key={i} delay={i * 0.05}>
                    <div className="glass-card p-5">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-xs font-bold font-mono bg-primary/10 text-primary px-2 py-0.5 rounded">{release.version}</span>
                        <span className="text-xs text-muted-foreground">{release.date}</span>
                      </div>
                      <ul className="space-y-1.5">
                        {release.changes.map((change, j) => (
                          <li key={j} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <ChevronRight size={14} className="text-primary shrink-0 mt-0.5" />
                            {change}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </ScrollReveal>
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;
