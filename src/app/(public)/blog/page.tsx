import GPayGoBlogGrid from "@/components/landing/blog/g-blog";
import { urbanist } from "@/components/landing/font";
import GPayGoFooter from "@/components/landing/g-footer";
import GPayGoHeader from "@/components/landing/ui/g-header";

export default function Blog() {
  return (
    <main
      className={`${urbanist.variable} bg-white`}
      style={{ fontFamily: "var(--font-urbanist), sans-serif" }}
    >
        <header className="py-[24px]">
            <GPayGoHeader />
        </header>
        <GPayGoBlogGrid />

        <GPayGoFooter logoSrc="/page/logo.svg" />
        
    </main>
  );
}
