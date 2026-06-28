"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

type Car = {
  id: string;
  name: string;
  slug: string;
  image?: string;
  price: number;
  category?: string;
};

interface SearchBarProps {
  onToggleFilter?: () => void;
}

export function SearchBar({ onToggleFilter }: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Car[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const supabase = useRef(createClient());

  // Search cars from Supabase
  const handleSearch = async (query: string) => {
    setSearchQuery(query);

    if (!query.trim()) {
      setSearchResults([]);
      setIsOpen(false);
      return;
    }

    setIsLoading(true);
    try {
      const { data, error } = await supabase.current
        .from("CARS")
        .select("id, name, slug, image, price, category")
        .or(`name.ilike.%${query}%,category.ilike.%${query}%`)
        .limit(8);

      if (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } else {
        setSearchResults(data || []);
        setIsOpen(true);
      }
    } catch (error) {
      console.error("Search error:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="w-full md:w-auto md:ml-19.25 relative" ref={searchRef}>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        onFocus={() => searchQuery && setIsOpen(true)}
        className="border border-[#C3D4E9] rounded-full w-full md:w-125 h-12 md:h-11 pl-16 pr-14 focus:outline-none text-sm text-[#1A202C] placeholder-[#90A3BF]"
        placeholder="Search something here"
      />
      <Image
        src="/search-normal.svg"
        alt="Search"
        width={24}
        height={24}
        className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none"
      />

      <button
        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 border border-[#C3D4E9] md:border-none rounded-xl md:rounded-none flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={onToggleFilter}
      >
        <Image src="/filter.svg" alt="Filter" width={24} height={24} />
      </button>

      {/* Search Results Dropdown */}
      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-2 bg-white border border-[#C3D4E9] rounded-2xl shadow-lg z-50 max-h-96 overflow-y-auto md:w-125">
          {isLoading && (
            <div className="p-4 text-center text-[#90A3BF] text-sm">
              Searching...
            </div>
          )}

          {!isLoading && searchResults.length === 0 && searchQuery && (
            <div className="p-4 text-center text-[#90A3BF] text-sm">
              No cars found
            </div>
          )}

          {!isLoading && searchResults.length > 0 && (
            <ul className="divide-y divide-[#F6F7F9]">
              {searchResults.map((car) => (
                <li key={car.id}>
                  <Link
                    href={`/cars/${car.slug}`}
                    onClick={() => {
                      setIsOpen(false);
                      setSearchQuery("");
                    }}
                    className="flex items-center gap-3 p-3 hover:bg-[#F6F7F9] transition-colors"
                  >
                    {car.image && (
                      <div className="relative w-12 h-12 flex-shrink-0 rounded-lg overflow-hidden bg-[#F6F7F9]">
                        <Image
                          src={car.image}
                          alt={car.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#1A202C] truncate">
                        {car.name}
                      </p>
                      <p className="text-xs text-[#90A3BF]">
                        {car.category && `${car.category} • `}${`$${car.price}/day`}
                      </p>
                    </div>
                    <svg
                      className="w-4 h-4 text-[#C3D4E9] flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
