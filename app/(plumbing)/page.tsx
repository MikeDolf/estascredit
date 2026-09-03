import Hero from "@/components/home/Hero";
import FeatureGrid from "@/components/home/FeatureGrid";
import HowItWorks from "@/components/home/HowItWorks";
import Testimonials from "@/components/home/Testimonials";
import ServiceAreas from "@/components/home/ServiceAreas";
import FinalCta from "@/components/home/FinalCta";

export default function HomePage() {
  return (
    <>
      <Hero />
      <FeatureGrid />
      <HowItWorks />
      <Testimonials />
      <ServiceAreas />
      <FinalCta />
    </>
  );
}
