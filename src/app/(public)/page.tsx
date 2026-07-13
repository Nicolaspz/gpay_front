import GPayGoFaq from "@/components/landing/g-faq";
import GPayGoFeatures from "@/components/landing/g-features";
import GPayGoFooter from "@/components/landing/g-footer";
import GPayGoHero from "@/components/landing/g-hero";
import GPayGoHowItWorks from "@/components/landing/g-how-it-works";
import GPayGoStories from "@/components/landing/g-stories";
import GPayGoTestimonials from "@/components/landing/g-testimonials";
import { urbanist } from "@/components/landing/font";

export default function Home() {
  return (
    <main className={`${urbanist.variable} bg-white`} style={{ fontFamily: "var(--font-urbanist), sans-serif" }}>
      <GPayGoHero />
      <GPayGoFeatures />
      <GPayGoHowItWorks />
      <GPayGoStories />
      <GPayGoFaq />
      <GPayGoTestimonials />
      <GPayGoFooter
        backgroundSrc="/page/footer-bg.png"
        logoSrc="/page/logo.svg"
      />
    </main>
  );
}
