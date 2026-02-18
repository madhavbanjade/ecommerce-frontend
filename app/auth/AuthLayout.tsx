import { ReactNode } from "react";
import "../globals.css";

interface AuthLayoutProps {
  children: ReactNode;
  leftText?: string;
}

function AuthLayout({ children, leftText }: AuthLayoutProps) {
  return (
    <main className="min-h-screen w-full flex overflow-hidden bg-accent">

      {/* Left panel — only shows on lg+ */}
      {leftText && (
        <section
          className="
            hidden lg:flex
            lg:w-[42%] xl:w-[45%]
            shrink-0
            flex-col items-start justify-start
            p-10 xl:p-14
            pb-16 xl:pb-20
            bg-cover bg-center
            xl:rounded-tr-4xl xl:rounded-br-4xl
            relative
          "
          style={{ backgroundImage: `url('/image/backgroundimage.jpg')` }}
        >
          {/* Dark overlay for legibility */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/50 to-black/70 xl:rounded-tr-4xl xl:rounded-br-4xl" />

          {/* Text with glow and shadow */}
          <h2 className="
            relative z-10
             lg:mt-30 xl:mt-25
            text-3xl lg:text-4xl xl:text-5xl
            font-bold leading-tight
            text-white
            drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)]
            [text-shadow:_0_0_30px_rgba(255,255,255)]
          ">
            {leftText}
          </h2>
        </section>
      )}

      {/* Right panel — form area */}
      <section
        className="
          flex-1
          flex flex-col items-center justify-center
          min-h-screen
          px-4 py-10
          sm:px-8
          md:px-12
        "
      >
        {children}
      </section>

    </main>
  );
}

export default AuthLayout;