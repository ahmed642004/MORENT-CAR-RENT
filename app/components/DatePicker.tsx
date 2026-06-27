"use client";

import { useEffect, useRef, useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameDay,
  isSameMonth,
  isBefore,
  startOfDay,
} from "date-fns";

interface DatePickerProps {
  label: string;
  placeholder: string;
  value: Date | null;
  onChange: (date: Date) => void;
}

export default function DatePicker({ label, placeholder, value, onChange }: DatePickerProps) {
  const [open, setOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(value || new Date());
  const ref = useRef<HTMLDivElement>(null);

  const today = startOfDay(new Date());
  const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Build calendar grid
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const calendarStart = startOfWeek(monthStart);
  const calendarEnd = endOfWeek(monthEnd);

  const rows: Date[][] = [];
  let day = calendarStart;
  while (day <= calendarEnd) {
    const week: Date[] = [];
    for (let i = 0; i < 7; i++) {
      week.push(day);
      day = addDays(day, 1);
    }
    rows.push(week);
  }

  return (
    <div className="flex-1 relative" ref={ref}>
      <label className="block font-bold text-secondary-500 text-base mb-1">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-1 text-sm cursor-pointer bg-transparent"
      >
        <span className={value ? "text-secondary-500" : "text-secondary-300"}>
          {value ? format(value, "MMM dd, yyyy") : placeholder}
        </span>
        <svg
          className={`w-3 h-3 text-secondary-300 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 12 12"
          fill="none"
        >
          <path d="M2 4L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 bg-white border border-secondary-100 rounded-xl shadow-lg z-50 p-4 `w-70">
          {/* Month Navigation */}
          <div className="flex items-center justify-between mb-3">
            <button
              type="button"
              onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary-100 transition-colors cursor-pointer text-secondary-400"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M8 2L4 6L8 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <span className="font-semibold text-secondary-500">
              {format(currentMonth, "MMMM yyyy")}
            </span>
            <button
              type="button"
              onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
              className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-secondary-100 transition-colors cursor-pointer text-secondary-400"
            >
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                <path d="M4 2L8 6L4 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>

          {/* Weekday Headers */}
          <div className="grid grid-cols-7 mb-1">
            {weekDays.map((d) => (
              <div key={d} className="text-center text-xs font-semibold text-secondary-300 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Calendar Days */}
          {rows.map((week, i) => (
            <div key={i} className="grid grid-cols-7">
              {week.map((day, j) => {
                const isCurrentMonth = isSameMonth(day, currentMonth);
                const isSelected = value && isSameDay(day, value);
                const isToday = isSameDay(day, today);
                const isPast = isBefore(day, today);

                return (
                  <button
                    key={j}
                    type="button"
                    disabled={isPast}
                    onClick={() => {
                      onChange(day);
                      setOpen(false);
                    }}
                    className={`w-9 h-9 flex items-center justify-center text-sm rounded-lg transition-colors cursor-pointer
                      ${!isCurrentMonth ? "text-secondary-200" : ""}
                      ${isCurrentMonth && !isSelected && !isPast ? "text-secondary-500 hover:bg-primary-100" : ""}
                      ${isPast && isCurrentMonth ? "text-secondary-200 cursor-not-allowed!" : ""}
                      ${isSelected ? "bg-primary-500 text-white font-semibold" : ""}
                      ${isToday && !isSelected ? "font-bold text-primary-500" : ""}
                    `}
                  >
                    {format(day, "d")}
                  </button>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
