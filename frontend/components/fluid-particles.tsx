"use client";

import { useEffect, useRef } from "react";

export type FluidParticlesProps = {
  className?: string;
  /**
   * 면적 대비 입자 수 조절(기준 해상도 대비 스케일).
   * 값이 클수록 입자가 촘촘해집니다.
   */
  density?: number;
  /** 기본 입자 반경(CSS px) */
  size?: number;
  /** 평상시 입자 색 */
  particleColor?: string;
  /** 커서 영향권 안에서 강조되는 색 */
  activeColor?: string;
  /** 마우스 영향 반경(CSS px) */
  blastRadius?: number;
  /** 마우스로부터 밀어내는 힘 배수 */
  blastStrength?: number;
  /** 근접 입자 사이 연결선 최대 거리(CSS px) */
  linkDistance?: number;
  /** 연결선 불투명도(0–1) */
  linkOpacity?: number;
  /** 마우스가 캔버스 밖으로 나간 뒤 “활성” 상태를 유지하는 시간(ms). 0이면 타이머 없음 */
  hoverPersistMs?: number;
};

const DEFAULTS = {
  density: 48,
  size: 1.35,
  particleColor: "#71717a",
  activeColor: "#fafafa",
  blastRadius: 140,
  blastStrength: 0.85,
  linkDistance: 90,
  linkOpacity: 0.12,
  hoverPersistMs: 400,
} as const;

type ParticleConfig = {
  size: number;
  blastRadius: number;
  blastStrength: number;
  linkDistance: number;
  linkOpacity: number;
  particleColor: string;
  activeColor: string;
};

class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  r: number;

  constructor(width: number, height: number, size: number) {
    this.x = Math.random() * width;
    this.y = Math.random() * height;
    this.vx = (Math.random() - 0.5) * 0.35;
    this.vy = (Math.random() - 0.5) * 0.35;
    this.r = size * (0.55 + Math.random() * 0.9);
  }

  step(
    width: number,
    height: number,
    mouseX: number,
    mouseY: number,
    cfg: ParticleConfig,
    mouseActive: boolean,
  ) {
    if (mouseActive) {
      const dx = this.x - mouseX;
      const dy = this.y - mouseY;
      const distSq = dx * dx + dy * dy;
      const br = cfg.blastRadius;
      if (distSq > 0 && distSq < br * br) {
        const dist = Math.sqrt(distSq);
        const t = (br - dist) / br;
        const nx = dx / dist;
        const ny = dy / dist;
        this.vx += nx * t * cfg.blastStrength * 0.45;
        this.vy += ny * t * cfg.blastStrength * 0.45;
      }
    }

    const friction = 0.988;
    this.vx *= friction;
    this.vy *= friction;

    this.x += this.vx;
    this.y += this.vy;

    const margin = 4;
    if (this.x < margin) {
      this.x = margin;
      this.vx *= -0.6;
    } else if (this.x > width - margin) {
      this.x = width - margin;
      this.vx *= -0.6;
    }
    if (this.y < margin) {
      this.y = margin;
      this.vy *= -0.6;
    } else if (this.y > height - margin) {
      this.y = height - margin;
      this.vy *= -0.6;
    }

    this.vx += (Math.random() - 0.5) * 0.02;
    this.vy += (Math.random() - 0.5) * 0.02;
  }
}

function particleCountForArea(
  width: number,
  height: number,
  density: number,
): number {
  const refArea = 800 * 600;
  const area = Math.max(1, width * height);
  return Math.max(32, Math.floor((density * area) / refArea));
}

function hexToRgb(hex: string): { r: number; g: number; b: number } | null {
  const m = /^#?([0-9a-f]{6})$/i.exec(hex.trim());
  if (!m) return null;
  const n = parseInt(m[1], 16);
  return { r: (n >> 16) & 255, g: (n >> 8) & 255, b: n & 255 };
}

export function FluidParticles({
  className,
  density = DEFAULTS.density,
  size = DEFAULTS.size,
  particleColor = DEFAULTS.particleColor,
  activeColor = DEFAULTS.activeColor,
  blastRadius = DEFAULTS.blastRadius,
  blastStrength = DEFAULTS.blastStrength,
  linkDistance = DEFAULTS.linkDistance,
  linkOpacity = DEFAULTS.linkOpacity,
  hoverPersistMs = DEFAULTS.hoverPersistMs,
}: FluidParticlesProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const rafRef = useRef<number | null>(null);
  const hoverTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const reducedMotionRef = useRef(false);
  const animRef = useRef({
    stopLoop: () => {},
    startLoop: () => {},
    drawFrame: () => {},
  });

  const mouseRef = useRef({
    x: 0,
    y: 0,
    active: false,
    insideCanvas: false,
  });

  const propsRef = useRef({
    density,
    size,
    particleColor,
    activeColor,
    blastRadius,
    blastStrength,
    linkDistance,
    linkOpacity,
    hoverPersistMs,
  });

  useEffect(() => {
    propsRef.current = {
      density,
      size,
      particleColor,
      activeColor,
      blastRadius,
      blastStrength,
      linkDistance,
      linkOpacity,
      hoverPersistMs,
    };
  }, [
    density,
    size,
    particleColor,
    activeColor,
    blastRadius,
    blastStrength,
    linkDistance,
    linkOpacity,
    hoverPersistMs,
  ]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let logicalWidth = 0;
    let logicalHeight = 0;

    const getConfig = (): ParticleConfig => {
      const p = propsRef.current;
      return {
        size: p.size,
        blastRadius: p.blastRadius,
        blastStrength: p.blastStrength,
        linkDistance: p.linkDistance,
        linkOpacity: p.linkOpacity,
        particleColor: p.particleColor,
        activeColor: p.activeColor,
      };
    };

    const clearHoverTimer = () => {
      if (hoverTimerRef.current !== null) {
        clearTimeout(hoverTimerRef.current);
        hoverTimerRef.current = null;
      }
    };

    const scheduleHoverEnd = () => {
      clearHoverTimer();
      const ms = propsRef.current.hoverPersistMs;
      if (ms <= 0) {
        mouseRef.current.active = false;
        return;
      }
      hoverTimerRef.current = setTimeout(() => {
        mouseRef.current.active = false;
        hoverTimerRef.current = null;
      }, ms);
    };

    const motionMql = window.matchMedia("(prefers-reduced-motion: reduce)");
    const syncReducedMotion = () => {
      reducedMotionRef.current = motionMql.matches;
    };
    syncReducedMotion();

    const onReducedMotionChange = () => {
      syncReducedMotion();
      if (reducedMotionRef.current) {
        animRef.current.stopLoop();
        animRef.current.drawFrame();
      } else {
        animRef.current.startLoop();
      }
    };
    motionMql.addEventListener("change", onReducedMotionChange);

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      logicalWidth = Math.max(1, rect.width);
      logicalHeight = Math.max(1, rect.height);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = Math.floor(logicalWidth * dpr);
      canvas.height = Math.floor(logicalHeight * dpr);

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.scale(dpr, dpr);

      const p = propsRef.current;
      const n = particleCountForArea(
        logicalWidth,
        logicalHeight,
        p.density,
      );
      const next: Particle[] = [];
      for (let i = 0; i < n; i += 1) {
        next.push(new Particle(logicalWidth, logicalHeight, p.size));
      }
      particlesRef.current = next;
    };

    const ro = new ResizeObserver(() => {
      resize();
    });
    ro.observe(canvas);
    resize();

    const windowToCanvas = (clientX: number, clientY: number) => {
      const rect = canvas.getBoundingClientRect();
      return {
        x: clientX - rect.left,
        y: clientY - rect.top,
      };
    };

    const onMouseMove = (e: MouseEvent) => {
      const { x, y } = windowToCanvas(e.clientX, e.clientY);
      mouseRef.current.x = x;
      mouseRef.current.y = y;
      mouseRef.current.insideCanvas =
        x >= 0 && y >= 0 && x <= logicalWidth && y <= logicalHeight;
      if (mouseRef.current.insideCanvas) {
        clearHoverTimer();
        mouseRef.current.active = true;
      }
    };

    const onMouseLeaveWindow = () => {
      mouseRef.current.insideCanvas = false;
      scheduleHoverEnd();
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseleave", onMouseLeaveWindow);

    const drawFrame = () => {
      const cfg = getConfig();
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      ctx.clearRect(0, 0, logicalWidth, logicalHeight);

      const pRgb = hexToRgb(cfg.particleColor);
      const aRgb = hexToRgb(cfg.activeColor);
      const brSq = cfg.blastRadius * cfg.blastRadius;

      if (!reducedMotionRef.current) {
        for (let i = 0; i < particles.length; i += 1) {
          particles[i]!.step(
            logicalWidth,
            logicalHeight,
            mouse.x,
            mouse.y,
            cfg,
            mouse.active,
          );
        }
      }

      const ld = cfg.linkDistance;
      const ldSq = ld * ld;

      for (let i = 0; i < particles.length; i += 1) {
        const pi = particles[i]!;
        for (let j = i + 1; j < particles.length; j += 1) {
          const pj = particles[j]!;
          const dx = pi.x - pj.x;
          const dy = pi.y - pj.y;
          const dSq = dx * dx + dy * dy;
          if (dSq < ldSq && dSq > 0) {
            const d = Math.sqrt(dSq);
            const alpha = (1 - d / ld) * cfg.linkOpacity;
            const lr = pRgb ?? { r: 113, g: 113, b: 122 };
            ctx.strokeStyle = `rgba(${lr.r},${lr.g},${lr.b},${alpha})`;
            ctx.lineWidth = 0.6;
            ctx.beginPath();
            ctx.moveTo(pi.x, pi.y);
            ctx.lineTo(pj.x, pj.y);
            ctx.stroke();
          }
        }
      }

      for (let i = 0; i < particles.length; i += 1) {
        const p = particles[i]!;
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distSq = dx * dx + dy * dy;
        const near = mouse.active && distSq < brSq;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);

        if (pRgb && aRgb) {
          const t = near
            ? Math.max(0, 1 - Math.sqrt(distSq) / cfg.blastRadius)
            : 0;
          const r = Math.round(pRgb.r + (aRgb.r - pRgb.r) * t);
          const g = Math.round(pRgb.g + (aRgb.g - pRgb.g) * t);
          const b = Math.round(pRgb.b + (aRgb.b - pRgb.b) * t);
          ctx.fillStyle = `rgb(${r},${g},${b})`;
        } else {
          ctx.fillStyle = near ? cfg.activeColor : cfg.particleColor;
        }
        ctx.fill();
      }
    };

    const tick = () => {
      drawFrame();
      rafRef.current = requestAnimationFrame(tick);
    };

    const stopLoop = () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
        rafRef.current = null;
      }
    };

    const startLoop = () => {
      stopLoop();
      rafRef.current = requestAnimationFrame(tick);
    };

    animRef.current = { stopLoop, startLoop, drawFrame };

    if (reducedMotionRef.current) {
      drawFrame();
    } else {
      startLoop();
    }

    return () => {
      stopLoop();
      clearHoverTimer();
      ro.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseleave", onMouseLeaveWindow);
      motionMql.removeEventListener("change", onReducedMotionChange);
    };
  }, [density, size]);

  return (
    <canvas
      ref={canvasRef}
      className={className}
      aria-hidden
      role="presentation"
    />
  );
}
