import { arrow, naya } from "@/src/assets";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/src/components/ui/breadcrumb";
import { Button } from "@/src/components/ui/button";
import Image from "next/image";

export default function Brands() {
  return (
    <>
    <section className="w-full">

      {/* ── Hero ── */}
      <div className="relative w-full h-[50vh] sm:h-[65vh] md:h-[80vh] lg:h-screen overflow-hidden">

        {/* Background Image */}
        <Image
          src={naya}
          alt="Brand Banner"
          fill
          priority
          className="object-cover object-center"
        />

        {/* Dark vignette — matches the dark edges in the reference */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/40" />

        {/* ── TOP ROW: Breadcrumb ── */}
        <div className="absolute container z-20">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink
                  href="/"
                  className="text-white/60 hover:text-white text-xs tracking-widest uppercase transition-colors"
                >
                  Home
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator className="text-white/30" />
              <BreadcrumbItem>
                <BreadcrumbPage className="text-white text-xs tracking-widest uppercase">
                  Brands
                </BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* ── BOTTOM CONTENT ── */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-6 pb-10 sm:px-10 sm:pb-12 md:px-14 md:pb-16">

          {/* Limited Drop badge — exactly like reference */}
          <div className="mb-4">
            <span className="bg-green-500 text-black text-[10px] font-semibold tracking-widest uppercase px-3 py-1.5 rounded-full">
              Limited Drop
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-white font-bold leading-tight mb-4"
            style={{ fontSize: "clamp(2.8rem, 7vw, 5.5rem)" }}
          >
            New <br /> Arrivals
          </h1>

          {/* Description */}
          <p className="text-white/70 text-xs sm:text-sm leading-relaxed max-w-xs mb-6">
            Spring/Summer '24: The New Collective. Discover a curated selection
            of structured silhouettes and premium eco-conscious fabrics.
          </p>

          {/* Buttons — matches reference exactly */}
          <div className="flex gap-3 flex-wrap">
            <Button className="bg-white/10 backdrop-blur-sm border border-white/50 text-white text-[10px] tracking-[0.2em] uppercase px-5 py-2.5 rounded-full hover:bg-white hover:text-black transition-all duration-300">
              Explore Collection
            </Button>
            <Button className="bg-transparent border border-white/30 text-white/80 text-[10px] tracking-[0.2em] uppercase px-5 py-2.5 rounded-full hover:bg-white/10 hover:text-white transition-all duration-300">
              View Lookbook
            </Button>
          </div>
        </div>
      </div>

    

    </section>
    jhbaj
    </>
    
  );
}