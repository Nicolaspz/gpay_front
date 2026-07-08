import GPayGoHero from "./_components/g-hero";
import { urbanist } from "./font";

export default function HomePage () {
    return (
        <main className={`${urbanist.variable} bg-white`} style={{ fontFamily: "var(--font-urbanist), sans-serif" }}>
            <GPayGoHero />
        </main>
    )
}