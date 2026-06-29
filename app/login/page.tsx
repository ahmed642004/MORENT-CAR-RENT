"use client";

import React, { useState, FormEvent } from "react";
import { useSearchParams } from "next/navigation";
import { login, signup } from "../../lib/supabase/server";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const [isSignUp, setIsSignUp] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<{
    type: "error" | "success";
    text: string;
  } | null>(null);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setStatusMessage(null);

    const formData = new FormData(e.currentTarget);
    const redirectTo = searchParams.get("redirectTo");

    if (redirectTo?.startsWith("/")) {
      formData.set("redirectTo", redirectTo);
    }

    try {
      if (isSignUp) {
        const result = await signup(formData);
        if (result?.error) {
          setStatusMessage({ type: "error", text: result.error });
        } else if (result?.success) {
          setStatusMessage({ type: "success", text: result.message });
          // Clear inputs on successful sign up
          (e.target as HTMLFormElement).reset();
        }
      } else {
        const result = await login(formData);
        // If a redirect occurs on success, execution stops. If an error comes back, catch it:
        if (result?.error) {
          setStatusMessage({ type: "error", text: result.error });
        }
      }
    } catch (err: unknown) {
      // Define a structural type for what a Next.js redirect error looks like
      type RedirectError = { message: string; digest?: string };

      // Helper function to narrow down the 'unknown' type safely
      const isObject = (item: unknown): item is Record<string, unknown> => {
        return typeof item === "object" && item !== null;
      };

      if (isObject(err)) {
        const errorObj = err as RedirectError;

        // Check if it's the internal Next.js redirect mechanism
        if (
          errorObj.message?.includes("NEXT_REDIRECT") ||
          errorObj.digest?.includes("NEXT_REDIRECT")
        ) {
          return; // Stop execution and let the redirect happen naturally
        }
      }

      // Handle actual system errors
      setStatusMessage({
        type: "error",
        text: "An unexpected system error occurred.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div className="min-h-screen bg-[#F6F7F9] flex items-center justify-center p-4 antialiased font-sans">
      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-sm border border-[#E0E4EC] overflow-hidden grid md:grid-cols-2 min-h-[600px]">
        {/* Left Side: MORENT Brand Promo Panel */}
        <div className="hidden md:flex flex-col justify-between p-10 bg-[#3563E9] relative overflow-hidden text-white">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute -top-20 -left-20 w-80 h-80 rounded-full border-[40px] border-white"></div>
            <div className="absolute -bottom-40 -right-20 w-96 h-96 rounded-full border-[60px] border-white"></div>
          </div>

          <div className="relative z-10">
            <span className="text-2xl font-bold tracking-wider">MORENT</span>
          </div>

          <div className="relative z-10 my-auto max-w-sm">
            <h1 className="text-3xl font-semibold leading-tight mb-4">
              {isSignUp
                ? "Join the Best Platform for Car Rental"
                : "Easy way to rent a car at a low price"}
            </h1>
            <p className="text-blue-100 text-sm font-light leading-relaxed">
              {isSignUp
                ? "Create an account to track your bookings, manage rentals, and unlock premium local sports cars instantly."
                : "Providing cheap car rental services and safe and comfortable facilities for your dynamic journey."}
            </p>
          </div>

          <div className="relative z-10 text-xs text-blue-200">
            &copy; {new Date().getFullYear()} MORENT. All rights reserved.
          </div>
        </div>

        {/* Right Side: Form Panel */}
        <div className="flex flex-col justify-center p-8 sm:p-12 bg-white">
          <div className="mb-6">
            <div className="md:hidden text-2xl font-bold text-[#3563E9] mb-6 tracking-wider">
              MORENT
            </div>
            <h2 className="text-2xl font-bold text-[#1A202C] mb-2">
              {isSignUp ? "Create your account" : "Welcome back"}
            </h2>
            <p className="text-sm text-[#90A3BF]">
              {isSignUp
                ? "Enter your details below to get started with your rental journey."
                : "Please enter your login details to access your dashboard."}
            </p>
          </div>

          {/* Feedback Alerts */}
          {statusMessage && (
            <div
              className={`mb-5 p-4 rounded-xl text-sm font-medium border ${
                statusMessage.type === "error"
                  ? "bg-red-50 text-red-600 border-red-200"
                  : "bg-blue-50 text-[#3563E9] border-blue-200"
              }`}
            >
              {statusMessage.text}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div>
                <label className="block text-sm font-semibold text-[#1A202C] mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="Your full name"
                  className="w-full px-4 py-3 bg-[#F6F7F9] border border-[#E0E4EC] rounded-xl text-sm text-[#1A202C] placeholder-[#90A3BF] focus:outline-none focus:border-[#3563E9] focus:ring-1 focus:ring-[#3563E9] transition-all"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-[#1A202C] mb-2">
                Email Address
              </label>
              <input
                type="email"
                name="email"
                required
                placeholder="example@email.com"
                className="w-full px-4 py-3 bg-[#F6F7F9] border border-[#E0E4EC] rounded-xl text-sm text-[#1A202C] placeholder-[#90A3BF] focus:outline-none focus:border-[#3563E9] focus:ring-1 focus:ring-[#3563E9] transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-[#1A202C] mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-[#F6F7F9] border border-[#E0E4EC] rounded-xl text-sm text-[#1A202C] placeholder-[#90A3BF] focus:outline-none focus:border-[#3563E9] focus:ring-1 focus:ring-[#3563E9] transition-all"
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center space-x-2 cursor-pointer select-none">
                {isSignUp && (
                  <input
                    type="checkbox"
                    name="terms"
                    required={isSignUp}
                    className="w-4 h-4 text-[#3563E9] border-[#E0E4EC] rounded focus:ring-[#3563E9] accent-[#3563E9]"
                  />
                )}

                <span className="text-xs text-[#90A3BF] font-medium">
                  {isSignUp ? "I agree to the Terms & Conditions" : ""}
                </span>
              </label>

              {!isSignUp && (
                <a
                  href="#forgot"
                  className="text-xs font-semibold text-[#3563E9] hover:underline"
                >
                  Forgot Password?
                </a>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3.5 px-4 bg-[#3563E9] hover:bg-[#2850C7] disabled:bg-blue-400 text-white font-semibold rounded-xl text-sm transition-colors duration-200 shadow-sm shadow-blue-200 mt-2 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Processing...
                </>
              ) : isSignUp ? (
                "Sign Up"
              ) : (
                "Sign In"
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-[#90A3BF]">
              {isSignUp ? "Already have an account?" : "Don't have an account?"}{" "}
              <button
                type="button"
                onClick={() => {
                  setIsSignUp(!isSignUp);
                  setStatusMessage(null);
                }}
                className="font-semibold text-[#3563E9] hover:underline focus:outline-none"
              >
                {isSignUp ? "Sign In" : "Register now"}
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
