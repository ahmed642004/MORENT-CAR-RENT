import { HeartButton } from "@/app/components/car-listing/HeartButton";
import CarView from "@/app/cars/[slug]/CarView";
import StarRating from "@/app/components/car-listing/StarRating";
import Link from "next/link";
import { CarsSection } from "@/app/components/car-listing/CarsSection";
import { createClient } from "@/lib/supabase/server"; // Ensure this path is correct

export default async function CarPage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { slug } = await params;
  const resolvedSearchParams = await searchParams;

  const supabase = await createClient();

  // 1. Fetch the specific car from Supabase
  const { data: car, error } = await supabase
    .from("CARS")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !car) {
    return <div className="container py-10">Car not found</div>;
  }

  return (
    <div className="container py-8">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <CarView car={car} />

        <div className="bg-white w-full rounded-2xl p-6">
          <div className="flex justify-between items-center">
            <div className="flex flex-col">
              <h2 className="text-3xl font-bold text-secondary-500">
                {car.name}
              </h2>
              <StarRating rating={car.rating || 0} />
            </div>
            <HeartButton />
          </div>

          <p className="text-secondary-400 text-[20px] leading-loose tracking-[-2%] mt-6">
            {car.description}
          </p>

          <div className="grid grid-cols-2 gap-y-6 mt-8">
            <div className="flex flex-col gap-2">
              <span className="text-secondary-300">Type Car</span>
              <span className="text-secondary-400 font-semibold">
                {car.category}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-secondary-300">Capacity</span>
              <span className="text-secondary-400 font-semibold">
                {car.people} People
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-secondary-300">Steering</span>
              <span className="text-secondary-400 font-semibold">
                {car.transmission}
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <span className="text-secondary-300">Gasoline</span>
              <span className="text-secondary-400 font-semibold">
                {car.fuel}L
              </span>
            </div>
          </div>

          <div className="flex justify-between items-center mt-8">
            <div>
              <span className="font-bold text-xl">
                ${car.price.toFixed(2)}/
              </span>
              <span className="text-secondary-300 text-sm font-medium">
                day
              </span>
              {car.old_price && (
                <div className="text-secondary-300 text-sm font-medium line-through">
                  ${car.old_price.toFixed(2)}
                </div>
              )}
            </div>
            <Link
              href={`/booking/${car.slug}`}
              className="font-semibold px-5 py-3 rounded bg-primary-500 text-white"
            >
              Rent Now
            </Link>
          </div>
        </div>
      </div>

      {/* CarsSection is already updated to fetch from Supabase */}
      <CarsSection searchParams={resolvedSearchParams} />
    </div>
  );
}
