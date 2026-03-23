import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import { Shield, Target, Users, Globe, ArrowRight, Zap, Lock, Eye } from "lucide-react";

const values = [
  { icon: Shield, title: "Security First", desc: "Every architectural decision starts with the question: does this make our customers safer?" },
  { icon: Eye, title: "Transparency", desc: "Explainable AI means no black boxes. Every decision comes with a human-readable reason." },
  { icon: Zap, title: "Developer Experience", desc: "If it takes more than 30 minutes to integrate, we've failed. Simple APIs, clear docs, fast support." },
  { icon: Lock, title: "Privacy by Design", desc: "Multi-tenant isolation, zero data bleed, and no cross-company data sharing. Ever." },
];

const team = [
  { name: "Sahil Powar", role: "CEO & Founder", desc: "Former security lead at a Fortune 500 fintech. 12 years in cybersecurity." },
  { name: "Pranet Pravinkumar", role: "Co-Founder", desc: "PhD in Machine Learning from Stanford. Built ML systems processing 1B+ events/day." },
  { name: "Elena Kowalski", role: "Head of Engineering", desc: "Previously Staff Engineer at Cloudflare. Expert in low-latency distributed systems." },
  { name: "Marcus Chen", role: "Head of AI/ML", desc: "Former research scientist at DeepMind. Specialist in anomaly detection and behavioral modeling." },
];

const stats = [
  { value: "2M+", label: "Logins Analyzed" },
  { value: "50+", label: "Companies Protected" },
  { value: "98.4%", label: "Detection Accuracy" },
  { value: "<200ms", label: "Avg Response Time" },
];

const AboutPage = () => {
  return (
    <div className="pt-24">
      {/* Hero */}
      <section className="py-16 md:py-24 section-padding">
        <div className="container-narrow">
          <ScrollReveal>
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-5 leading-[1.1]">
                Making login security
                <br />
                <span className="gradient-text">intelligent & accessible</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                AuthDNA was born from a simple frustration: most login security is either too complex to implement, too expensive to afford, or too opaque to trust. We built the API we wished existed — fast, explainable, and ready in 30 minutes.
              </p>
              <div className="flex flex-wrap gap-3">
                <Link to="/register"><Button variant="hero" size="lg">Join Us <ArrowRight size={18} /></Button></Link>
                <Link to="/contact"><Button variant="heroOutline" size="lg">Get in Touch</Button></Link>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 border-y border-border/50 bg-card/50">
        <div className="container-wide section-padding">
          <ScrollReveal>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((s, i) => (
                <div key={i} className="text-center">
                  <div className="text-3xl font-bold text-foreground">{s.value}</div>
                  <div className="text-sm text-muted-foreground mt-1">{s.label}</div>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Mission */}
      <section className="py-20 section-padding">
        <div className="container-narrow">
          <ScrollReveal>
            <div className="text-center mb-14">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-3">Our mission</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                To democratize intelligent login security so that every company — from a 2-person startup to a global enterprise — can protect their users from credential-based attacks without building an in-house ML team.
              </p>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 section-padding bg-card/50">
        <div className="container-wide">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">What we stand for</h2>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {values.map((v, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <div className="glass-card p-6 h-full hover-lift">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <v.icon className="text-primary" size={20} />
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-2">{v.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 section-padding">
        <div className="container-narrow">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-foreground text-center mb-12">The team</h2>
          </ScrollReveal>
          <div className="grid sm:grid-cols-2 gap-5">
            {team.map((t, i) => (
              <ScrollReveal key={i} delay={i * 0.08}>
                <div className="glass-card p-6 hover-lift">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary font-bold text-sm">
                    {t.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  <h3 className="text-base font-semibold text-foreground">{t.name}</h3>
                  <p className="text-xs text-primary font-medium mb-2">{t.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 section-padding bg-card/50">
        <div className="container-narrow">
          <ScrollReveal>
            <div className="text-center">
              <h2 className="text-3xl font-bold text-foreground mb-4">Want to join our mission?</h2>
              <p className="text-muted-foreground mb-8">We're hiring engineers, researchers, and security experts.</p>
              <Link to="/contact"><Button variant="hero" size="lg">View Open Positions <ArrowRight size={18} /></Button></Link>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
