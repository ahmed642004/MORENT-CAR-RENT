import { Suspense } from "react";
import { CarsSection } from "./components/car-listing/CarsSection";
import PickUpDropOff from "./components/PickUpDropOff";
import { Button } from "./components/Button";
import Image from "next/image";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<any>;
}) {
  const params = await searchParams;

  // Check if any filters are active (category, people, or price)
  // We check if category or people have values, or if price is different from default (100)
  const isFiltering =
    params?.category ||
    params?.people ||
    (params?.price && parseInt(params.price) < 100);

  return (
    <div className="container transition-all duration-300">
      {/* Only render the Hero if NOT filtering */}
      {!isFiltering && (
        <>
          <div className="flex justify-center items-stretch gap-5">
            <div className="relative rounded-2xl overflow-hidden w-full lg:w-full xl:w-1/2 aspect-video">
              <Image
                src="/BG-2.png"
                alt="Car"
                fill
                className="bg-[#54A6FF] object-cover"
              />
              <div className="absolute left-6 top-6">
                <h2 className="text-white text-base md:text-3xl font-bold max-w-67.5 leading-normal">
                  The Best Platform for Car Rental
                </h2>
                <p className="text-white max-w-70 mt-4 mb-6">
                  Ease of doing a car rental safely and reliably. Of course at a
                  low price.
                </p>
                <Button className="w-fit whitespace-nowrap h-11 text-base rounded hover:cursor-pointer">
                  Rental Car
                </Button>
              </div>
            </div>
            <div className="hidden  xl:block relative rounded-2xl overflow-hidden w-1/2 aspect-video">
              <Image
                src="/BG.png"
                alt="Car"
                fill
                className="bg-primary-500 object-cover"
              />
              <div className="absolute left-6 top-6">
                <h2 className="text-white text-3xl font-bold max-w-67.5 leading-normal">
                  Easy way to rent a car at a low price
                </h2>
                <p className="text-white max-w-70 mt-4 mb-6">
                  Providing cheap car rental services and safe and comfortable
                  facilities.
                </p>
                <Button className="w-fit whitespace-nowrap h-11 text-base rounded hover:cursor-pointer bg-information-500!">
                  Rental Car
                </Button>
              </div>
            </div>
          </div>
          <PickUpDropOff />
        </>
      )}

      {/* Always render the cars section */}
      <Suspense key={JSON.stringify(params)} fallback={<div>Loading...</div>}>
        <CarsSection searchParams={params} />
      </Suspense>
    </div>
  );
}
