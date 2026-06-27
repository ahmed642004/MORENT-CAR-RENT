"use client";

import { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
// Import your FilterSidebar here once you build it
import FilterSidebar from "./FilterSidebar";

export default function ClientAppLayout({
  children,
  counts,
}: {
  children: React.ReactNode;
  counts: { type: Record<string, number>; capacity: Record<string, number> };
}) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  return (
    <>
      <Navbar onToggleFilter={() => setIsFilterOpen(!isFilterOpen)} />

      <div className="flex relative flex-1 transition-all duration-300">
        {/* 1. The Overlay: This creates the blur effect */}
        {isFilterOpen && (
          <div
            className="fixed inset-0 h-full bg-black/30 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsFilterOpen(false)} // Close when clicking the blurred area
          />
        )}

        {/* 2. Your Sidebar: Ensure it has a higher z-index (e.g., z-50) */}
        <FilterSidebar
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          counts={counts}
        />

        <main
          className={`py-8 flex-1 w-full transition-all duration-300 ${isFilterOpen ? "px-5" : "px-0"}`}
        >
          {children}
        </main>
      </div>

      <Footer />
    </>
  );
}
