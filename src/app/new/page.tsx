import GPayGoFaq from "./_components/g-faq";
import GPayGoFeatures from "./_components/g-features";
import GPayGoFooter from "./_components/g-footer";
import GPayGoHero from "./_components/g-hero";
import GPayGoHowItWorks from "./_components/g-how-it-works";
import GPayGoStories from "./_components/g-stories";
import GPayGoTestimonials from "./_components/g-testimonials";
import { urbanist } from "./font";

export default function HomePage () {
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
    )
}