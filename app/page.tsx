import Header from "@/components/Header";
import Hero from "@/components/Hero";
import OpenClawCTA from "@/components/OpenClawCTA";
import TerminalDemo from "@/components/TerminalDemo";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import QuickStart from "@/components/QuickStart";
import Platforms from "@/components/Platforms";
import Footer from "@/components/Footer";
import testimonials from "@/data/testimonials.json";
import { type Testimonial } from "@/types/testimonial";

export default function Home() {
  const testimonialItems = testimonials as Testimonial[];

  return (
    <>
      <Header />
      <main>
        <Hero testimonials={testimonialItems} />
        <OpenClawCTA />
        <TerminalDemo />
        <Features />
        <HowItWorks />
        <QuickStart />
        <Platforms />
      </main>
      <Footer />
    </>
  );
}
