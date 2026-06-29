"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import Image from "next/image";

// Profile Zod Schema
const profileSchema = z.object({
  fullName: z
    .string()
    .min(2, "Full name must be at least 2 characters")
    .max(100),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

// Password Change Zod Schema
const passwordSchema = z
  .object({
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type PasswordFormValues = z.infer<typeof passwordSchema>;

interface SettingsFormProps {
  user: User;
  initialProfile: {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
  };
}

export default function SettingsForm({
  user,
  initialProfile,
}: SettingsFormProps) {
  const router = useRouter();
  const supabase = createClient();

  // State Management
  const [avatarUrl, setAvatarUrl] = useState<string | null>(
    initialProfile.avatar_url,
  );
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isRemovingAvatar, setIsRemovingAvatar] = useState(false);
  const [copied, setCopied] = useState(false);

  // Preference switches state
  const [preferences, setPreferences] = useState({
    emailNotifications: false,
    marketingEmails: false,
    darkMode: false,
  });

  // Load preferences on mount
  useEffect(() => {
    const saved = localStorage.getItem("settings_preferences");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setPreferences(parsed);
        // Apply dark mode styling if enabled
        if (parsed.darkMode) {
          document.documentElement.classList.add("dark");
        }
      } catch (e) {
        console.error("Error loading preferences", e);
      }
    }
  }, []);

  // Profile Form React Hook Form
  const {
    register: registerProfile,
    setValue,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: initialProfile.full_name || "",
    },
  });

  // Password Form React Hook Form
  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,

    reset: resetPasswordForm,
    formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
  } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  // Handle Full Name Updates
  const onProfileSave = async (data: ProfileFormValues) => {
    try {
      // 🟢 Change from .upsert() to .update() targeted directly at the user id
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: data.fullName,
          avatar_url: avatarUrl,
        })
        .eq("id", user.id); // Match the logged-in user's ID

      if (error) throw error;

      // 🟢 Manually update the form value state so the input layout matches immediately
      setValue("fullName", data.fullName);

      toast.success("Profile details updated successfully!");

      // Force Next.js to pull fresh layout layouts if the name is displayed in a navbar
      router.refresh();
    } catch (error: any) {
      toast.error(error.message || "Failed to update profile info");
    }
  };

  // Handle Avatar Image Upload
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Local validation
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      toast.error("Format must be JPG, JPEG, PNG, or WEBP");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size exceeds 5MB limit");
      return;
    }

    // Set local preview
    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview(previewUrl);
    setIsUploading(true);
    setUploadProgress(0);

    try {
      // 1. Delete previous avatar if exists
      if (avatarUrl) {
        try {
          const urlParts = avatarUrl.split("/object/public/avatar/");
          if (urlParts.length > 1) {
            const oldPath = decodeURIComponent(urlParts[1]);
            await supabase.storage.from("avatar").remove([oldPath]);
          }
        } catch (err) {
          console.error("Error removing old file", err);
        }
      }

      // 2. Upload new file
      const fileExt = file.name.split(".").pop();
      const fileName = `${user.id}/avatar.${fileExt}`;

      // Set up custom XHR upload or standard Supabase client with progress if supported
      const { error: uploadError } = await supabase.storage
        .from("avatar")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: true,
        });

      if (uploadError) throw uploadError;

      // Simulate a progress completion for immediate visual feedback
      setUploadProgress(100);

      // 3. Retrieve Public URL
      const { data: publicUrlData } = supabase.storage
        .from("avatar")
        .getPublicUrl(fileName);

      const publicUrl = publicUrlData.publicUrl;

      // 4. Update Profile
      const { error: updateError } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          avatar_url: publicUrl,
          full_name:
            initialProfile.full_name || user.user_metadata?.full_name || "",
        },
        { onConflict: "id" },
      );

      if (updateError) throw updateError;

      setAvatarUrl(publicUrl);
      toast.success("Avatar uploaded successfully!");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "An error occurred during avatar upload.");
    } finally {
      setIsUploading(false);
      setUploadProgress(null);
      setAvatarPreview(null);
    }
  };

  // Remove Avatar Flow
  const handleRemoveAvatar = async () => {
    if (!avatarUrl) return;
    setIsRemovingAvatar(true);

    try {
      // 1. Delete from Supabase Storage
      const urlParts = avatarUrl.split("/object/public/avatar/");
      if (urlParts.length > 1) {
        const oldPath = decodeURIComponent(urlParts[1]);
        await supabase.storage.from("avatar").remove([oldPath]);
      }

      // 2. Update Database Record
      const { error } = await supabase.from("profiles").upsert(
        {
          id: user.id,
          avatar_url: null,
          full_name: initialProfile.full_name || "",
        },
        { onConflict: "id" },
      );

      if (error) throw error;

      setAvatarUrl(null);
      toast.success("Profile avatar removed");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Failed to remove avatar");
    } finally {
      setIsRemovingAvatar(false);
    }
  };

  // Handle Security Password Changes
  const onPasswordChangeSubmit = async (data: PasswordFormValues) => {
    try {
      const { error } = await supabase.auth.updateUser({
        password: data.password,
      });

      if (error) throw error;

      toast.success("Password updated successfully!");
      resetPasswordForm();
    } catch (err: any) {
      toast.error(err.message || "Failed to update password");
    }
  };

  // Copy User ID utility
  const handleCopyId = () => {
    navigator.clipboard.writeText(user.id);
    setCopied(true);
    toast.success("User ID copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  };

  // Preference toggling handler
  const handleTogglePreference = (key: keyof typeof preferences) => {
    const updated = {
      ...preferences,
      [key]: !preferences[key],
    };
    setPreferences(updated);
    localStorage.setItem("settings_preferences", JSON.stringify(updated));

    if (key === "darkMode") {
      if (updated.darkMode) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
    toast.success("Preferences updated");
  };

  // Sign out triggering
  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success("Signed out successfully");
      router.push("/");
      router.refresh();
    } catch (err: any) {
      toast.error(err.message || "Error logging out");
    }
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
      {/* LEFT COLUMN */}
      <div className="flex flex-col gap-8">
        {/* SECTION 1 - Profile Information Card */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#E0E9F4]/60">
          <h2 className="text-xl font-bold text-secondary-500 mb-6 font-sans">
            Profile Information
          </h2>

          {/* Avatar Section */}
          <div className="flex flex-col sm:flex-row items-center gap-6 mb-6">
            <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-primary-100 bg-secondary-100 flex items-center justify-center">
              <Image
                src={avatarPreview || avatarUrl || "/user.svg"}
                alt="Profile Avatar"
                fill
                className="object-cover"
              />
              {isUploading && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-xs font-semibold">
                  <span>Uploading</span>
                  {uploadProgress !== null && (
                    <span className="mt-1">{uploadProgress}%</span>
                  )}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-3">
              <label className="bg-primary-500 hover:bg-primary-600 text-white text-sm font-semibold px-4 py-2.5 rounded-xl cursor-pointer transition-colors shadow-sm focus-within:ring-2 focus-within:ring-primary-300">
                Change Photo
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  className="sr-only"
                  onChange={handleAvatarChange}
                  disabled={isUploading}
                />
              </label>

              {avatarUrl && (
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  disabled={isRemovingAvatar || isUploading}
                  className="border border-red-200 hover:bg-red-50 text-red-600 text-sm font-semibold px-4 py-2.5 rounded-xl transition-colors disabled:opacity-50"
                >
                  {isRemovingAvatar ? "Removing..." : "Remove"}
                </button>
              )}
            </div>
          </div>

          {/* Full Name Edit Form */}
          <form
            onSubmit={handleProfileSubmit(onProfileSave)}
            className="space-y-4"
          >
            <div>
              <label
                className="block text-secondary-400 font-semibold text-sm mb-2"
                htmlFor="fullName"
              >
                Full Name
              </label>
              <input
                id="fullName"
                type="text"
                {...registerProfile("fullName")}
                className={`w-full rounded-xl border ${
                  profileErrors.fullName
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#C3D4E9] focus:border-primary-500"
                } bg-white p-3 text-secondary-500 text-sm focus:outline-none transition-all`}
                placeholder="Enter your full name"
              />
              {profileErrors.fullName && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {profileErrors.fullName.message}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-secondary-400 font-semibold text-sm mb-2"
                htmlFor="email-display"
              >
                Email Address{" "}
                <span className="text-xs font-normal text-secondary-300">
                  (Read Only)
                </span>
              </label>
              <input
                id="email-display"
                type="email"
                value={user.email || ""}
                disabled
                className="w-full rounded-xl border border-[#C3D4E9] bg-secondary-100 p-3 text-secondary-400 text-sm cursor-not-allowed focus:outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={isProfileSubmitting || isUploading}
              className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-5 py-3 rounded-xl transition-all shadow-md shadow-primary-100 disabled:bg-secondary-200 disabled:shadow-none disabled:cursor-not-allowed w-full sm:w-auto"
            >
              {isProfileSubmitting ? "Saving..." : "Save Profile Details"}
            </button>
          </form>
        </section>

        {/* SECTION 2 - Security Card */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#E0E9F4]/60">
          <h2 className="text-xl font-bold text-secondary-500 mb-2 font-sans">
            Security
          </h2>
          <p className="text-secondary-300 text-xs mb-6">
            Ensure your account is protected by updating your credentials.
          </p>

          <form
            onSubmit={handlePasswordSubmit(onPasswordChangeSubmit)}
            className="space-y-4"
          >
            <div>
              <label
                className="block text-secondary-400 font-semibold text-sm mb-2"
                htmlFor="password"
              >
                New Password
              </label>
              <input
                id="password"
                type="password"
                {...registerPassword("password")}
                className={`w-full rounded-xl border ${
                  passwordErrors.password
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#C3D4E9] focus:border-primary-500"
                } bg-white p-3 text-secondary-500 text-sm focus:outline-none transition-all`}
                placeholder="••••••••"
              />
              {passwordErrors.password && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {passwordErrors.password.message}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-secondary-400 font-semibold text-sm mb-2"
                htmlFor="confirmPassword"
              >
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                {...registerPassword("confirmPassword")}
                className={`w-full rounded-xl border ${
                  passwordErrors.confirmPassword
                    ? "border-red-500 focus:border-red-500"
                    : "border-[#C3D4E9] focus:border-primary-500"
                } bg-white p-3 text-secondary-500 text-sm focus:outline-none transition-all`}
                placeholder="••••••••"
              />
              {passwordErrors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1 font-medium">
                  {passwordErrors.confirmPassword.message}
                </p>
              )}
            </div>

            <button
              type="submit"
              disabled={isPasswordSubmitting}
              className="bg-primary-500 hover:bg-primary-600 text-white font-semibold px-5 py-3 rounded-xl transition-all shadow-md shadow-primary-100 disabled:bg-secondary-200 disabled:shadow-none disabled:cursor-not-allowed w-full sm:w-auto"
            >
              {isPasswordSubmitting ? "Updating..." : "Change Password"}
            </button>
          </form>
        </section>
      </div>

      {/* RIGHT COLUMN */}
      <div className="flex flex-col gap-8">
        {/* SECTION 3 - Account Details Card */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#E0E9F4]/60">
          <h2 className="text-xl font-bold text-secondary-500 mb-6 font-sans">
            Account Details
          </h2>

          <div className="space-y-4">
            <div className="flex justify-between items-center py-2.5 border-b border-[#F6F7F9]">
              <span className="text-secondary-400 text-sm font-semibold">
                Email Address
              </span>
              <span className="text-secondary-500 text-sm font-medium select-all">
                {user.email}
              </span>
            </div>

            <div className="flex justify-between items-center py-2.5 border-b border-[#F6F7F9]">
              <span className="text-secondary-400 text-sm font-semibold">
                Created At
              </span>
              <span className="text-secondary-500 text-sm font-medium">
                {user.created_at
                  ? new Date(user.created_at).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })
                  : "N/A"}
              </span>
            </div>

            <div className="flex justify-between items-center py-2.5">
              <span className="text-secondary-400 text-sm font-semibold">
                User ID
              </span>
              <div className="flex items-center gap-2">
                <span className="text-secondary-300 text-xs font-mono max-w-[150px] truncate select-all">
                  {user.id}
                </span>
                <button
                  type="button"
                  onClick={handleCopyId}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    copied
                      ? "bg-success-100 text-success-600 border-success-200"
                      : "bg-[#F6F7F9] text-secondary-400 border-[#C3D4E9] hover:bg-secondary-100"
                  }`}
                >
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          </div>
        </section>

        {/* SECTION 4 - Preferences Card */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-[#E0E9F4]/60">
          <h2 className="text-xl font-bold text-secondary-500 mb-6 font-sans">
            Preferences
          </h2>

          <div className="space-y-6">
            {/* Email Notifications Toggle */}
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1 pr-4">
                <span className="text-secondary-500 text-sm font-semibold">
                  Email Notifications
                </span>
                <span className="text-secondary-300 text-xs">
                  Receive system alerts, order updates, and rental status
                  changes.
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleTogglePreference("emailNotifications")}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  preferences.emailNotifications
                    ? "bg-primary-500"
                    : "bg-secondary-200"
                }`}
                aria-label="Toggle Email Notifications"
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    preferences.emailNotifications
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Marketing Emails Toggle */}
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1 pr-4">
                <span className="text-secondary-500 text-sm font-semibold">
                  Marketing Emails
                </span>
                <span className="text-secondary-300 text-xs">
                  Keep up with our seasonal offers, discount codes, and
                  newsletters.
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleTogglePreference("marketingEmails")}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  preferences.marketingEmails
                    ? "bg-primary-500"
                    : "bg-secondary-200"
                }`}
                aria-label="Toggle Marketing Emails"
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    preferences.marketingEmails
                      ? "translate-x-5"
                      : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Dark Mode Toggle */}
            <div className="flex justify-between items-center">
              <div className="flex flex-col gap-1 pr-4">
                <span className="text-secondary-500 text-sm font-semibold">
                  Dark Mode
                </span>
                <span className="text-secondary-300 text-xs">
                  Switch application interface colors between light and dark
                  theme.
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleTogglePreference("darkMode")}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${
                  preferences.darkMode ? "bg-primary-500" : "bg-secondary-200"
                }`}
                aria-label="Toggle Dark Mode"
              >
                <span
                  className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    preferences.darkMode ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>
        </section>

        {/* SECTION 5 - Danger Zone Card */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-red-100">
          <h2 className="text-xl font-bold text-red-600 mb-2 font-sans">
            Danger Zone
          </h2>
          <p className="text-secondary-300 text-xs mb-6">
            Please be cautious when performing actions in this section.
          </p>

          <button
            type="button"
            onClick={handleSignOut}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-3 rounded-xl transition-all shadow-md shadow-red-100 flex items-center justify-center gap-2 focus:outline-none focus:ring-2 focus:ring-red-500/50"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            Sign Out of Account
          </button>
        </section>
      </div>
    </div>
  );
}
