"use client";

import { useState } from "react";
import DatePicker from "./DatePicker";
import TimePicker from "./TimePicker";
import Dropdown from "./Dropdown";

// `citiesByCountry` mapping removed as cities are now fetched via API.

const defaultCities = [
  "Cairo",
  "Alexandria",
  "Giza",
  "Shubra El Kheima",
  "Port Said",
  "Suez",
  "Ismailia",
  "Mansoura",
  "Tanta",
  "Zagazig",
  "Damanhur",
  "Kafr El Sheikh",
  "Banha",
  "El Mahalla El Kubra",
  "Faiyum",
  "Beni Suef",
  "Minya",
  "Asyut",
  "Sohag",
  "Qena",
  "Luxor",
  "Aswan",
  "Hurghada",
  "Sharm El Sheikh",
  "Dahab",
  "Marsa Alam",
  "El Arish",
  "New Cairo",
  "6th of October City",
  "10th of Ramadan City",
];



// ─── Main Component ─────────────────────────────────────────────
export default function PickUpDropOff() {
  const [cities] = useState<string[]>(defaultCities);

  // State for selections
  const [selections, setSelections] = useState<{
    pickup: {
      city: string;
      date: Date | null;
      time: { hour: number; minute: number } | null;
    };
    dropoff: {
      city: string;
      date: Date | null;
      time: { hour: number; minute: number } | null;
    };
  }>({
    pickup: { city: "", date: null, time: null },
    dropoff: { city: "", date: null, time: null },
  });

  const handleSwap = () => {
    setSelections((prev) => ({
      pickup: prev.dropoff,
      dropoff: prev.pickup,
    }));
  };

  const cityOptions = cities.map((c) => ({ label: c, value: c }));

  return (
    <div className="flex flex-col md:flex-row items-center gap-6 mt-8">
      {/* Pick-Up Card */}
      <div className="flex-1 bg-white rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-3 h-3 rounded-full bg-primary-500 inline-block" />
          <span className="font-semibold text-secondary-500">Pick - Up</span>
        </div>
        <div className="flex items-start gap-4">
          <Dropdown
            label="Locations"
            placeholder="Select your city"
            options={cityOptions}
            value={selections.pickup.city}
            onChange={(city) => setSelections(prev => ({ ...prev, pickup: { ...prev.pickup, city } }))}
          />
          <div className="w-px h-10 bg-secondary-100 self-center" />
          <DatePicker
            label="Date"
            placeholder="Select your date"
            value={selections.pickup.date}
            onChange={(date) => setSelections(prev => ({ ...prev, pickup: { ...prev.pickup, date } }))}
          />
          <div className="w-px h-10 bg-secondary-100 self-center" />
          <TimePicker
            label="Time"
            placeholder="Select your time"
            value={selections.pickup.time}
            onChange={(time) => setSelections(prev => ({ ...prev, pickup: { ...prev.pickup, time } }))}
          />
        </div>
      </div>

      {/* Swap Button */}
      <button
        onClick={handleSwap}
        className="w-14 h-14 shrink-0 bg-primary-500 rounded-xl flex items-center justify-center shadow-lg hover:bg-primary-600 active:bg-primary-800 transition-colors cursor-pointer"
      >
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M7.5 3L7.5 21M7.5 3L3 7.5M7.5 3L12 7.5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M16.5 21L16.5 3M16.5 21L21 16.5M16.5 21L12 16.5"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {/* Drop-Off Card */}
      <div className="flex-1 bg-white rounded-xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="w-3 h-3 rounded-full bg-information-500 inline-block" />
          <span className="font-semibold text-secondary-500">Drop - Off</span>
        </div>
        <div className="flex items-start gap-4">
          <Dropdown
            label="Locations"
            placeholder="Select your city"
            options={cityOptions}
            value={selections.dropoff.city}
            onChange={(city) => setSelections(prev => ({ ...prev, dropoff: { ...prev.dropoff, city } }))}
          />
          <div className="w-px h-10 bg-secondary-100 self-center" />
          <DatePicker
            label="Date"
            placeholder="Select your date"
            value={selections.dropoff.date}
            onChange={(date) => setSelections(prev => ({ ...prev, dropoff: { ...prev.dropoff, date } }))}
          />
          <div className="w-px h-10 bg-secondary-100 self-center" />
          <TimePicker
            label="Time"
            placeholder="Select your time"
            value={selections.dropoff.time}
            onChange={(time) => setSelections(prev => ({ ...prev, dropoff: { ...prev.dropoff, time } }))}
          />
        </div>
      </div>
    </div>
  );
}
