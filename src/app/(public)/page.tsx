import { Header } from "@/components/publicc/Header" 
import { Hero } from "@/components/publicc/Hero" 
import { Services } from "@/components/publicc/Services" 
import { About } from "@/components/publicc/About" 
import { Pricing } from "@/components/publicc/Princing" 
import { Footer } from "@/components/publicc/Footer" 

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      <Header />
      <Hero />
      <Services />
      <About />
      <Pricing />
      <Footer />
    </main>
  );
}
