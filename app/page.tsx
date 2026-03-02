import Header from "@/components/Header";
import Hero from "@/components/Hero";
import Pillars from "@/components/Pillars";
import SdkPreview from "@/components/SdkPreview";
import Testimonials from "@/components/Testimonials";
import CtaBanner from "@/components/CtaBanner";
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
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <Pillars />
        <SdkPreview />
        <div className="h-px bg-gradient-to-r from-transparent via-border to-transparent" />
        <Testimonials testimonials={testimonialItems} />
        <CtaBanner />
      </main>
      <Footer />
    </>
  );
}
