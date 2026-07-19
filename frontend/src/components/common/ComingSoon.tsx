import { Section } from "@/components/ui/Section";
import { Button } from "@/components/ui/Button";
import { usePageMeta } from "@/hooks/usePageMeta";

interface ComingSoonProps {
  title: string;
  description: string;
}

/** Placeholder for pages in the sitemap that aren't built out yet.
 * Swap each of these for a real page component as they're built —
 * routes in App.tsx won't need to change. */
export function ComingSoon({ title, description }: ComingSoonProps) {
  usePageMeta({
    title: `${title} | RK Traders`,
    description,
  });

  return (
    <Section className="min-h-[50vh]">
      <p className="mb-3 font-mono text-xs font-medium uppercase tracking-[0.2em] text-volt">
        Coming Soon
      </p>
      <h1 className="max-w-xl font-display text-3xl font-bold tracking-tight md:text-4xl">
        {title}
      </h1>
      <p className="mt-4 max-w-lg text-slate">{description}</p>
      <div className="mt-8">
        <Button as="a" href="/">
          Back to Home
        </Button>
      </div>
    </Section>
  );
}
