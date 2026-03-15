"use client"

import Image from "next/image"
import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

export default function ProductImageGallery({ images, name, tag, tagClass }: { 
  images: string[]
  name: string
  tag?: string
  tagClass?: string
}) {
  const [selected, setSelected] = useState(0)

  const prev = () => setSelected((s) => (s === 0 ? images.length - 1 : s - 1))
  const next = () => setSelected((s) => (s === images.length - 1 ? 0 : s + 1))

  return (
    <div className="flex flex-col gap-4">

      {/* Main Image */}
      <div className="relative  shadow-2xl w-full aspect-video rounded-2xl overflow-hidden bg-gray-300">
        <Image
          src={images[selected]}
          alt={name}
          fill
          unoptimized
          priority
          className="object-contain object-center"
        />

        {/* Tag */}
        {tag && (
          <span className={`absolute top-4 right-4 text-[9px] font-bold tracking-widest uppercase px-3 py-1 rounded-full ${tagClass}`}>
            {tag}
          </span>
        )}

        {/* Carousel arrows */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-100 transition"
        >
          <ChevronLeft className="w-8 h-8" />
        </button>
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white shadow flex items-center justify-center hover:bg-gray-100 transition"
        >
          <ChevronRight className="w-8 h-8" />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {images.map((img, index) => (
          <button
            key={index}
            onClick={() => setSelected(index)}
            className={`relative w-80 h-30  rounded-xl overflow-hidden border-2 transition-all ${
              selected === index ? "border-gray-900" : "border-gray-200"
            }`}
          >
            <Image src={img} alt={`${name} ${index + 1}`} fill unoptimized className="object-cover" />
          </button>
        ))}
      </div>

    </div>
  )
}