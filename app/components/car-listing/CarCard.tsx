import Image from "next/image";
import { Car } from "@/types";
import { HeartButton } from "./HeartButton";
import { FuelIcon, TransmissionIcon, CapacityIcon } from "./Icons";
import Link from "next/link";
import { getImageUrl } from "@/lib/utils/storage";

const CarCard = ({ car }: { car: Car }) => {
  console.log(car)
  return (
    <div className="w-full bg-white rounded-xl p-4 flex flex-col pt-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="font-bold text-xl text-secondary-500">{car.name}</h2>
          <span className="text-secondary-300 text-sm font-medium">
            {car.category}
          </span>
        </div>
        <HeartButton />
      </div>

      <div className="flex-1 flex justify-center items-center my-14 h-24 relative">
        <Image
          src={getImageUrl(car.image)}
          alt={car.name}
          width={264}
          height={108}
          className="object-contain"
          style={{ width: "auto", height: "100%" }}
          placeholder="blur"
          blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+ip1sAAAAASUVORK5CYII="
        />
      </div>

      <div className="flex justify-between md:flex-col md:gap-2 xl:flex-row items-center text-secondary-300 font-medium text-sm mb-6 mt-auto">
        <div className="flex gap-1.5 items-center">
          <FuelIcon />
          {car.fuel}L
        </div>
        <div className="flex gap-1.5 items-center">
          <TransmissionIcon />
          {car.transmission}
        </div>
        <div className="flex gap-1.5 items-center">
          <CapacityIcon />
          {car.people} People
        </div>
      </div>

      <div className="flex justify-between items-center">
        <div>
          <span className="font-bold text-xl lg:text-sm">${car.price.toFixed(2)}/</span>
          <span className="text-secondary-300 text-sm font-medium">day</span>
          {car.oldPrice && (
            <div className="text-secondary-300 text-sm font-medium line-through">
              ${car.oldPrice.toFixed(2)}
            </div>
          )}
        </div>
        <Link
          href={`/cars/${car.slug}`}
          className="font-semibold px-5 rounded bg-primary-500 text-white"
        >
          Rent Now
        </Link>
      </div>
    </div>
  );
};

export default CarCard;
