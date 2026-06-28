import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

export default async function OrdersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: orders } = await supabase
    .from("orders")
    .select(
      "id, car_id, pickup_location, pickup_date, dropoff_location, dropoff_date, total_price, payment_method, status, created_at",
    )
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="container px-4 py-8 sm:px-6 xl:px-0">
      <section className="rounded bg-white p-6">
        <h1 className="text-2xl font-bold text-secondary-500">My Orders</h1>
        <p className="mt-2 text-sm font-medium text-secondary-300">
          Your active rental orders appear here.
        </p>

        <div className="mt-8 space-y-4">
          {(orders ?? []).length === 0 ? (
            <p className="text-sm font-medium text-secondary-300">
              No orders yet.
            </p>
          ) : (
            orders?.map((order) => (
              <article
                key={order.id}
                className="rounded border border-secondary-100 p-5"
              >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <h2 className="font-bold text-secondary-500">
                      Order #{order.id}
                    </h2>
                    <p className="mt-2 text-sm font-medium text-secondary-300">
                      {order.pickup_location} to {order.dropoff_location}
                    </p>
                    <p className="mt-1 text-sm font-medium text-secondary-300">
                      {order.pickup_date} - {order.dropoff_date}
                    </p>
                  </div>
                  <div className="text-left sm:text-right">
                    <strong className="text-xl text-secondary-500">
                      ${Number(order.total_price ?? 0).toFixed(2)}
                    </strong>
                    <p className="mt-1 text-sm font-semibold text-primary-500">
                      {order.status}
                    </p>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </section>
    </div>
  );
}

