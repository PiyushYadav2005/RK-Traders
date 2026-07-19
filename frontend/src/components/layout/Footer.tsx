import { Link } from "react-router-dom";
import { MapPin, Phone, Mail, Clock, Zap } from "lucide-react";
import { business, fullAddress } from "@/config/business";

const columns = [
  {
    title: "Shop",
    links: [
      { label: "All Products", href: "/products" },
      { label: "Wholesale Portal", href: "/wholesale" },
      { label: "Get a Quote", href: "/quote" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Gallery", href: "/gallery" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "/contact" },
      { label: "FAQ", href: "/faq" },
      { label: "Return Policy", href: "/return-policy" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="bg-navy px-6 pt-16 pb-8 text-white/70">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-[1.3fr_1fr_1fr_1fr]">
          <div>
            <div className="mb-4 flex items-center gap-2 font-display text-lg font-bold text-white">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-volt">
                <Zap size={16} strokeWidth={2.5} />
              </span>
              RK Traders
            </div>
            <p className="mb-4 max-w-xs text-sm leading-relaxed">
              {business.tagline} — wholesale and retail electrical supply serving
              homeowners, contractors, and businesses across Lucknow.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              <a href={business.mapsUrl} className="flex items-start gap-2 hover:text-live">
                <MapPin size={16} className="mt-0.5 shrink-0" />
                {fullAddress}
              </a>
              <a href={`tel:${business.phone}`} className="flex items-center gap-2 hover:text-live">
                <Phone size={16} />
                {business.phone}
              </a>
              <a href={`mailto:${business.email}`} className="flex items-center gap-2 hover:text-live">
                <Mail size={16} />
                {business.email}
              </a>
              <p className="flex items-center gap-2">
                <Clock size={16} />
                {business.hours}
              </p>
            </div>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h4 className="mb-4 font-display text-sm font-semibold text-white">
                {col.title}
              </h4>
              <ul className="flex flex-col gap-3 text-sm">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link to={link.href} className="hover:text-live">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 text-xs md:flex-row">
          <p>© {new Date().getFullYear()} RK Traders. All rights reserved.</p>
          <div className="flex gap-6">
            <Link to="/privacy-policy" className="hover:text-live">
              Privacy Policy
            </Link>
            <Link to="/terms" className="hover:text-live">
              Terms & Conditions
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
