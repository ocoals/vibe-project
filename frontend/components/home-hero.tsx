"use client";

import { type ReactNode } from "react";

import { GlowCard } from "@/components/glow-card";

export type HomeHeroProps = {
  children: ReactNode;
};

export function HomeHero({ children }: HomeHeroProps) {
  return (
    <section className="relative min-h-screen">
      <div className="relative mx-auto flex min-h-screen max-w-lg flex-col px-4 py-12 sm:max-w-xl sm:py-16 lg:max-w-4xl xl:max-w-5xl">
        <header className="text-center sm:text-left">
          <h1 className="font-service-name text-3xl font-normal tracking-normal text-foreground">
            WhenWeMeet
          </h1>
          <p className="mt-2 text-muted-foreground">
            후보 날짜와 시간을 정한 뒤 링크로 팀원과 가능 시간을 모아 보세요.
          </p>
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
