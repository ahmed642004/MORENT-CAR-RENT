"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import Navbar from "./Navbar";
import Footer from "./Footer";
import FilterSidebar from "./FilterSidebar";
import { AuthProvider } from "@/app/context/AuthContext";
import { User } from "@supabase/supabase-js";

type Profile = {
  id: string;
  full_name: string | null;
  avatar_url: string | null;
};

interface ClientAppLayoutProps {
  children: React.ReactNode;
  counts: { type: Record<string, number>; capacity: Record<string, number> };
  initialUser?: User | null;
  initialProfile?: Profile | null;
}

export default function ClientAppLayout({
  children,
  counts,
  initialUser = null,
  initialProfile = null,
}: ClientAppLayoutProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const pathname = usePathname();
  const isAuthPage = pathname.startsWith("/login");

  if (isAuthPage) {
    return (
      <AuthProvider>
        {children}
      </AuthProvider>
    );
  }

  return (
    <AuthProvider initialUser={initialUser} initialProfile={initialProfile}>
      <Navbar onToggleFilter={() => setIsFilterOpen(!isFilterOpen)} />

      <div className="flex relative flex-1 transition-all duration-300">
        {/* 1. The Overlay: This creates the blur effect */}
        {isFilterOpen && (
          <div
            className="fixed inset-0 h-full bg-black/30 backdrop-blur-sm z-40 lg:hidden"
            onClick={() => setIsFilterOpen(false)} // Close when clicking the blurred area
          />
        )}

        <FilterSidebar
          isOpen={isFilterOpen}
          counts={counts}
        />

        <main
          className={`py-8 flex-1 w-full transition-all duration-300 ${isFilterOpen ? "px-5" : "px-0"}`}
        >
          {children}
        </main>
      </div>

      <Footer />
    </AuthProvider>
  );
}
