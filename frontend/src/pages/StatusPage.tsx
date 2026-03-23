import ScrollReveal from "@/components/ScrollReveal";
import { CheckCircle, AlertTriangle } from "lucide-react";

const services = [
  { name: "API Server (api.authdna.com)", status: "operational" },
  { name: "ML Inference Engine", status: "operational" },
  { name: "Database", status: "operational" },
  { name: "Mistral AI (Explanations)", status: "operational" },
  { name: "IP Geolocation Service", status: "operational" },
  { name: "Webhook Delivery", status: "operational" },
  { name: "Dashboard (app.authdna.com)", status: "operational" },
];

const incidents = [
  { date: "Jan 10, 2026", title: "Increased latency", desc: "ML inference latency increased to 400ms avg. Resolved in 15 minutes by scaling inference pods.", resolved: true },
  { date: "Dec 22, 2025", title: "IP API rate limit hit", desc: "Third-party IP geolocation API hit rate limit. Fallback cache activated. No customer impact.", resolved: true },
];

const StatusPage = () => (
  <div className="pt-24">
    <section className="py-16 md:py-24 section-padding">
      <div className="container-narrow max-w-2xl">
        <ScrollReveal>
          <div className="text-center mb-10">
            <h1 className="text-4xl font-extrabold text-foreground mb-3">System Status</h1>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10">
              <span className="w-2.5 h-2.5 rounded-full bg-success animate-pulse-dot" />
              <span className="text-sm font-semibold text-success">All Systems Operational</span>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="glass-card overflow-hidden mb-8">
            {services.map((s, i) => (
              <div key={i} className="flex items-center justify-between p-4 border-b border-border/50 last:border-0">
                <span className="text-sm font-medium text-foreground">{s.name}</span>
                <div className="flex items-center gap-1.5">
                  <CheckCircle size={14} className="text-success" />
                  <span className="text-xs text-success font-medium">Operational</span>
                </div>
              </div>
            ))}
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <div className="glass-card p-5 mb-8">
            <h3 className="text-sm font-semibold text-foreground mb-2">Uptime (last 90 days)</h3>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div className="h-full bg-success rounded-full" style={{ width: "99.95%" }} />
              </div>
              <span className="text-sm font-bold text-foreground tabular-nums">99.95%</span>
            </div>
            <div className="grid grid-cols-3 gap-4 mt-4 text-center">
              <div><div className="text-sm font-bold text-foreground tabular-nums">187ms</div><div className="text-xs text-muted-foreground">P50 Latency</div></div>
              <div><div className="text-sm font-bold text-foreground tabular-nums">312ms</div><div className="text-xs text-muted-foreground">P95 Latency</div></div>
              <div><div className="text-sm font-bold text-foreground tabular-nums">0.02%</div><div className="text-xs text-muted-foreground">Error Rate</div></div>
            </div>
          </div>
        </ScrollReveal>

        <ScrollReveal>
          <h2 className="text-xl font-bold text-foreground mb-4">Recent Incidents</h2>
          <div className="space-y-3">
            {incidents.map((inc, i) => (
              <div key={i} className="glass-card p-5">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs text-muted-foreground">{inc.date}</span>
                  <span className="text-xs font-medium text-success bg-success/10 px-1.5 py-0.5 rounded">Resolved</span>
                </div>
                <h3 className="text-sm font-semibold text-foreground mb-1">{inc.title}</h3>
                <p className="text-xs text-muted-foreground">{inc.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-muted-foreground mt-4 text-center">No major incidents in last 90 days</p>
        </ScrollReveal>
      </div>
    </section>
  </div>
);

export default StatusPage;
