import Link from "next/link";
import { Button } from "../ui/button";

export default function Banner() {
  return (
      <section className="w-screen bg-[#1c2328] py-20 overflow-hidden">
      <div className="container grid xl:grid-cols-[1fr_2fr] gap-12 items-center">

        <div className="grid gap-6">
          <p className="text-[#4285F4] text-xs tracking-[0.4em] uppercase">Editorial</p>
          <h2
            className="text-white text-4xl font-light leading-tight"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            The Art of <br />
            Dressing Well
          </h2>
          <p className="text-white/40 text-sm leading-loose">
            Style is not about trends — it is about intention.
            Each piece in our archive is chosen for longevity.
          </p>
          <Link href="/brands">
            <Button className="bg-transparent border border-white/20 hover:border-[#3f4042]  text-white px-6 py-2.5 text-xs tracking-[0.3em] uppercase transition-all duration-300 w-fit">
              Explore Brands
            </Button>
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { num: "200+", label: "Curated Brands" },
            { num: "40%", label: "Archive Sale" },
            { num: "126", label: "New Arrivals" },
          ].map((s) => (
            <div key={s.label} className="border border-white/10 rounded-2xl p-6 grid gap-2 hover:border-[#4285F4]/40 transition-colors duration-300">
              <p
                className="text-white text-3xl xl:text-4xl font-light"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {s.num}
              </p>
              <p className="text-white/30 text-[10px] tracking-[0.3em] uppercase">{s.label}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}