import { Phone, MessageCircle } from "lucide-react";
import { business } from "@/config/business";

export function FloatingActions() {
  return (
    <div className="fixed bottom-8 right-5 z-40 flex flex-col gap-3 pb-[env(safe-area-inset-bottom)]">
      <a
        href={`https://wa.me/${business.whatsapp}`}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex h-13 w-13 items-center justify-center rounded-full bg-[#25D366] p-3.5 text-white shadow-[0_8px_24px_-6px_rgba(37,211,102,0.6)] transition-transform hover:scale-110"
      >
        <MessageCircle size={22} fill="white" strokeWidth={0} />
      </a>
      <a
        href={`tel:${business.phone}`}
        aria-label="Call RK Traders"
        className="flex h-13 w-13 items-center justify-center rounded-full bg-volt p-3.5 text-white shadow-[0_8px_24px_-6px_rgba(0,87,255,0.6)] transition-transform hover:scale-110"
      >
        <Phone size={20} fill="white" strokeWidth={0} />
      </a>
    </div>
  );
}
