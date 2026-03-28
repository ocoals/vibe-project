import type { CalendarCellRenderProps } from "react-aria-components";

import { cn } from "@/lib/utils";

/** 루트: RAC Calendar / RangeCalendar */
export const calendarRootClass =
  "flex w-full max-w-sm flex-col font-sans @container text-zinc-900 dark:text-zinc-100";

/** 헤더: 이전·다음 + 제목 */
export const calendarHeaderClass = "flex items-center gap-1 border-box px-1 pb-4";

/** 이전/다음 월 네비게이션 (RAC Button) */
export const calendarNavButtonClass = cn(
  "inline-flex shrink-0 items-center justify-center rounded-lg p-1.5 text-zinc-600 outline-none transition-[color,background-color,transform]",
  "hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800",
  "data-[pressed]:scale-95",
  "focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:focus-visible:ring-zinc-500 dark:focus-visible:ring-offset-zinc-950",
);

/** 월/년 제목 (RAC Heading) */
export const calendarHeadingClass =
  "mx-2 my-0 flex-1 text-center text-base font-semibold [font-variation-settings:normal] text-zinc-900 dark:text-zinc-100";

/** 수동 달력(CalendarPicker) 큰 셀 variant용 월/년 제목 */
export const calendarManualPickerHeadingClass = cn(calendarHeadingClass, "text-lg");

/** 요일 행 */
export const calendarWeekdayHeaderCellClass =
  "px-0 py-1 text-xs font-semibold text-zinc-500 dark:text-zinc-400";

/** 수동 달력(CalendarPicker) 큰 셀 variant용 요일 헤더 */
export const calendarManualPickerWeekdayHeaderCellClass = cn(
  calendarWeekdayHeaderCellClass,
  "text-sm",
);

/** 그리드 테이블 */
export const calendarGridClass = "w-full border-spacing-0";

/**
 * 날짜 셀 공통 (단일·기간·멀티 수동 그리드에서 시각 정렬용).
 * RAC `CalendarCell`에는 `calendarCellClasses`를 사용합니다.
 */
export const calendarCellBaseClass = cn(
  "flex h-10 min-w-10 w-[calc(100cqw/7)] max-h-10 cursor-default items-center justify-center rounded-lg text-sm outline-none [-webkit-tap-highlight-color:transparent]",
  "aspect-square forced-color-adjust-none transition-[color,background-color,transform]",
  "data-[outside-month]:hidden",
);

/**
 * 수동 날짜 그리드 전용 큰 셀 (CalendarPicker 등). RAC `calendarCellBaseClass`는 그대로 둡니다.
 */
export const calendarManualCellBaseLargeClass = cn(
  "flex h-12 min-w-12 w-[calc(100cqw/7)] max-h-12 cursor-default items-center justify-center rounded-lg text-base outline-none [-webkit-tap-highlight-color:transparent]",
  "aspect-square forced-color-adjust-none transition-[color,background-color,transform]",
  "data-[outside-month]:hidden",
);

export function calendarCellClasses(props: CalendarCellRenderProps): string {
  const {
    isSelected,
    isDisabled,
    isToday,
    isSelectionStart,
    isSelectionEnd,
    isUnavailable,
    isInvalid,
    isFocusVisible,
  } = props;

  return cn(
    calendarCellBaseClass,
    isDisabled &&
      "cursor-not-allowed text-zinc-300 dark:text-zinc-600 forced-colors:text-[GrayText]",
    isUnavailable && !isDisabled && "line-through text-zinc-400 dark:text-zinc-500",
    isInvalid && isSelected && "bg-red-600 text-white dark:bg-red-600",
    isSelected &&
      !isInvalid &&
      cn(
        "bg-zinc-900 font-medium text-white dark:bg-zinc-100 dark:text-zinc-900",
        isSelectionStart && isSelectionEnd && "rounded-lg",
        isSelectionStart && !isSelectionEnd && "rounded-l-lg rounded-r-none",
        !isSelectionStart && isSelectionEnd && "rounded-r-lg rounded-l-none",
        !isSelectionStart && !isSelectionEnd && "rounded-none",
      ),
    !isSelected &&
      !isDisabled &&
      "text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800",
    !isSelected && !isDisabled && "data-[pressed]:scale-90",
    isToday &&
      !isSelected &&
      "relative after:absolute after:bottom-1 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-zinc-400 after:content-[''] dark:after:bg-zinc-500",
    isFocusVisible &&
      "z-10 ring-2 ring-zinc-400 ring-offset-2 dark:ring-zinc-500 dark:ring-offset-zinc-950",
  );
}

/** 멀티 날짜 수동 그리드용 — RAC `CalendarCell`과 동일한 단일 선택 시각(범위 비사용 경로). */
export function calendarManualCellClasses(options: {
  isSelected: boolean;
  isToday: boolean;
  size?: "default" | "lg";
}): string {
  const { isSelected, isToday, size = "default" } = options;
  const cellBase =
    size === "lg" ? calendarManualCellBaseLargeClass : calendarCellBaseClass;

  return cn(
    cellBase,
    isSelected &&
      "rounded-lg bg-zinc-900 font-medium text-white dark:bg-zinc-100 dark:text-zinc-900",
    !isSelected &&
      cn(
        "text-zinc-800 hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-zinc-800",
        "active:scale-90",
      ),
    isToday &&
      !isSelected &&
      "relative after:absolute after:bottom-1 after:left-1/2 after:h-1 after:w-1 after:-translate-x-1/2 after:rounded-full after:bg-zinc-400 after:content-[''] dark:after:bg-zinc-500",
    "focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2 dark:focus-visible:ring-zinc-500 dark:focus-visible:ring-offset-zinc-950",
  );
}
