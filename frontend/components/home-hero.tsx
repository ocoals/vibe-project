"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";

import { FluidParticles } from "@/components/fluid-particles";
import { GlowCard } from "@/components/glow-card";

export type HomeHeroProps = {
  children: ReactNode;
};

export function HomeHero({ children }: HomeHeroProps) {
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

  const scrollToCreateEvent = useCallback(() => {
    document.getElementById("create-event")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
    window.setTimeout(() => {
      document.getElementById("event-title")?.focus();
    }, 350);
  }, []);

  return (
    <section className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute inset-0 z-0">
        <FluidParticles
          className="absolute inset-0 h-full w-full"
          particleColor={particleColor}
          activeColor={activeColor}
        />
        <div className="absolute inset-0 bg-background/15" aria-hidden />
      </div>

      <div className="relative z-10 mx-auto flex min-h-screen max-w-lg flex-col px-4 py-12 sm:max-w-xl sm:py-16">
        <header className="text-center sm:text-left">
          <h1 className="font-service-name text-3xl font-normal tracking-normal text-foreground">
            WhenWeMeet
          </h1>
          <p className="mt-2 text-muted-foreground">
            후보 날짜와 시간을 정한 뒤 링크로 팀원과 가능 시간을 모아 보세요.
          </p>
          <button
            type="button"
            onClick={scrollToCreateEvent}
            className="mt-6 rounded-xl border border-border bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground transition hover:bg-accent hover:text-accent-foreground"
          >
            시작하기
          </button>
        </header>

        <GlowCard
          id="create-event"
          customSize
          glowColor="orange"
          className="pointer-events-auto mt-10 w-full rounded-2xl p-6 shadow-xl shadow-zinc-900/5 dark:shadow-black/20 sm:p-8"
        >
          {children}
        </GlowCard>
      </div>
    </section>
  );
}
