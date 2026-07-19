import { useState, type FormEvent } from "react";
import { MapPin, Phone, Mail, Clock, MessageCircle, Send, CheckCircle2 } from "lucide-react";
import { Section, Eyebrow } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { business, fullAddress } from "@/config/business";
import { usePageMeta } from "@/hooks/usePageMeta";
import { api } from "@/lib/api";

export function Contact() {
  const [form, setForm] = useState({ name: "", phone: "", message: "" });
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  usePageMeta({
    title: "Contact Us | RK Traders — Electrical Store, Aminabad, Lucknow",
    description: "Get in touch with RK Traders — visit our showroom in Aminabad, Lucknow, call us, or send a message. Wholesale and retail enquiries welcome.",
  });

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      await api.post("/enquiries", form);
      setStatus("sent");
      setForm({ name: "", phone: "", message: "" });
    } catch {
      setStatus("error");
    }
  }

  return (
    <Section className="pt-12 md:pt-16">
      <Eyebrow>Contact</Eyebrow>
      <div className="grid grid-cols-1 gap-12 md:grid-cols-2">
        {/* Info column */}
        <div>
          <h1 className="max-w-md font-display text-3xl font-bold tracking-tight md:text-4xl">
            Come see the showroom, or just message us.
          </h1>

          <dl className="mt-10 space-y-6">
            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-volt/10 text-volt">
                <MapPin size={18} />
              </span>
              <div>
                <dt className="font-display text-sm font-semibold text-navy">Showroom Address</dt>
                <dd className="mt-0.5 text-sm text-slate">{fullAddress}</dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-volt/10 text-volt">
                <Phone size={18} />
              </span>
              <div>
                <dt className="font-display text-sm font-semibold text-navy">Phone</dt>
                <dd className="mt-0.5 text-sm text-slate">
                  <a href={`tel:${business.phone}`} className="hover:text-volt">{business.phone}</a>
                  {" · "}
                  <a href={`tel:${business.phoneSecondary}`} className="hover:text-volt">{business.phoneSecondary}</a>
                </dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-volt/10 text-volt">
                <Mail size={18} />
              </span>
              <div>
                <dt className="font-display text-sm font-semibold text-navy">Email</dt>
                <dd className="mt-0.5 text-sm text-slate">{business.email}</dd>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-volt/10 text-volt">
                <Clock size={18} />
              </span>
              <div>
                <dt className="font-display text-sm font-semibold text-navy">Working Hours</dt>
                <dd className="mt-0.5 text-sm text-slate">{business.hours}</dd>
              </div>
            </div>
          </dl>

          <div className="mt-8 flex gap-3">
            <a
              href={`https://wa.me/${business.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex h-10 w-10 items-center justify-center rounded-full border border-line text-slate hover:border-volt hover:text-volt"
            >
              <MessageCircle size={17} />
            </a>
            {/* Add Instagram/Facebook icon links here once real social URLs exist —
                business.social.instagram / .facebook are placeholders for now. */}
          </div>

          <div className="mt-8 aspect-video overflow-hidden rounded-2xl border border-line">
            <iframe
              title="RK Traders location"
              width="100%"
              height="100%"
              loading="lazy"
              src={`https://maps.google.com/maps?q=${encodeURIComponent(fullAddress)}&output=embed`}
            />
          </div>
        </div>

        {/* Form column */}
        <div className="rounded-2xl border border-line bg-white p-6 md:p-8">
          {status === "sent" ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <CheckCircle2 size={40} className="mb-4 text-emerald-500" />
              <h2 className="font-display text-xl font-semibold text-navy">Message sent</h2>
              <p className="mt-2 max-w-xs text-sm text-slate">
                Thanks for reaching out — our team usually responds within a few hours during
                working hours.
              </p>
              <Button className="mt-6" onClick={() => setStatus("idle")}>
                Send another message
              </Button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-navy">Your Name</label>
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  className="w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-volt"
                  placeholder="Your Name"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-navy">Phone Number</label>
                <input
                  required
                  type="tel"
                  value={form.phone}
                  onChange={(e) => setForm((f) => ({ ...f, phone: e.target.value }))}
                  className="w-full rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-volt"
                  placeholder="Phone Number"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-sm font-medium text-navy">Message</label>
                <textarea
                  required
                  rows={5}
                  value={form.message}
                  onChange={(e) => setForm((f) => ({ ...f, message: e.target.value }))}
                  className="w-full resize-none rounded-lg border border-line px-4 py-2.5 text-sm outline-none focus:border-volt"
                  placeholder="Your message..."
                />
              </div>
              {status === "error" && (
                <p className="text-sm text-red-500">
                  Couldn't send that — check the backend is running, or call us directly at{" "}
                  {business.phone}.
                </p>
              )}
              <Button
                type="submit"
                disabled={status === "sending"}
                icon={<Send size={16} />}
                className="w-full"
              >
                {status === "sending" ? "Sending..." : "Send Message"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </Section>
  );
}
