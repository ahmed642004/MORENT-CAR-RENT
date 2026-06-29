"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { logout } from "@/lib/supabase/server";
import { SearchBar } from "../SearchBar";

interface NavbarProps {
  onToggleFilter?: () => void;
}

export default function Navbar({ onToggleFilter }: NavbarProps) {
  const { user, loading, profile } = useAuth();
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isMobileProfileOpen, setIsMobileProfileOpen] = useState(false);

  const notificationRef = useRef<HTMLLIElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const mobileProfileDropdownRef = useRef<HTMLDivElement>(null);
  const avatarSrc =
    profile?.avatar_url && profile.avatar_url.length > 0
      ? profile.avatar_url
      : "/user.svg";
  // Combined, operational click-outside handler for all UI dropdown items
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      // Desktop Notification
      if (
        notificationRef.current &&
        !notificationRef.current.contains(target)
      ) {
        setIsNotificationOpen(false);
      }
      // Mobile Hamburger Menu
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(target)) {
        setIsMobileMenuOpen(false);
      }
      // Desktop Profile Dropdown
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(target)
      ) {
        setIsProfileOpen(false);
      }
      // Mobile Profile Dropdown
      if (
        mobileProfileDropdownRef.current &&
        !mobileProfileDropdownRef.current.contains(target)
      ) {
        setIsMobileProfileOpen(false);
      }
    }

    // Attach listener properly to the document context
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const notifications: string[] = [];
  const profileName =
    profile?.full_name ||
    user?.user_metadata?.full_name ||
    user?.email ||
    "My Account";
  const profileStatus = loading ? "Checking session" : "Signed in as";
  console.log(user);
  return (
    <header className="bg-white flex items-center w-full h-auto md:h-[128px] border-b border-[#F6F7F9]">
      <div className="container px-6 lg:px-16 flex flex-col md:flex-row md:items-center justify-between md:justify-start w-full py-5 md:py-0 gap-5 md:gap-0">
        {/* Mobile Top Row: Burger and User Dropdown */}
        <div className="flex md:hidden justify-between w-full items-center">
          {/* Hamburger Menu Wrapper */}
          <div className="relative" ref={mobileMenuRef}>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-full cursor-pointer border border-[#C3D4E9] w-11 h-11 flex items-center justify-center bg-white"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M3 7H21"
                  stroke="#596780"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M3 12H21"
                  stroke="#596780"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
                <path
                  d="M3 17H21"
                  stroke="#596780"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                />
              </svg>
            </button>

            {/* Mobile Dropdown Menu items */}
            {isMobileMenuOpen && (
              <div className="absolute left-0 top-14 w-56 bg-white border border-[#C3D4E9] rounded-2xl shadow-lg p-3 z-50 flex flex-col gap-2">
                <button className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg w-full text-left">
                  <Image src="/heart.svg" alt="Heart" width={20} height={20} />
                  <span className="text-secondary-400 font-medium">
                    Favorites
                  </span>
                </button>

                <div className="relative">
                  <button
                    className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg w-full text-left"
                    onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                  >
                    <Image
                      src="/notification.svg"
                      alt="Notification"
                      width={20}
                      height={20}
                    />
                    <span className="text-secondary-400 font-medium">
                      Notifications
                    </span>
                  </button>

                  {isNotificationOpen && (
                    <div className="absolute left-0 top-12 w-70 bg-white border border-[#C3D4E9] rounded-2xl shadow-lg p-4 z-50 flex flex-col gap-3">
                      <h3 className="font-bold text-[#1A202C] text-lg">
                        Notifications
                      </h3>
                      {notifications.length === 0 ? (
                        <p className="text-[#90A3BF] text-sm font-medium text-center py-4">
                          There are no notifications
                        </p>
                      ) : null}
                    </div>
                  )}
                </div>

                <button className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg w-full text-left">
                  <Image
                    src="/setting-2.svg"
                    alt="Setting"
                    width={20}
                    height={20}
                  />
                  <span className="text-secondary-400 font-medium">
                    Settings
                  </span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Profile Dropdown Wrapper */}
          <div className="relative" ref={mobileProfileDropdownRef}>
            <button
              onClick={() => setIsMobileProfileOpen(!isMobileProfileOpen)}
              className="rounded-full cursor-pointer border border-[#C3D4E9] w-11 h-11 flex items-center justify-center overflow-hidden bg-white focus:outline-none"
            >
              <Image
                src={avatarSrc}
                alt="User"
                width={44}
                height={44}
                className="object-cover"
              />
            </button>

            {isMobileProfileOpen && (
              <div className="absolute right-0 top-14 w-48 bg-white border border-[#E0E4EC] rounded-xl shadow-lg py-2 z-50">
                <div className="px-4 py-2 border-b border-[#F6F7F9] mb-1">
                  <p className="text-xs font-medium text-[#90A3BF]">
                    {profileStatus}
                  </p>
                  <p className="text-sm font-semibold text-[#1A202C] truncate">
                    {profileName}
                  </p>
                </div>
                <Link
                  href="/orders"
                  className="flex w-full px-4 py-2 text-sm text-[#1A202C] hover:bg-[#F6F7F9] transition-colors"
                >
                  Orders
                </Link>
                <hr className="border-[#F6F7F9] my-1" />
                <form action={logout}>
                  <button
                    type="submit"
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors"
                  >
                    Log Out
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>

        {/* Logo */}
        <Link href="/" className="flex md:block w-full md:w-auto">
          <Image src="/Logo.png" alt="Logo" width={135} height={34} />
        </Link>

        {/* Search bar - Using new SearchBar component with onToggleFilter prop */}
        <SearchBar onToggleFilter={onToggleFilter} />

        {/* Desktop Right Section (Icons + User) */}
        <div className="hidden md:flex ml-auto items-center gap-5">
          <ul className="flex items-center gap-5">
            <li>
              <button className="rounded-full cursor-pointer border border-[#C3D4E9] w-11 h-11 flex items-center justify-center transition-colors hover:bg-gray-50">
                <Image src="/heart.svg" alt="Heart" width={24} height={24} />
              </button>
            </li>
            <li className="relative" ref={notificationRef}>
              <button
                className="rounded-full cursor-pointer border border-[#C3D4E9] w-11 h-11 flex items-center justify-center transition-colors hover:bg-gray-50"
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
              >
                <Image
                  src="/notification.svg"
                  alt="Notification"
                  width={24}
                  height={24}
                />
              </button>

              {isNotificationOpen && (
                <div className="absolute right-0 top-14 w-75 bg-white border border-[#C3D4E9] rounded-2xl shadow-lg p-5 z-50 flex flex-col gap-3">
                  <h3 className="font-bold text-[#1A202C] text-xl">
                    Notifications
                  </h3>
                  {notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-6 gap-2">
                      <p className="text-[#90A3BF] text-sm font-medium">
                        There are no notifications
                      </p>
                    </div>
                  ) : (
                    <ul className="flex flex-col gap-3">
                      {notifications.map((notification, index) => (
                        <li key={index} className="text-secondary-400 text-sm">
                          {notification}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </li>
            <li>
              <Link
                href="/settings"
                className="rounded-full cursor-pointer border border-[#C3D4E9] w-11 h-11 flex items-center justify-center transition-colors hover:bg-gray-50"
              >
                <Image
                  src="/setting-2.svg"
                  alt="Setting"
                  width={24}
                  height={24}
                />
              </Link>
            </li>
          </ul>

          {/* Desktop Profile Dropdown Wrapper */}
          <div className="relative" ref={profileDropdownRef}>
            <button
              onClick={() => setIsProfileOpen(!isProfileOpen)}
              className="rounded-full cursor-pointer border border-[#C3D4E9] w-11 h-11 flex items-center justify-center overflow-hidden hover:border-[#3563E9] transition-colors focus:outline-none"
            >
              <Image
                src={avatarSrc}
                alt="User"
                width={44}
                height={44}
                className="object-cover"
              />
            </button>

            {isProfileOpen && (
              <div className="absolute right-0 mt-2 w-52 bg-white border border-[#E0E4EC] rounded-xl shadow-lg py-2 z-50 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-4 py-2 border-b border-[#F6F7F9] mb-1">
                  <p className="text-xs font-medium text-[#90A3BF]">
                    {profileStatus}
                  </p>
                  <p className="text-sm font-semibold text-[#1A202C] truncate">
                    {profileName}
                  </p>
                </div>
                <Link
                  href="/orders"
                  className="flex w-full px-4 py-2 text-sm text-[#1A202C] hover:bg-[#F6F7F9] transition-colors"
                >
                  Orders
                </Link>
                <hr className="border-[#F6F7F9] my-1" />
                <form action={logout}>
                  <button
                    type="submit"
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 font-medium transition-colors focus:outline-none"
                  >
                    Log Out
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
