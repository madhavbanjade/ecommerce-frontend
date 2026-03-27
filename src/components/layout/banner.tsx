import Link from "next/link";
import { Button } from "../ui/button";
import { CountUp } from "./count-up";

export default function Banner() {
  return (
      <section className="w-full bg-div py-4 overflow-hidden">
      <div className="container grid xl:grid-cols-[1fr_2fr] gap-12 items-center">

        <div className="grid gap-6">
          <p className="text-[#4285F4] text-xs tracking-[0.4em] uppercase">Editorial</p>
          <h2
            className="text-white !text-4xl font-light leading-tight"
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
            <Button variant={"destructive"} >
              Explore Brands
            </Button>
          </Link>
        </div>

        {/* Stat cards */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { Value:<CountUp start={123} target={200} suffix="+"/>, label: "Curated Brands" },
            { Value:<CountUp start={80} target={150} suffix="+"/>, label: "Archive Sale" },
            { Value:<CountUp start={0} target={50} suffix="k+"/>, label: "New Arrivals" },
          ].map((s) => (
            <div key={s.label} className="border border-white/10 rounded-2xl p-6 grid gap-2 hover:border-[#4285F4]/40 transition-colors duration-300">
              <p
                className="text-white text-3xl xl:text-4xl font-light"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {s.Value}
              </p>
              <p className="text-white/30 text-[10px] tracking-[0.3em] uppercase">{s.label}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}