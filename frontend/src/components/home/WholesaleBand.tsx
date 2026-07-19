import { ArrowRight, FileDown, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { CurrentLine } from "@/components/ui/Section";

export function WholesaleBand() {
  return (
    <div className="bg-white px-6 py-20">
      <div className="mx-auto max-w-7xl">
        <CurrentLine className="mb-16" />
        <div className="grid grid-cols-1 items-center gap-10 md:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-volt">
              For Contractors & Dealers
            </p>
            <h2 className="max-w-lg font-display text-3xl font-bold tracking-tight text-navy md:text-4xl">
              Bulk pricing, GST billing, and a dedicated wholesale desk
            </h2>
            <p className="mt-4 max-w-md text-slate">
              Register as a dealer for tiered pricing, request a formal
              quotation for your next project, or download our full product
              catalogue.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Button as="a" href="/wholesale" icon={<ArrowRight size={16} />}>
                Wholesale Portal
              </Button>
              <Button as="a" href="/contact" variant="secondary" icon={<FileDown size={16} />}>
                Request Catalogue
              </Button>
            </div>
          </div>

          <div className="rounded-2xl bg-surface p-6">
            <div className="mb-4 flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-volt/10 text-volt">
                <PhoneCall size={18} />
              </span>
              <div>
                <p className="font-display text-sm font-semibold text-navy">
                  Prefer to talk it through?
                </p>
                <p className="text-xs text-slate">
                  Our team responds within business hours
                </p>
              </div>
            </div>
            <Button as="a" href="/contact" variant="secondary" className="w-full">
              Request a Callback
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
