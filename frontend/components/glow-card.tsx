"use client";

import { useCallback, useState, type CSSProperties, type ReactNode } from "react";

/** 글로우 하이라이트 색 (전역 `[data-glow]` 스타일에서 `--glow-color` 등으로 사용) */
export const glowColorMap = {
  orange: "rgba(249, 115, 22, 0.55)",
  blue: "rgba(59, 130, 246, 0.55)",
  purple: "rgba(168, 85, 247, 0.55)",
  green: "rgba(34, 197, 94, 0.55)",
  pink: "rgba(236, 72, 153, 0.55)",
} as const;

export type GlowColor = keyof typeof glowColorMap;

export type GlowSize = "sm" | "md" | "lg";

const sizePresets: Record<GlowSize, { width: number; height: number }> = {
  sm: { width: 280, height: 360 },
  md: { width: 320, height: 420 },
  lg: { width: 400, height: 520 },
};

export type GetInlineStylesOptions = {
  size: GlowSize;
  width?: number;
  height?: number;
  customSize: boolean;
};

/**
 * 카드 루트의 고정/가변 크기만 담당합니다. 포인터 위치·글로우 색은 컴포넌트에서 CSS 변수로 합칩니다.
 */
export function getInlineStyles(options: GetInlineStylesOptions): CSSProperties {
  const { size, width, height, customSize } = options;
  const base: CSSProperties = {
    position: "relative",
    isolation: "isolate",
  };

  if (customSize) {
    return {
      ...base,
      width: width !== undefined ? `${width}px` : undefined,
      height: height !== undefined ? `${height}px` : undefined,
    };
  }

  const preset = sizePresets[size];
  const w = width ?? preset.width;
  const h = height ?? preset.height;

  return {
    ...base,
    width: `${w}px`,
    height: `${h}px`,
  };
}

export type GlowCardProps = {
  children: ReactNode;
  className?: string;
  glowColor?: GlowColor;
  size?: GlowSize;
  width?: number;
  height?: number;
  customSize?: boolean;
  /** 앵커·스크롤 타깃 등 최외곽 루트에 전달 */
  id?: string;
};

export function GlowCard({
  children,
  className,
  glowColor = "orange",
  size = "md",
  width,
  height,
  customSize = false,
  id,
}: GlowCardProps) {
  const [pointer, setPointer] = useState({ x: 0.5, y: 0.5 });

  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const el = e.currentTarget;
      const rect = el.getBoundingClientRect();
      if (rect.width === 0 || rect.height === 0) return;
      const x = (e.clientX - rect.left) / rect.width;
      const y = (e.clientY - rect.top) / rect.height;
      setPointer({
        x: Math.max(0, Math.min(1, x)),
        y: Math.max(0, Math.min(1, y)),
      });
    },
    [],
  );

  const handlePointerLeave = useCallback(() => {
    setPointer({ x: 0.5, y: 0.5 });
  }, []);

  const baseStyles = getInlineStyles({
    size,
    width,
    height,
    customSize,
  });

  const style = {
    ...baseStyles,
    touchAction: "auto",
    "--glow-x": `${pointer.x * 100}%`,
    "--glow-y": `${pointer.y * 100}%`,
    "--glow-color": glowColorMap[glowColor],
  } as CSSProperties;

  return (
    <div
      id={id}
      data-glow=""
      className={className}
      style={style}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
    >
      {children}
    </div>
  );
}
