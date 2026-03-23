import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import ScrollReveal from "@/components/ScrollReveal";
import { Check, ArrowRight, HelpCircle, ChevronDown, ChevronUp } from "lucide-react";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "/month",
    desc: "For developers exploring risk-based authentication.",
    cta: "Get Started",
    ctaVariant: "heroOutline" as const,
    popular: false,
    features: [
      "100 requests/hour",
      "Risk scoring engine",
      "ML ensemble (IF + XGB + RF)",
      "DNA behavioral profiling",
      "Explainable AI decisions",
      "14 API endpoints",
      "Community support",
    ],
  },
  {
    name: "Pro",
    price: "$49",
    period: "/month",
    desc: "For teams securing production login flows.",
    cta: "Start 14-Day Trial",
    ctaVariant: "hero" as const,
    popular: true,
    features: [
      "1,000 requests/hour",
      "Everything in Free",
      "Webhook integrations",
      "Dashboard analytics",
      "Priority email support",
      "Email alerts & notifications",
      "Usage reports & exports",
    ],
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For organizations with advanced security needs.",
    cta: "Contact Sales",
    ctaVariant: "heroOutline" as const,
    popular: false,
    features: [
      "10,000+ requests/hour",
      "Everything in Pro",
      "Custom ML models",
      "Dedicated support engineer",
      "SLA guarantee (99.9%)",
      "Custom risk thresholds",
      "On-premise deployment option",
    ],
  },
];

const faqs = [
  { q: "What counts as a request?", a: "Each POST /v1/evaluate call counts as one request. Dashboard, settings, and other read-only endpoints do not count toward your limit." },
  { q: "What happens if I exceed my limit?", a: "You'll receive an HTTP 429 (Too Many Requests) response. The counter resets every hour. Upgrade to Pro for higher limits." },
  { q: "Can I upgrade mid-month?", a: "Yes! Billing is prorated. You'll only pay for the remaining days in the current billing cycle." },
  { q: "Is there a free trial for Pro?", a: "Yes, Pro comes with a 14-day free trial. No credit card required to start." },
  { q: "Do you offer startup discounts?", a: "Yes, we offer special pricing for early-stage startups. Contact our sales team with your details." },
  { q: "What payment methods do you accept?", a: "Credit cards for Pro plans. Enterprise customers can pay via invoice with NET-30 terms." },
];

const PricingPage = () => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <div className="pt-24">
      {/* Header */}
      <section className="py-16 md:py-24 section-padding">
        <div className="container-narrow text-center">
          <ScrollReveal>
            <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">
              Simple, transparent pricing
            </h1>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              Start free. Scale when you're ready. No hidden fees.
            </p>
          </ScrollReveal>
        </div>
      </section>

      {/* Plans */}
      <section className="pb-20 section-padding">
        <div className="container-wide">
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {plans.map((plan, i) => (
              <ScrollReveal key={i} delay={i * 0.1}>
                <div className={`glass-card p-7 h-full flex flex-col hover-lift relative ${
                  plan.popular ? "ring-2 ring-primary shadow-lg" : ""
                }`}>
                  {plan.popular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">
                      Most Popular
                    </div>
                  )}
                  <div className="mb-6">
                    <h3 className="text-lg font-bold text-foreground mb-1">{plan.name}</h3>
                    <div className="flex items-baseline gap-1 mb-2">
                      <span className="text-4xl font-extrabold text-foreground">{plan.price}</span>
                      <span className="text-sm text-muted-foreground">{plan.period}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{plan.desc}</p>
                  </div>
                  <ul className="space-y-2.5 mb-8 flex-1">
                    {plan.features.map((f, j) => (
                      <li key={j} className="flex items-start gap-2.5 text-sm text-foreground">
                        <Check size={15} className="text-primary shrink-0 mt-0.5" />
                        {f}
                      </li>
                    ))}
                  </ul>
                  <Link to={plan.name === "Enterprise" ? "/contact" : "/register"}>
                    <Button variant={plan.ctaVariant} className="w-full" size="lg">
                      {plan.cta}
                    </Button>
                  </Link>
                  {plan.name === "Free" && (
                    <p className="text-xs text-muted-foreground text-center mt-2">No credit card required</p>
                  )}
                  {plan.name === "Pro" && (
                    <p className="text-xs text-muted-foreground text-center mt-2">14-day free trial</p>
                  )}
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-20 section-padding bg-card/50">
        <div className="container-narrow max-w-2xl">
          <ScrollReveal>
            <h2 className="text-3xl font-bold text-foreground text-center mb-10">Frequently asked questions</h2>
          </ScrollReveal>
          <div className="space-y-2">
            {faqs.map((faq, i) => (
              <ScrollReveal key={i} delay={i * 0.05}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full glass-card p-5 text-left hover:bg-muted/20 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm font-medium text-foreground">{faq.q}</span>
                    {openFaq === i ? <ChevronUp size={16} className="text-muted-foreground shrink-0" /> : <ChevronDown size={16} className="text-muted-foreground shrink-0" />}
                  </div>
                  {openFaq === i && (
                    <p className="mt-3 text-sm text-muted-foreground leading-relaxed">{faq.a}</p>
                  )}
                </button>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default PricingPage;
