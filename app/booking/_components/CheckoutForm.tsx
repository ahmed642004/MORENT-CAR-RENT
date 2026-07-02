"use client";

import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import {
  useForm,
  useWatch,
  type FieldError,
  type UseFormRegister,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { useAuth } from "@/app/context/AuthContext";
import {
  checkoutSchema,
  type CheckoutFormValues,
  paymentLabels,
  paymentMethods,
} from "@/app/booking/_components/checkoutSchema";
import { createClient } from "@/lib/supabase/client";
import { getImageUrl } from "@/lib/utils/storage";

const cities = [
  "Cairo",
  "Alexandria",
  "Giza",
  "Port Said",
  "Mansoura",
  "New Cairo",
  "6th of October City",
  "Hurghada",
  "Sharm El Sheikh",
  "Luxor",
];

type CheckoutCar = {
  id: number;
  name: string;
  category: string | null;
  price: number;
  image?: string | null;
  thumbnail?: string[] | null;
  rating?: number | null;
  reviewCount?: number | null;
};

type CheckoutFormProps = {
  car: CheckoutCar;
};

type InputProps = {
  label: string;
  placeholder: string;
  type?: string;
  error?: FieldError;
  register: ReturnType<UseFormRegister<CheckoutFormValues>>;
};

function FormInput({
  label,
  placeholder,
  type = "text",
  error,
  register,
}: InputProps) {
  return (
    <label className="block">
      <span className="mb-3 block text-xs font-bold text-secondary-500">
        {label}
      </span>
      <input
        type={type}
        placeholder={placeholder}
        aria-invalid={Boolean(error)}
        className="
          h-14
          w-full
          rounded
          bg-background
          px-5
          text-sm
          font-medium
          text-secondary-500
          outline-none
          placeholder:text-secondary-300
          focus:ring-2
          focus:ring-primary-500
        "
        {...register}
      />
      {error && (
        <span className="mt-2 block text-xs font-medium text-error-500">
          {error.message}
        </span>
      )}
    </label>
  );
}

type SelectProps = {
  label: string;
  error?: FieldError;
  register: ReturnType<UseFormRegister<CheckoutFormValues>>;
};

function FormSelect({ label, error, register }: SelectProps) {
  return (
    <label className="block">
      <span className="mb-3 block text-xs font-bold text-secondary-500">
        {label}
      </span>
      <select
        aria-invalid={Boolean(error)}
        className="
          h-14
          w-full
          rounded
          bg-background
          px-5
          text-sm
          font-medium
          text-secondary-300
          outline-none
          focus:ring-2
          focus:ring-primary-500
        "
        {...register}
      >
        <option value="">Select your city</option>
        {cities.map((city) => (
          <option key={city} value={city}>
            {city}
          </option>
        ))}
      </select>
      {error && (
        <span className="mt-2 block text-xs font-medium text-error-500">
          {error.message}
        </span>
      )}
    </label>
  );
}

function SectionShell({
  title,
  subtitle,
  step,
  children,
}: {
  title: string;
  subtitle: string;
  step: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded bg-white p-5 sm:p-6">
      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="text-base font-bold text-secondary-500">{title}</h2>
          <p className="mt-1 text-xs font-medium text-secondary-300">
            {subtitle}
          </p>
        </div>
        <span className="shrink-0 text-xs font-medium text-secondary-300">
          {step}
        </span>
      </div>
      {children}
    </section>
  );
}

function RadioDot({ active }: { active: boolean }) {
  return (
    <span
      className={`
        grid
        h-4
        w-4
        place-items-center
        rounded-full
        border
        ${active ? "border-primary-500" : "border-secondary-200"}
      `}
      aria-hidden="true"
    >
      {active && <span className="h-2 w-2 rounded-full bg-primary-500" />}
    </span>
  );
}

function OrderSummary({ car }: { car: CheckoutCar }) {
  const imageSource = car.thumbnail?.[0]
    ? getImageUrl(car.thumbnail[0])
    : car.image || "/nissan_gt-r.png";
  const total = Number(car.price || 0);

  return (
    <aside className="h-fit rounded bg-white p-5 sm:p-6 xl:sticky xl:top-8">
      <h2 className="text-base font-bold text-secondary-500">
        Rental Summary
      </h2>
      <p className="mt-1 max-w-80 text-xs font-medium leading-5 text-secondary-300">
        Prices may change depending on the length of the rental and the price
        of your rental car.
      </p>

      <div className="mt-8 flex items-center gap-4 border-b border-secondary-100 pb-8">
        <div className="relative h-20 w-32 overflow-hidden rounded">
          <Image
            src={imageSource}
            alt={car.name}
            fill
            sizes="128px"
          />
        </div>
        <div className="min-w-0">
          <h3 className="truncate text-xl font-bold text-secondary-500 sm:text-2xl">
            {car.name}
          </h3>
          <div className="mt-2 flex items-center gap-2 text-xs font-medium text-secondary-300">
            <span className="text-warning-500">★★★★★</span>
            <span>{car.reviewCount ?? 440}+ Reviewer</span>
          </div>
        </div>
      </div>

      <div className="mt-8 space-y-5">
        <div className="flex justify-between text-sm font-medium">
          <span className="text-secondary-300">Subtotal</span>
          <span className="text-secondary-500">${total.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm font-medium">
          <span className="text-secondary-300">Tax</span>
          <span className="text-secondary-500">$0</span>
        </div>
      </div>

      <div className="mt-8 flex h-14 items-center rounded bg-background px-5">
        <span className="flex-1 text-xs font-medium text-secondary-300">
          Apply promo code
        </span>
        <button type="button" className="text-xs font-semibold text-secondary-500">
          Apply now
        </button>
      </div>

      <div className="mt-8 flex items-end justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-secondary-500">
            Total Rental Price
          </h3>
          <p className="mt-1 text-xs font-medium text-secondary-300">
            Overall price includes rental discount
          </p>
        </div>
        <strong className="shrink-0 text-2xl font-bold text-secondary-500">
          ${total.toFixed(2)}
        </strong>
      </div>
    </aside>
  );
}

export default function CheckoutForm({ car }: CheckoutFormProps) {
  const router = useRouter();
  const pathname = usePathname();
  const supabase = useMemo(() => createClient(), []);
  const { user, loading: authLoading } = useAuth();
  const [toast, setToast] = useState<string | null>(null);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting, isValid },
  } = useForm<CheckoutFormValues>({
    resolver: zodResolver(checkoutSchema),
    mode: "onChange",
    defaultValues: {
      paymentMethod: undefined,
      marketingEmails: false,
      termsAccepted: false,
    },
  });

  const selectedPayment = useWatch({
    control,
    name: "paymentMethod",
  });

  async function onSubmit(values: CheckoutFormValues) {
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    setSubmitError(null);

    const { error } = await supabase.from("orders").insert({
      user_id: user.id,
      car_id: car.id,
      pickup_location: values.pickupLocation,
      pickup_date: values.pickupDate,
      pickup_time: values.pickupTime,
      dropoff_location: values.dropoffLocation,
      dropoff_date: values.dropoffDate,
      dropoff_time: values.dropoffTime,
      total_price: Number(car.price || 0),
      payment_method: values.paymentMethod,
      payment_status: "paid",
      status: "active",
    });

    if (error) {
      setSubmitError(error.message);
      return;
    }

    reset();
    setToast("Rental order created successfully.");
    setTimeout(() => router.push("/orders"), 900);
  }

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
    }
  }, [authLoading, pathname, router, user]);

  return (
    <div className="container px-4 py-8 sm:px-6 xl:px-0">
      {toast && (
        <div
          role="status"
          className="fixed right-4 top-4 z-50 rounded bg-success-500 px-5 py-3 text-sm font-semibold text-white shadow-lg"
        >
          {toast}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="grid items-start gap-8 xl:grid-cols-[minmax(0,1fr)_492px]"
      >
        <div className="space-y-8">
          <SectionShell
            title="Billing Info"
            subtitle="Please enter your billing info"
            step="Step 1 of 4"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <FormInput
                label="Name"
                placeholder="Your name"
                error={errors.name}
                register={register("name")}
              />
              <FormInput
                label="Phone Number"
                placeholder="Phone number"
                error={errors.phone}
                register={register("phone")}
              />
              <FormInput
                label="Address"
                placeholder="Address"
                error={errors.address}
                register={register("address")}
              />
              <FormInput
                label="Town / City"
                placeholder="Town or city"
                error={errors.townCity}
                register={register("townCity")}
              />
            </div>
          </SectionShell>

          <SectionShell
            title="Rental Info"
            subtitle="Please select your rental date"
            step="Step 2 of 4"
          >
            <div className="space-y-8">
              <div>
                <div className="mb-5 flex items-center gap-2">
                  <RadioDot active />
                  <span className="text-sm font-semibold text-secondary-500">
                    Pick - Up
                  </span>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormSelect
                    label="Locations"
                    error={errors.pickupLocation}
                    register={register("pickupLocation")}
                  />
                  <FormInput
                    label="Date"
                    type="date"
                    placeholder="Select your date"
                    error={errors.pickupDate}
                    register={register("pickupDate")}
                  />
                  <FormInput
                    label="Time"
                    type="time"
                    placeholder="Select your time"
                    error={errors.pickupTime}
                    register={register("pickupTime")}
                  />
                </div>
              </div>

              <div>
                <div className="mb-5 flex items-center gap-2">
                  <span
                    className="grid h-4 w-4 place-items-center rounded-full border border-primary-100 bg-primary-100"
                    aria-hidden="true"
                  >
                    <span className="h-2 w-2 rounded-full bg-primary-500" />
                  </span>
                  <span className="text-sm font-semibold text-secondary-500">
                    Drop - Off
                  </span>
                </div>
                <div className="grid gap-6 sm:grid-cols-2">
                  <FormSelect
                    label="Locations"
                    error={errors.dropoffLocation}
                    register={register("dropoffLocation")}
                  />
                  <FormInput
                    label="Date"
                    type="date"
                    placeholder="Select your date"
                    error={errors.dropoffDate}
                    register={register("dropoffDate")}
                  />
                  <FormInput
                    label="Time"
                    type="time"
                    placeholder="Select your time"
                    error={errors.dropoffTime}
                    register={register("dropoffTime")}
                  />
                </div>
              </div>
            </div>
          </SectionShell>

          <SectionShell
            title="Payment Method"
            subtitle="Please enter your payment method"
            step="Step 3 of 4"
          >
            <div className="space-y-4">
              {paymentMethods.map((method) => {
                const checked = selectedPayment === method;
                return (
                  <label
                    key={method}
                    className={`
                      block
                      rounded
                      border
                      p-5
                      ${checked ? "border-primary-500 bg-background" : "border-transparent bg-background"}
                    `}
                  >
                    <span className="flex items-center justify-between gap-4">
                      <span className="flex items-center gap-3 text-sm font-semibold text-secondary-500">
                        <input
                          type="radio"
                          value={method}
                          className="h-4 w-4 accent-primary-500"
                          {...register("paymentMethod")}
                        />
                        {paymentLabels[method]}
                      </span>
                      <span className="text-sm font-bold text-primary-500">
                        {method === "credit-card"
                          ? "VISA  ●●"
                          : method === "paypal"
                            ? "PayPal"
                            : "bitcoin"}
                      </span>
                    </span>

                    {method === "credit-card" && checked && (
                      <div className="mt-6 grid gap-6 sm:grid-cols-2">
                        <FormInput
                          label="Card Number"
                          placeholder="Card number"
                          error={errors.cardNumber}
                          register={register("cardNumber")}
                        />
                        <FormInput
                          label="Expiration Date"
                          placeholder="DD / MM / YY"
                          error={errors.expirationDate}
                          register={register("expirationDate")}
                        />
                        <FormInput
                          label="Card Holder"
                          placeholder="Card holder"
                          error={errors.cardHolder}
                          register={register("cardHolder")}
                        />
                        <FormInput
                          label="CVC"
                          placeholder="CVC"
                          error={errors.cvc}
                          register={register("cvc")}
                        />
                      </div>
                    )}
                  </label>
                );
              })}
              {errors.paymentMethod && (
                <p className="text-xs font-medium text-error-500">
                  {errors.paymentMethod.message}
                </p>
              )}
            </div>
          </SectionShell>

          <SectionShell
            title="Confirmation"
            subtitle="We are getting to the end. Just few clicks and your rental is ready!"
            step="Step 4 of 4"
          >
            <div className="space-y-4">
              <label className="flex min-h-14 items-center gap-4 rounded bg-background px-5 text-sm font-semibold text-secondary-500">
                <input
                  type="checkbox"
                  className="h-5 w-5 accent-primary-500"
                  {...register("marketingEmails")}
                />
                I agree with sending a Marketing and newsletter emails. No
                spam, promised!
              </label>
              {errors.marketingEmails && (
                <p className="text-xs font-medium text-error-500">
                  {errors.marketingEmails.message}
                </p>
              )}

              <label className="flex min-h-14 items-center gap-4 rounded bg-background px-5 text-sm font-semibold text-secondary-500">
                <input
                  type="checkbox"
                  className="h-5 w-5 accent-primary-500"
                  {...register("termsAccepted")}
                />
                I agree with our terms and conditions and privacy policy.
              </label>
              {errors.termsAccepted && (
                <p className="text-xs font-medium text-error-500">
                  {errors.termsAccepted.message}
                </p>
              )}
            </div>

            {submitError && (
              <p className="mt-5 rounded bg-error-100 px-4 py-3 text-sm font-medium text-error-700">
                {submitError}
              </p>
            )}

            <button
              type="submit"
              disabled={!isValid || isSubmitting || authLoading}
              className="
                mt-8
                rounded
                bg-primary-500
                px-7
                py-4
                text-sm
                font-bold
                text-white
                transition
                hover:bg-primary-600
                disabled:cursor-not-allowed
                disabled:bg-secondary-200
              "
            >
              {isSubmitting ? "Processing..." : "Rent Now"}
            </button>

            <div className="mt-8">
              <div className="mb-4 flex h-8 w-8 items-center justify-center rounded-full border border-primary-500 text-primary-500">
                ✓
              </div>
              <h3 className="text-base font-bold text-secondary-500">
                All your data are safe
              </h3>
              <p className="mt-1 text-xs font-medium leading-5 text-secondary-300">
                We are using the most advanced security to provide you the best
                experience ever.
              </p>
            </div>
          </SectionShell>
        </div>

        <OrderSummary car={car} />
      </form>
    </div>
  );
}
