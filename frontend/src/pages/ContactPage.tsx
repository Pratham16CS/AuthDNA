import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import ScrollReveal from "@/components/ScrollReveal";
import { Mail, MessageSquare, Send } from "lucide-react";
import { toast } from "sonner";

const ContactPage = () => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you within 24 hours.");
  };

  return (
    <div className="pt-24">
      <section className="py-16 md:py-24 section-padding">
        <div className="container-narrow max-w-2xl">
          <ScrollReveal>
            <div className="text-center mb-12">
              <h1 className="text-4xl font-extrabold text-foreground mb-3">Get in touch</h1>
              <p className="text-lg text-muted-foreground">Questions about AuthDNA? We'd love to hear from you.</p>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <div className="grid sm:grid-cols-2 gap-4 mb-10">
              <div className="glass-card p-5 text-center hover-lift">
                <Mail className="text-primary mx-auto mb-2" size={22} />
                <h3 className="text-sm font-semibold text-foreground">Email</h3>
                <p className="text-xs text-muted-foreground mt-1">support@authdna.com</p>
              </div>
              <div className="glass-card p-5 text-center hover-lift">
                <MessageSquare className="text-primary mx-auto mb-2" size={22} />
                <h3 className="text-sm font-semibold text-foreground">Community</h3>
                <p className="text-xs text-muted-foreground mt-1">Join our Discord</p>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal>
            <form onSubmit={handleSubmit} className="glass-card p-7 space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name" className="text-sm font-medium">Name</Label>
                  <Input id="name" placeholder="Your name" className="mt-1.5" required />
                </div>
                <div>
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  <Input id="email" type="email" placeholder="you@company.com" className="mt-1.5" required />
                </div>
              </div>
              <div>
                <Label htmlFor="subject" className="text-sm font-medium">Subject</Label>
                <Input id="subject" placeholder="How can we help?" className="mt-1.5" required />
              </div>
              <div>
                <Label htmlFor="message" className="text-sm font-medium">Message</Label>
                <Textarea id="message" placeholder="Tell us more..." rows={5} className="mt-1.5" required />
              </div>
              <Button type="submit" size="lg" className="w-full sm:w-auto">
                Send Message <Send size={16} />
              </Button>
            </form>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
