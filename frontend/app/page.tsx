import Features from "@/components/Features";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import Pricing from "@/components/Pricing";

export default function Home() {
  return (
    <div className=" w-full h-screen grid place-items-center ">
      <Hero />
      <Features />
      <Pricing />
      <Footer />
    </div>
  );
}
