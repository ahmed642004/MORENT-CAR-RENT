import { createClient } from "@/lib/supabase/server"; // Use the client you created
import { CarSubSection } from "./CarSubSection";

export const CarsSection = async ({
  searchParams,
}: {
  searchParams: {
    category?: string | string[];
    people?: string | string[];
    price?: string;
  };
}) => {
  const supabase = await createClient();

  // 1. Prepare your filters
  const selectedTypes =
    typeof searchParams?.category === "string"
      ? searchParams.category.split(",")
      : searchParams?.category || [];

  const selectedCapacities =
    typeof searchParams?.people === "string"
      ? searchParams.people.split(",")
      : searchParams?.people || [];

  const maxPrice = searchParams?.price ? parseInt(searchParams.price) : 10000000;
  // 2. Build the query
  let query = supabase.from("CARS").select("*");

  if (selectedTypes.length > 0) {
    query = query.in("category", selectedTypes);
  }

  if (selectedCapacities.length > 0) {
    // Note: Assuming 'people' is an integer in DB
    query = query.in("people", selectedCapacities.map(Number));
  }

  query = query.lte("price", maxPrice);

  // 3. Execute
  const { data: allCars, error } = await query;
  if (error) {
    console.error("Supabase fetch error:", error);
    return <div>Error loading cars</div>;
  }

  // 4. Separate your popular/recommended cars
  const popularCars = allCars?.filter((car) => car.popular === true) || [];
  const recommendedCars =
    allCars?.filter((car) => car.recommended === true) || [];

  return (
    <>
      <CarSubSection title="Popular Cars" cars={popularCars} />
      <CarSubSection title="Recommended Cars" cars={recommendedCars} />
    </>
  );
};
