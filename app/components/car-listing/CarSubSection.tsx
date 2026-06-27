"use client";

import { useState } from "react";
import CarCard from "./CarCard";
import { SectionHeader } from "./SectionHeader";
import { Car } from "@/types";

interface CarSubSectionProps {
  title: string;
  cars: Car[];
}

export const CarSubSection = ({ title, cars }: CarSubSectionProps) => {
  const [showAll, setShowAll] = useState(false);

  // Slice to show only 4 cars initially
  const displayedCars = showAll ? cars : cars.slice(0, 4);

  return (
    <>
      <SectionHeader title={title} onViewAll={() => setShowAll(true)} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayedCars.map((car) => (
          <CarCard key={car.id} car={car} />
        ))}
      </div>
    </>
  );
};
