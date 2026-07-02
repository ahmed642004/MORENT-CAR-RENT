import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import SettingsForm from "./SettingsForm";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login?next=%2Fsettings");
  }

  // Fetch profiles table.
  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  // If there's no profile record, we fall back gracefully.
  // We'll pass it to the Client Component which will handle upsert.
  const initialProfile = profile || {
    id: user.id,
    full_name: user.user_metadata?.full_name || user.email?.split("@")[0] || "",
    avatar_url: user.user_metadata?.avatar_url || null,
  };

  return (
    <div className="container px-6 lg:px-16 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-secondary-500 tracking-tight font-sans">
          Settings
        </h1>
        <p className="text-secondary-300 text-sm mt-1">
          Manage your profile details, change security credentials, and set notification preferences.
        </p>
      </div>

      <SettingsForm user={user} initialProfile={initialProfile} />
    </div>
  );
}
