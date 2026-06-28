import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import ClientAppLayout from "./components/layout/ClientAppLayout";
import { NuqsAdapter } from "nuqs/adapters/next/app";
import { createClient } from "@/lib/supabase/server";
import { Toaster } from "sonner";
const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-plus-jakarta-sans",
});


export const metadata: Metadata = {
  title: "Morent - Car Rental",
  description: "The best platform for car rental",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const supabase = await createClient();

  // Fetch only the data needed for the counts
  const { data: cars } = await supabase.from("CARS").select("category, people");
  console.log("Fetched cars for counts:", cars);
  const safeCars = cars || [];
  // Calculate counts (your existing logic)
  const typeCounts = safeCars?.reduce(
    (acc, car) => {
      // We tell TypeScript: acc is an object where keys are strings, values are numbers
      const category = car.category;
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  ); // <--- THIS IS THE FIX
  const capacityCounts = safeCars?.reduce(
    (acc, car) => {
      const capacity = car.people?.toString() || "0"; // Handle potential null people
      acc[capacity] = (acc[capacity] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  return (
    <html lang="en">
      <body
        className={`${plusJakartaSans.variable} bg-background min-h-screen font-sans flex flex-col`}
      >
        <NuqsAdapter>
          <ClientAppLayout
            counts={{ type: typeCounts, capacity: capacityCounts }}
          >
            {children}
          </ClientAppLayout>
          <Toaster position="top-right" richColors />
        </NuqsAdapter>
      </body>
    </html>
  );
}
