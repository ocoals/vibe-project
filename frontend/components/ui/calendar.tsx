"use client";

import { ChevronLeftIcon, ChevronRightIcon } from "@radix-ui/react-icons";
import {
  Button,
  Calendar as AriaCalendar,
  CalendarCell,
  CalendarGrid,
  CalendarGridBody,
  CalendarGridHeader as AriaCalendarGridHeader,
  CalendarHeaderCell,
  Heading,
  RangeCalendar as AriaRangeCalendar,
  Text,
  useLocale,
} from "react-aria-components";
import type {
  CalendarProps as RACCalendarProps,
  DateValue,
  RangeCalendarProps as RACRangeCalendarProps,
} from "react-aria-components";

import { cn } from "@/lib/utils";

import {
  calendarCellClasses,
  calendarGridClass,
  calendarHeaderClass,
  calendarHeadingClass,
  calendarNavButtonClass,
  calendarRootClass,
  calendarWeekdayHeaderCellClass,
} from "./calendar-classes";

export type CalendarProps<T extends DateValue> = Omit<RACCalendarProps<T>, "children"> & {
  errorMessage?: string;
};

export type RangeCalendarProps<T extends DateValue> = Omit<RACRangeCalendarProps<T>, "children"> & {
  errorMessage?: string;
};

function CalendarHeader() {
  const { direction } = useLocale();

  return (
    <header className={calendarHeaderClass}>
      <Button slot="previous" className={calendarNavButtonClass}>
        {direction === "rtl" ? (
          <ChevronRightIcon className="size-[18px]" aria-hidden />
        ) : (
          <ChevronLeftIcon className="size-[18px]" aria-hidden />
        )}
      </Button>
      <Heading className={calendarHeadingClass} />
      <Button slot="next" className={calendarNavButtonClass}>
        {direction === "rtl" ? (
          <ChevronLeftIcon className="size-[18px]" aria-hidden />
        ) : (
          <ChevronRightIcon className="size-[18px]" aria-hidden />
        )}
      </Button>
    </header>
  );
}

function CalendarChrome({ errorMessage }: { errorMessage?: string }) {
  return (
    <>
      <CalendarHeader />
      <CalendarGrid className={calendarGridClass}>
        <AriaCalendarGridHeader>
          {(day) => (
            <CalendarHeaderCell className={calendarWeekdayHeaderCellClass}>{day}</CalendarHeaderCell>
          )}
        </AriaCalendarGridHeader>
        <CalendarGridBody>{(date) => <CalendarCell date={date} className={calendarCellClasses} />}</CalendarGridBody>
      </CalendarGrid>
      {errorMessage ? (
        <Text slot="errorMessage" className="text-sm text-red-600 dark:text-red-400">
          {errorMessage}
        </Text>
      ) : null}
    </>
  );
}

export function Calendar<T extends DateValue>({ errorMessage, className, ...props }: CalendarProps<T>) {
  return (
    <AriaCalendar
      {...props}
      className={(renderProps) =>
        cn(calendarRootClass, typeof className === "function" ? className(renderProps) : className)
      }
    >
      <CalendarChrome errorMessage={errorMessage} />
    </AriaCalendar>
  );
}

export function RangeCalendar<T extends DateValue>({
  errorMessage,
  className,
  ...props
}: RangeCalendarProps<T>) {
  return (
    <AriaRangeCalendar
      {...props}
      className={(renderProps) =>
        cn(calendarRootClass, typeof className === "function" ? className(renderProps) : className)
      }
    >
      <CalendarChrome errorMessage={errorMessage} />
    </AriaRangeCalendar>
  );
}
