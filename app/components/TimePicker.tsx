"use client";

import { useEffect, useRef, useState } from "react";

interface TimePickerProps {
  label: string;
  placeholder: string;
  value: { hour: number; minute: number } | null;
  onChange: (time: { hour: number; minute: number }) => void;
}

export default function TimePicker({ label, placeholder, value, onChange }: TimePickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  // Temp selections while picker is open
  const [selectedHour, setSelectedHour] = useState(value?.hour ?? 9);
  const [selectedMinute, setSelectedMinute] = useState(value?.minute ?? 0);
  const [selectedPeriod, setSelectedPeriod] = useState<"AM" | "PM">(
    value ? (value.hour >= 12 ? "PM" : "AM") : "AM"
  );

  const hourScrollRef = useRef<HTMLDivElement>(null);
  const minuteScrollRef = useRef<HTMLDivElement>(null);

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

  // Scroll to selected values when opened
  useEffect(() => {
    if (open) {
      const display12 = selectedHour % 12 || 12;
      const hourIdx = display12 - 1;
      hourScrollRef.current?.children[hourIdx]?.scrollIntoView({ block: "center", behavior: "instant" });
      const minuteIdx = selectedMinute / 5;
      minuteScrollRef.current?.children[minuteIdx]?.scrollIntoView({ block: "center", behavior: "instant" });
    }
  }, [open, selectedHour, selectedMinute]);

  const hours = Array.from({ length: 12 }, (_, i) => i + 1); // 1-12
  const minutes = Array.from({ length: 12 }, (_, i) => i * 5); // 0, 5, 10, ... 55

  function get24Hour(h12: number, period: "AM" | "PM"): number {
    if (period === "AM") return h12 === 12 ? 0 : h12;
    return h12 === 12 ? 12 : h12 + 12;
  }

  function handleConfirm() {
    const display12 = selectedHour % 12 || 12;
    const hour24 = get24Hour(display12, selectedPeriod);
    onChange({ hour: hour24, minute: selectedMinute });
    setOpen(false);
  }

  // Format display
  function formatTime(t: { hour: number; minute: number }): string {
    const h12 = t.hour % 12 || 12;
    const period = t.hour >= 12 ? "PM" : "AM";
    return `${h12}:${t.minute.toString().padStart(2, "0")} ${period}`;
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
          {value ? formatTime(value) : placeholder}
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
        <div className="absolute top-full left-0 mt-2 bg-white border border-secondary-100 rounded-xl shadow-lg z-50 p-4 `w-55">
          {/* Columns: Hour | Minute | AM/PM */}
          <div className="flex gap-2 mb-3">
            {/* Hours */}
            <div className="flex-1 flex flex-col items-center">
              <span className="text-xs font-semibold text-secondary-300 mb-1">Hour</span>
              <div ref={hourScrollRef} className="h-32 overflow-y-auto w-full scrollbar-thin">
                {hours.map((h) => {
                  const display12 = selectedHour % 12 || 12;
                  const isSelected = h === display12;
                  return (
                    <button
                      key={h}
                      type="button"
                      onClick={() => {
                        const h24 = get24Hour(h, selectedPeriod);
                        setSelectedHour(h24);
                      }}
                      className={`w-full py-1.5 text-sm text-center rounded-lg transition-colors cursor-pointer
                        ${isSelected ? "bg-primary-500 text-white font-semibold" : "text-secondary-500 hover:bg-primary-100"}
                      `}
                    >
                      {h}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Divider */}
            <div className="w-px bg-secondary-100" />

            {/* Minutes */}
            <div className="flex-1 flex flex-col items-center">
              <span className="text-xs font-semibold text-secondary-300 mb-1">Min</span>
              <div ref={minuteScrollRef} className="h-32 overflow-y-auto w-full scrollbar-thin">
                {minutes.map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setSelectedMinute(m)}
                    className={`w-full py-1.5 text-sm text-center rounded-lg transition-colors cursor-pointer
                      ${m === selectedMinute ? "bg-primary-500 text-white font-semibold" : "text-secondary-500 hover:bg-primary-100"}
                    `}
                  >
                    {m.toString().padStart(2, "0")}
                  </button>
                ))}
              </div>
            </div>

            {/* Divider */}
            <div className="w-px bg-secondary-100" />

            {/* AM/PM */}
            <div className="flex flex-col items-center justify-center gap-2">
              <span className="text-xs font-semibold text-secondary-300 mb-1">  </span>
              {(["AM", "PM"] as const).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setSelectedPeriod(p)}
                  className={`px-3 py-1.5 text-sm rounded-lg transition-colors cursor-pointer font-semibold
                    ${p === selectedPeriod ? "bg-primary-500 text-white" : "text-secondary-500 hover:bg-primary-100"}
                  `}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Confirm button */}
          <button
            type="button"
            onClick={handleConfirm}
            className="w-full py-2 bg-primary-500 text-white text-sm font-semibold rounded-lg hover:bg-primary-600 active:bg-primary-800 transition-colors cursor-pointer"
          >
            Confirm
          </button>
        </div>
      )}
    </div>
  );
}
