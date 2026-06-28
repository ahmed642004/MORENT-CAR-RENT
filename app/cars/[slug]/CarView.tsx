"use client";
import { getImageUrl } from "@/lib/utils/storage";
import Image from "next/image";
import { useState, type FC } from "react";

interface ComponentNameProps {
  car: {
    title: string;
    subtitle: string;
    name: string;
    thumbnail: string[];
  };
}
const ComponentName: FC<ComponentNameProps> = ({ car }) => {
  const [selectedImage, setSelectedImage] = useState(0);
  console.log(car);
  return (
    <div className="flex flex-col gap-6">
      {/* Main Featured Image Container */}
      <div className="relative w-full aspect-video rounded-2xl overflow-hidden">
        <div className="absolute z-10 p-6 flex flex-col">
          {selectedImage !== 0 ? (
            ""
          ) : (
            <>
              <h2 className="text-white text-3xl font-bold">{car.title}</h2>
              <p className="text-white `max-w-137.5 text-[18px] mt-4">
                {car.subtitle}
              </p>
            </>
          )}
        </div>
        <Image
          src={getImageUrl(car.thumbnail[selectedImage])}
          key={selectedImage}
          alt={car.name}
          fill
          className="transition-opacity duration-500 ease-in-out opacity-100"
        />
      </div>
      {/* Thumbnail Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6 w-fit">
        {car.thumbnail.map((imagePath, index) => (
          <div
            key={index} // Use the index for the React key
            className={`rounded-2xl relative overflow-hidden w-37.5 aspect-square flex items-center justify-center cursor-pointer`}
          >
            <Image
              src={getImageUrl(imagePath)} // Use the image path directly
              onClick={() => setSelectedImage(index)}
              alt="Thumbnail"
              fill
              className={`${index === 0 ? "" : "object-cover"}`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default ComponentName;
