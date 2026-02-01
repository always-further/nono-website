import Header from "@/components/Header";
import Hero from "@/components/Hero";
import AgentLogos from "@/components/AgentLogos";
import Features from "@/components/Features";
import HowItWorks from "@/components/HowItWorks";
import QuickStart from "@/components/QuickStart";
import Platforms from "@/components/Platforms";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <AgentLogos />
        <Features />
        <HowItWorks />
        <QuickStart />
        <Platforms />
      </main>
      <Footer />
    </>
  );
}
