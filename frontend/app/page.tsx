import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";

export default function Home() {
  return (
    <div className=" w-full h-screen grid place-items-center bg-gradient-to-br from-[#0a0b1a] to-[#1a237e] ">
      <Hero />
      <Features />
      <Pricing />
      <Footer />
    </div>
  );
}
