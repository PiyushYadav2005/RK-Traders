import { Hero } from "@/components/home/Hero";
import { TrustStats } from "@/components/home/TrustStats";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { BrandsMarquee } from "@/components/home/BrandsMarquee";
import { CategoryGrid } from "@/components/home/CategoryGrid";
import { WholesaleBand } from "@/components/home/WholesaleBand";
import { usePageMeta } from "@/hooks/usePageMeta";

export function Home() {
  usePageMeta({
    title: "RK Traders | Electrical Wholesale & Retail Store in Aminabad, Lucknow",
    description: "RK Traders is Lucknow's trusted electrical wholesale and retail store in Aminabad — LED lights, wires, cables, switches, fans, MCBs and more, for homes, contractors and businesses.",
  });

  return (
    <>
      <Hero />
      <TrustStats />
      <WhyChooseUs />
      <CategoryGrid />
      <BrandsMarquee />
      <WholesaleBand />
    </>
  );
}
