"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import { useAuth } from "@/app/context/AuthContext";
import { createClient } from "@/lib/supabase/client";

type Profile = {
  full_name: string | null;
  avatar_url: string | null;
};

type ReviewRow = {
  id: number;
  rating: number;
  comment: string;
  created_at: string;
  profiles: Profile | Profile[] | null;
};

type Review = {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  profile: Profile | null;
};

type ReviewsProps = {
  carId: number;
};

const shownReviewCount = 2;

function normalizeProfile(profile: ReviewRow["profiles"]) {
  if (Array.isArray(profile)) {
    return profile[0] ?? null;
  }

  return profile;
}

function formatReviewDate(date: string) {
  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(date));
}

function Stars({ rating }: { rating: number }) {
  const normalizedRating = Math.max(0, Math.min(5, Math.round(rating)));

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Image
          key={star}
          src={
            star <= normalizedRating
              ? "/ic-actions-star.png"
              : "/ic-actions-star-empty.png"
          }
          alt={star <= normalizedRating ? "Filled star" : "Empty star"}
          width={20}
          height={20}
        />
      ))}
    </div>
  );
}

export default function Reviews({ carId }: ReviewsProps) {
  const supabase = useMemo(() => createClient(), []);

  const { user, loading: authLoading } = useAuth();

  const [reviews, setReviews] = useState<Review[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const [fetchError, setFetchError] = useState<string | null>(null);

  const [showAll, setShowAll] = useState(false);

  const [rating, setRating] = useState(5);

  const [comment, setComment] = useState("");

  const [error, setError] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);

  const [refresh, setRefresh] = useState(0);

  useEffect(() => {
    let mounted = true;

    async function fetchReviews() {
      setIsLoading(true);

      const { data, error } = await supabase
        .from("review")
        .select(
          `
          id,
          rating,
          comment,
          created_at,
          profiles(
            full_name,
            avatar_url
          )
        `,
        )
        .eq("car_id", carId)
        .order("created_at", {
          ascending: false,
        });

      if (!mounted) return;

      if (error) {
        setReviews([]);
        setFetchError("We couldn't load reviews right now.");

        setIsLoading(false);

        return;
      }

      const formattedReviews = ((data ?? []) as ReviewRow[]).map((review) => ({
        id: review.id,

        rating: review.rating,

        comment: review.comment,

        createdAt: review.created_at,

        profile: normalizeProfile(review.profiles),
      }));

      setReviews(formattedReviews);
      setFetchError(null);

      setIsLoading(false);
    }

    fetchReviews();

    return () => {
      mounted = false;
    };
  }, [carId, refresh, supabase]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const reviewText = comment.trim();

    if (!user || !reviewText) {
      setError("Please write a review before submitting.");

      return;
    }

    setSubmitting(true);

    setError(null);

    const fullName =
      typeof user.user_metadata.full_name === "string"
        ? user.user_metadata.full_name
        : (user.email?.split("@")[0] ?? "Morent user");

    const avatarUrl =
      typeof user.user_metadata.avatar_url === "string"
        ? user.user_metadata.avatar_url
        : null;

    const { error: profileError } = await supabase.from("profiles").upsert(
      {
        id: user.id,
        full_name: fullName,
        avatar_url: avatarUrl,
      },
      {
        onConflict: "id",
      },
    );

    if (profileError) {
      setError(profileError.message);

      setSubmitting(false);

      return;
    }

    const { data, error } = await supabase
      .from("review")
      .insert({
        car_id: carId,
        user_id: user.id,
        rating,
        comment: reviewText,
      })
      .select();


    if (error) {
      setError(error.message);

      setSubmitting(false);

      return;
    }

    setRating(5);

    setComment("");

    // refresh reviews
    setRefresh((prev) => prev + 1);

    setSubmitting(false);
  }

  const visibleReviews = showAll ? reviews : reviews.slice(0, shownReviewCount);

  return (
    <section
      className="
        bg-white
        rounded-2xl
        p-6
        mt-8
      "
    >
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <h2
            className="
              text-xl
              font-bold
              text-secondary-500
            "
          >
            Reviews
          </h2>

          <span
            className="
              bg-primary-500
              text-white
              text-sm
              font-bold
              px-3
              py-1
              rounded
            "
          >
            {reviews.length}
          </span>
        </div>

        {!authLoading && !user && (
          <Link
            href="/login"
            className="
              text-sm
              font-semibold
              text-primary-500
            "
          >
            Sign in to add a review
          </Link>
        )}
      </div>

      {user && !authLoading && (
        <form
          onSubmit={handleSubmit}
          className="
              mt-6
              border-b
              pb-6
            "
        >
          <p
            className="
                font-semibold
                mb-2
              "
          >
            Your rating
          </p>

          <div
            className="flex gap-1"
            aria-label={`Your rating is ${rating} out of 5`}
          >
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                onClick={() => setRating(star)}
                aria-label={`Rate ${star} out of 5`}
                className="
                  rounded
                  p-1
                  transition
                  hover:bg-primary-100
                  focus-visible:outline
                  focus-visible:outline-2
                  focus-visible:outline-primary-500
                "
              >
                <Image
                  src={
                    star <= rating
                      ? "/ic-actions-star.png"
                      : "/ic-actions-star-empty.png"
                  }
                  alt=""
                  width={25}
                  height={25}
                />
              </button>
            ))}
          </div>

          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Write your review..."
            rows={4}
            maxLength={500}
            className="
                mt-4
                w-full
                rounded-xl
                border
                border-secondary-100
                p-3
                text-secondary-500
                resize-none
                focus:border-primary-500
              "
          />
          <p className="mt-2 text-right text-xs text-secondary-300">
            {comment.trim().length}/500
          </p>

          {error && (
            <p
              className="
                    text-red-500
                    text-sm
                    mt-2
                  "
            >
              {error}
            </p>
          )}

          <button
            disabled={submitting || !comment.trim()}
            className="
                mt-4
                bg-primary-500
                text-white
                px-5
                py-3
                rounded
                font-semibold
                disabled:cursor-not-allowed
                disabled:bg-secondary-200
              "
          >
            {submitting ? "Submitting..." : "Add Review"}
          </button>
        </form>
      )}

      <div
        className="
          mt-6
          space-y-6
        "
      >
        {isLoading ? (
          <p className="text-secondary-300">Loading reviews...</p>
        ) : fetchError ? (
          <p className="text-error-500">{fetchError}</p>
        ) : visibleReviews.length === 0 ? (
          <p className="text-secondary-300">No reviews yet.</p>
        ) : (
          visibleReviews.map((review) => (
            <article
              key={review.id}
              className="
                  flex
                  gap-4
                  border-b
                  border-secondary-100
                  pb-6
                  last:border-b-0
                  last:pb-0
                "
            >
              <div
                className="
                    relative
                    w-11
                    h-11
                    rounded-full
                    overflow-hidden
                  "
              >
                <Image
                  src={review.profile?.avatar_url || "/user.svg"}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>

              <div className="flex-1">
                <div
                  className="
                      flex
                      justify-between
                    "
                >
                  <h3
                    className="
                        font-bold
                      "
                  >
                    {review.profile?.full_name || "Morent user"}
                  </h3>

                  <div
                    className="
                        text-right
                      "
                  >
                    <p
                      className="
                          text-sm
                          text-secondary-300
                        "
                    >
                      {formatReviewDate(review.createdAt)}
                    </p>

                    <div className="mt-2">
                      <Stars rating={review.rating} />
                    </div>
                  </div>
                </div>

                <p
                  className="
                      mt-3
                      text-secondary-300
                      leading-7
                    "
                >
                  {review.comment}
                </p>
              </div>
            </article>
          ))
        )}
      </div>

      {reviews.length > shownReviewCount && (
        <button
          onClick={() => setShowAll(!showAll)}
          type="button"
          className="
              block
              mx-auto
              mt-8
              text-secondary-300
            "
        >
          {showAll ? "Show less" : "Show all"}
        </button>
      )}
    </section>
  );
}
