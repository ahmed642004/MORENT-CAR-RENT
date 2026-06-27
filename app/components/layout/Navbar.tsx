"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";

// Add an interface for the props so TypeScript knows what to expect
interface NavbarProps {
  onToggleFilter?: () => void;
}

export default function Navbar({ onToggleFilter }: NavbarProps) {
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const notificationRef = useRef<HTMLLIElement>(null);
  const mobileMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isNotificationOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      const isOutsideDesktop =
        notificationRef.current && !notificationRef.current.contains(target);
      const isOutsideMobile =
        mobileMenuRef.current && !mobileMenuRef.current.contains(target);

      if (isOutsideDesktop && isOutsideMobile) {
        setIsNotificationOpen(false);
      }
    }

    function handleMobileMenuClickOutside(event: MouseEvent) {
      if (
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(event.target as Node)
      ) {
        setIsMobileMenuOpen(false);
      }
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("mousedown", handleMobileMenuClickOutside);
    };
  }, [isNotificationOpen, isMobileMenuOpen]);

  const notifications: string[] = [];

  return (
    <header className="bg-white flex items-center w-full h-auto md:h-3">
      <div className="container flex flex-col md:flex-row md:items-center justify-between md:justify-start w-full py-5 md:py-0 gap-5 md:gap-0">
        {/* Mobile Top Row: Burger and User */}
        <div className="flex md:hidden justify-between w-full items-center">
          {/* Hamburger Menu Wrapper */}
          <div className="relative" ref={mobileMenuRef}>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="rounded-full cursor-pointer border border-[#C3D4E9] w-11 h-11 flex items-center justify-center"
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
                  <span className="`text-secondary-400 font-medium">Favorites</span>
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
                    <span className="`text-secondary-400 font-medium">
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
                  <span className="`text-secondary-400 font-medium">Settings</span>
                </button>
              </div>
            )}
          </div>

          <button className="rounded-full cursor-pointer border border-[#C3D4E9] w-11 h-11 flex items-center justify-center overflow-hidden">
            <Image
              src="/user.svg"
              alt="User"
              width={44}
              height={44}
              className="object-cover"
            />
          </button>
        </div>

        {/* Logo */}
        <Link href="/" className="flex md:block w-full md:w-auto">
          <Image src="/Logo.png" alt="Logo" width={135} height={34} />
        </Link>

        {/* Search bar */}
        <div className="w-full md:w-auto md:ml-19.25 relative">
          <input
            type="text"
            className="border border-[#C3D4E9] rounded-full w-full md:w-125 h-12 md:h-11 pl-16 focus:outline-none"
            placeholder="Search something here"
          />
          <Image
            src="/search-normal.svg"
            alt="Search"
            width={24}
            height={24}
            className="absolute left-5 top-1/2 -translate-y-1/2"
          />

          {/* Changed this button to use the new prop */}
          <button
            className="absolute right-3 top-1/2 -translate-y-1/2 p-2 border border-[#C3D4E9] md:border-none rounded-xl md:rounded-none flex items-center justify-center cursor-pointer"
            onClick={onToggleFilter}
          >
            <Image src="/filter.svg" alt="Filter" width={24} height={24} />
          </button>
        </div>

        {/* Desktop Right Section (Icons + User) */}
        <div className="hidden md:flex ml-auto items-center gap-5">
          <ul className="flex items-center gap-5">
            <li>
              <button className="rounded-full cursor-pointer border border-[#C3D4E9] w-11 h-11 flex items-center justify-center">
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
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-[#1A202C] text-xl">
                      Notifications
                    </h3>
                  </div>

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
              <button className="rounded-full cursor-pointer border border-[#C3D4E9] w-11 h-11 flex items-center justify-center">
                <Image
                  src="/setting-2.svg"
                  alt="Setting"
                  width={24}
                  height={24}
                />
              </button>
            </li>
          </ul>

          <div>
            <button className="rounded-full cursor-pointer border border-[#C3D4E9] w-11 h-11 flex items-center justify-center overflow-hidden">
              <Image
                src="/user.svg"
                alt="User"
                width={44}
                height={44}
                className="object-cover"
              />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
