import { redirect } from "next/navigation";

import CheckoutForm from "@/app/booking/_components/CheckoutForm";
import { createClient } from "@/lib/supabase/server";

export default async function BookingPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: car, error } = await supabase
    .from("CARS")
    .select("*")
    .eq("slug", slug)
    .single();

  if (error || !car) {
    return (
      <div className="container px-4 py-10 text-secondary-500">
        Car not found
      </div>
    );
  }

  return <CheckoutForm car={car} />;
}

