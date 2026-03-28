"use client";

import { useEffect, useState } from "react";

import { FluidParticles } from "@/components/fluid-particles";

export function LandingBackground() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const mql = window.matchMedia("(prefers-color-scheme: dark)");
    const sync = () => setIsDark(mql.matches);
    sync();
    mql.addEventListener("change", sync);
    return () => mql.removeEventListener("change", sync);
  }, []);

  const particleColor = isDark ? "#a1a1aa" : "#71717a";
  const activeColor = isDark ? "#fafafa" : "#27272a";

  return (
    <div className="pointer-events-none absolute inset-0 z-0">
      <FluidParticles
        className="absolute inset-0 h-full w-full"
        particleColor={particleColor}
        activeColor={activeColor}
      />
      <div className="absolute inset-0 bg-background/15" aria-hidden />
    </div>
  );
}
