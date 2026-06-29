import Image from "next/image";
import React from "react";

interface StarRatingProps {
  rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= Math.floor(rating)) {
        stars.push(
          <Image
            key={i}
            src="/ic-actions-star.png"
            alt=""
            width={20}
            height={20}
          />,
        );
      } else {
        stars.push(
          <Image
            key={i}
            src="/ic-actions-star-empty.png"
            alt=""
            width={20}
            height={20}
          />,
        );
      }
    }
    return stars;
  };

  return (
    <div className="flex items-center gap-0.5">
      {renderStars()}
      <span className="ml-2 text-sm font-medium">{rating}</span>
    </div>
  );
};

export default StarRating;
