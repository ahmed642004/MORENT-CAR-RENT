"use client";

import { useEffect, useRef, useState } from "react";
import { DropdownProps } from "@/types";

export default function Dropdown({
  label,
  placeholder,
  options,
  value,
  onChange,
}: DropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

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

  const selectedLabel = options.find((o) => o.value === value)?.label;

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
        <span
          className={
            selectedLabel ? "text-secondary-500" : "text-secondary-300"
          }
        >
          {selectedLabel || placeholder}
        </span>
        <svg
          className={`w-3 h-3 text-secondary-300 transition-transform ${open ? "rotate-180" : ""}`}
          viewBox="0 0 12 12"
          fill="none"
        >
          <path
            d="M2 4L6 8L10 4"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-full bg-white border border-secondary-100 rounded-lg shadow-lg z-50 max-h-48 overflow-y-auto">
          {options.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              className={`w-full text-left px-3 py-2 text-sm cursor-pointer transition-colors
                ${
                  value === opt.value
                    ? "bg-primary-500 text-white"
                    : "text-secondary-500 hover:bg-primary-100"
                }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
