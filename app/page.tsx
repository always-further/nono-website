import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TerminalDemo from "@/components/TerminalDemo";
import Testimonials from "@/components/Testimonials";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import SdkPreview from "@/components/SdkPreview";
import QuickStart from "@/components/QuickStart";
import Footer from "@/components/Footer";
import testimonials from "@/data/testimonials.json";
import { type Testimonial } from "@/types/testimonial";

export default function Home() {
  const testimonialItems = testimonials as Testimonial[];

  return (
    <>
      <Header />
      <main>
        <Hero />
        <TerminalDemo />
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <Testimonials testimonials={testimonialItems} />
        <Features />
        <HowItWorks />
        <SdkPreview />
        <QuickStart />
      </main>
      <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
      <Footer />
    </>
  );
}
