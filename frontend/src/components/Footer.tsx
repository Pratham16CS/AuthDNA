import { Link } from "react-router-dom";
import { Shield, Github, Twitter, Linkedin } from "lucide-react";

const footerLinks = {
  Product: [
    { label: "Features", href: "/features" },
    { label: "Pricing", href: "/pricing" },
    { label: "Documentation", href: "/docs" },
    { label: "Status", href: "/status" },
  ],
  Resources: [
    { label: "API Reference", href: "/docs/api-reference" },
    { label: "Getting Started", href: "/docs/getting-started" },
    { label: "Integration Guides", href: "/docs/integration" },
    { label: "Changelog", href: "/docs/changelog" },
  ],
  Company: [
    { label: "About", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
    { label: "Careers", href: "/careers" },
  ],
  Legal: [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Security", href: "/security" },
  ],
};

const Footer = () => {
  return (
    <footer className="bg-foreground text-background/80">
      <div className="container-wide section-padding py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 lg:gap-12">
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-7 h-7 rounded-md bg-primary flex items-center justify-center">
                <Shield className="text-primary-foreground" size={14} />
              </div>
              <span className="text-base font-bold text-background">AuthDNA</span>
            </Link>
            <p className="text-sm text-background/50 leading-relaxed mb-6 max-w-[240px]">
              AI-powered login risk assessment API. Protect every authentication event.
            </p>
            <div className="flex items-center gap-3">
              {[Github, Twitter, Linkedin].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-8 h-8 rounded-md bg-background/10 flex items-center justify-center hover:bg-background/20 transition-colors"
                >
                  <Icon size={14} className="text-background/60" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-xs font-semibold uppercase tracking-wider text-background/40 mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      to={link.href}
                      className="text-sm text-background/55 hover:text-background transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-background/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-background/35">
            © {new Date().getFullYear()} AuthDNA. All rights reserved.
          </p>
          <p className="text-xs text-background/35">
            Securing logins with AI · Built for developers
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
