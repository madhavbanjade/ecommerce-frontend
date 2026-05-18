"use client";

import Link from "next/link";
import { Button } from "../ui/button";
import Image from "next/image";
import { menImg, womenImg } from "../../assets";
import { motion,  } from "framer-motion";

import { CountUp } from "./count-up";


const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" as const, delay },
});

const fadeIn = (delay = 0) => ({
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 1, ease: "easeOut" as const, delay },
});

const slideIn = (delay = 0, direction: "left" | "right" = "left") => ({
  initial: { opacity: 0, x: direction === "left" ? -40 : 40 },
  animate: { opacity: 1, x: 0 },
  transition: { duration: 0.9, ease: "easeOut" as const, delay },
});


export default function Hero() {
  return (
    <section className="relative w-screen py-4 bg-div grid overflow-hidden mb-8">

      {/* Background texture */}
      <div
      
      />
      {/* Animated ambient glow */}
      <motion.div
         className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
        animate={{ scale: [1, 1.2, 1], opacity: [0.05, 0.05, 0.05] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="container grid grid-cols-1 xl:grid-cols-2 gap-16 items-center  ">

        {/* Left — Text */}
        <div className="grid gap-8">  

          <motion.div {...fadeUp(0.1)} className="grid gap-2">
            <p
              className="text-[#4285F4] text-xs tracking-[0.4em] uppercase font-medium"
              style={{ fontFamily: "'Cormorant Garamond', serif" }}
            >
              Summer / Winter 2026
            </p>
            <motion.div
              className="h-px bg-[#4285F4]"
              initial={{ width: 0 }}
              animate={{ width: 48 }}
              transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
            />
          </motion.div>

          <motion.h2
            {...fadeUp(0.25)}
            className="text-white tracking-widest !text-4xl  md:!text-6xl !xl:text-8xl !2xl:text-9xl"
            style={{ fontFamily: "'Cormorant Garamond', serif" }}
          >
            Redefine{" "}
            <motion.span
              className="text-[#4285F4]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 1, delay: 0.6 }}
            >
              Your
            </motion.span>{" "}
            <br />
            Style With Timeless Confidence
          </motion.h2>

          <motion.p
            {...fadeUp(0.4)}
            className="text-white/50"
            style={{ fontFamily: "'Jost', sans-serif" }}
          >
            Curated luxury for the discerning few. Pieces designed to outlast
            seasons — in Paris, crafted globally.
          </motion.p>

          <motion.div {...fadeUp(0.55)} className="flex gap-4 items-center">
          
            <Link
              href="/products"
              className="text-white/40 hover:text-white text-xs tracking-[0.3em] uppercase transition-colors duration-300 flex items-center gap-2 group"
            >
              View Products
              <span className="w-4 group-hover:w-8 h-px bg-current inline-block transition-all duration-300" />
            </Link>
          </motion.div>

        </div>

        {/* Right — Editorial card stack */}
        <div className="hidden xl:grid grid-cols-2 gap-4">

          {/* Column 1 */}
          <motion.div {...slideIn(0.3, "right")} className="grid gap-4 pt-12 ">

            {/* Men's image card */}
            <motion.div
              className="relative rounded-xl overflow-hidden flex items-end p-5 h-90"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Image src={menImg} alt="Men's FW26" fill className="object-cover" priority />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <motion.div
                className="grid gap-1 z-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <p className="text-white/30 text-[10px] tracking-widest uppercase">New In</p>
                <p className="text-white text-sm font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Men's FW26
                </p>
              </motion.div>
            </motion.div>

            {/* Stat card */}
            <motion.div
              {...fadeIn(0.6)}
              className="bg-[#4285F4]/10 border border-[#4285F4]/20 rounded-xl flex items-center justify-center p-6"
              whileHover={{ borderColor: "rgba(66,133,244,0.6)", backgroundColor: "rgba(66,133,244,0.15)" }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-[#4285F4] text-3xl font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.9, duration: 0.8 }}
                >
              <CountUp start={0} target={200} suffix="+" />
                </motion.span>
                <span className="block text-xs tracking-widest uppercase text-[#4285F4]/60 mt-1">
                  Curated Brands
                </span>
              </p>
            </motion.div>

          </motion.div>

          {/* Column 2 — offset down */}
          <motion.div {...slideIn(0.5, "right")} className="grid gap-4 pt-12">

            {/* Members badge */}
            <motion.div
              className="bg-white/5 border border-white/5 rounded-xl flex items-center justify-center h-32"
              whileHover={{ backgroundColor: "rgba(255,255,255,0.08)" }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-white/20 text-xs tracking-[0.3em] uppercase text-center">
                Members get{" "}
                <span
                  className="text-white text-2xl font-light block mt-1"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
                >
                  20% off
                </span>
              </p>
            </motion.div>

            {/* Women's image card */}
            <motion.div
              className="relative rounded-xl h-90 overflow-hidden flex items-end p-5"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              <Image src={womenImg} alt="Women's FW26" fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <motion.div
                className="grid gap-1 z-10"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.6 }}
              >
                <p className="text-white/30 text-[10px] tracking-widest uppercase">Featured</p>
                <p className="text-white text-sm font-light" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                  Women's FW26
                </p>
              </motion.div>
            </motion.div>

          </motion.div>

        </div>

      </div>
   

    </section>
    
  );
}

