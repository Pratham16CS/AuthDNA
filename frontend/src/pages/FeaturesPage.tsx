import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import {
  Cpu, Shield, Eye, Zap, Lock, Bell, Globe, BarChart3,
  ArrowRight, Check, Network, Timer, Fingerprint
} from "lucide-react";

const featureGroups = [
  {
    icon: Cpu,
    title: "ML Ensemble Engine",
    badge: "IF + XGB + RF",
    desc: "Three machine learning models — Isolation Forest, XGBoost, and Random Forest — work together to produce a single risk score with 98.4% F1 accuracy. No single model has blind spots.",
    details: ["Isolation Forest detects anomalous login patterns", "XGBoost classifies known attack signatures", "Random Forest provides ensemble stability", "Weighted voting for final risk score"],
  },
  {
    icon: Fingerprint,
    title: "Behavioral DNA Profiles",
    badge: "Learns continuously",
    desc: "Every user gets a unique behavioral fingerprint based on their login patterns — when they log in, from where, on which device. Any deviation raises the risk score.",
    details: ["Login time patterns", "Device fingerprint tracking", "Geolocation profiling", "Resource access patterns", "Frequency analysis"],
  },
  {
    icon: Eye,
    title: "Explainable AI",
    badge: "Powered by Mistral AI",
    desc: "Every decision comes with a human-readable explanation. No more black-box security. Know exactly why a login was blocked or flagged.",
    details: ["Natural language explanations", "Risk factor breakdown with scores", "Confidence levels for each factor", "Audit-ready reports"],
  },
  {
    icon: Zap,
    title: "Real-Time Decisions",
    badge: "< 300ms guaranteed",
    desc: "200ms average response time. Fast enough to sit in your login flow without users noticing. Async processing ensures zero impact on user experience.",
    details: ["P50 latency: 187ms", "P95 latency: 312ms", "P99 latency: 450ms", "Zero-impact async architecture"],
  },
  {
    icon: Lock,
    title: "Multi-Tenant Isolation",
    badge: "Zero data bleed",
    desc: "Complete tenant isolation. Company A's users and behavioral profiles are invisible to Company B. Zero data bleed architecture.",
    details: ["Isolated data stores per tenant", "Separate ML model instances", "No cross-tenant data leakage", "SOC 2 compliant"],
  },
  {
    icon: Bell,
    title: "Webhooks & Real-Time Alerts",
    badge: "Instant notifications",
    desc: "Register a webhook URL and receive instant POST notifications when logins are blocked or require OTP. Connect to Slack, email, or your incident system.",
    details: ["Configurable event subscriptions", "Automatic retry with exponential backoff", "Delivery status tracking", "Test webhook endpoint"],
  },
  {
    icon: Network,
    title: "Graph Privilege Analysis",
    badge: "Relationship mapping",
    desc: "Detect privilege escalation attacks by mapping user relationships and access patterns across your organization.",
    details: ["User relationship graphs", "Access pattern anomaly detection", "Role-based risk assessment", "Lateral movement detection"],
  },
  {
    icon: Globe,
    title: "Geo Intelligence & IP Tracking",
    badge: "Global coverage",
    desc: "Real-time IP geolocation with impossible travel detection. Know when a user logs in from Moscow 10 minutes after logging in from Mumbai.",
    details: ["Impossible travel detection", "VPN/Tor exit node identification", "ISP reputation scoring", "Country-level risk policies"],
  },
];

const detectionTable = [
  { attack: "Credential stuffing", method: "ML + Failed attempts" },
  { attack: "Account takeover", method: "DNA + Device change" },
  { attack: "Impossible travel", method: "Geo + Time analysis" },
  { attack: "Brute force", method: "Failure rate + ML" },
  { attack: "Bot/automated login", method: "Pattern + Frequency" },
  { attack: "Privilege escalation", method: "Graph engine" },
  { attack: "Off-hours suspicious access", method: "Time + DNA deviation" },
  { attack: "New device from new country", method: "DNA + Geo + Device" },
];

const FeaturesPage = () => {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="py-16 md:py-24 section-padding">
        <div className="container-narrow text-center">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4 leading-[1.1]">
              Every layer of defense,
              <br />
              <span className="gradient-text">working in unison</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              AuthDNA combines 6 AI engines, behavioral profiling, and real-time threat intelligence to score every login attempt.
            </p>
            <Link to="/register">
              <Button variant="hero" size="lg">
                Start Free <ArrowRight size={18} />
              </Button>
            </Link>
          </ScrollReveal>
        </div>
      </section>

      {/* Feature Cards */}
      <section className="py-16 section-padding bg-card/50">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 gap-6">
            {featureGroups.map((f, i) => (
              <ScrollReveal key={i} delay={i * 0.06}>
                <div className="glass-card p-7 h-full hover-lift group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                      <f.icon className="text-primary" size={22} />
                    </div>
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-1 rounded-md">
                      {f.badge}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{f.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">{f.desc}</p>
                  <ul className="space-y-1.5">
                    {f.details.map((d, j) => (
                      <li key={j} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Check size={14} className="text-primary shrink-0" />
                        {d}
                      </li>
                    ))}
                  </ul>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Detection Table */}
      <section className="py-20 section-padding">
        <div className="container-narrow">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Detection capabilities</h2>
              <p className="text-muted-foreground text-lg">Every attack vector, covered by specialized engines</p>
            </div>
          </ScrollReveal>
          <ScrollReveal>
            <div className="glass-card overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-medium text-muted-foreground">Attack Type</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Detection Method</th>
                  </tr>
                </thead>
                <tbody>
                  {detectionTable.map((row, i) => (
                    <tr key={i} className="border-b border-border/50 last:border-0 hover:bg-muted/30 transition-colors">
                      <td className="p-4 font-medium text-foreground">{row.attack}</td>
                      <td className="p-4 text-muted-foreground">{row.method}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 section-padding bg-card/50">
        <div className="container-narrow">
          <ScrollReveal>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">Ready to protect your logins?</h2>
              <p className="text-muted-foreground mb-8">Get started in under 5 minutes with our free tier.</p>
              <div className="flex flex-wrap justify-center gap-3">
                <Link to="/register"><Button variant="hero" size="lg">Get Free API Key <ArrowRight size={18} /></Button></Link>
                <Link to="/docs"><Button variant="heroOutline" size="lg">Read Documentation</Button></Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default FeaturesPage;
