"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-secondary-100/50 pt-16 pb-14">
      <div className="container px-6 md:px-0 flex flex-col gap-12">
        {/* Top Section */}
        <div className="flex flex-col lg:flex-row lg:justify-between items-start gap-12 lg:gap-6">
          {/* Logo & Tagline */}
          <div className="flex flex-col max-w-73">
            <Link 
              href="/" 
              className="text-primary-500 font-bold text-3xl tracking-wide font-sans mb-4 hover:opacity-90 transition-opacity"
            >
              MORENT
            </Link>
            <p className="text-secondary-400 text-base leading-relaxed">
              Our vision is to provide convenience and help increase your sales business.
            </p>
          </div>

          {/* Links Grid */}
          <div className="flex flex-wrap gap-x-16 gap-y-12 w-full lg:w-auto lg:ml-auto">
            {/* About Column */}
            <div className="flex flex-col gap-6 min-w-37.5">
              <h3 className="text-secondary-500 font-semibold text-xl">About</h3>
              <ul className="flex flex-col gap-5 text-secondary-400 text-base font-medium">
                <li>
                  <Link href="#" className="hover:text-primary-500 transition-colors">
                    How it works
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary-500 transition-colors">
                    Featured
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary-500 transition-colors">
                    Partnership
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary-500 transition-colors">
                    Bussiness Relation
                  </Link>
                </li>
              </ul>
            </div>

            {/* Community Column */}
            <div className="flex flex-col gap-6 min-w-37.5">
              <h3 className="text-secondary-500 font-semibold text-xl">Community</h3>
              <ul className="flex flex-col gap-5 text-secondary-400 text-base font-medium">
                <li>
                  <Link href="#" className="hover:text-primary-500 transition-colors">
                    Events
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary-500 transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary-500 transition-colors">
                    Podcast
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary-500 transition-colors">
                    Invite a friend
                  </Link>
                </li>
              </ul>
            </div>

            {/* Socials Column */}
            <div className="flex flex-col gap-6 min-w-37.5">
              <h3 className="text-secondary-500 font-semibold text-xl">Socials</h3>
              <ul className="flex flex-col gap-5 text-secondary-400 text-base font-medium">
                <li>
                  <Link href="#" className="hover:text-primary-500 transition-colors">
                    Discord
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary-500 transition-colors">
                    Instagram
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary-500 transition-colors">
                    Twitter
                  </Link>
                </li>
                <li>
                  <Link href="#" className="hover:text-primary-500 transition-colors">
                    Facebook
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Separator Line & Bottom Section */}
        <div className="border-t border-secondary-100/50 pt-9 flex flex-col-reverse md:flex-row items-center justify-between gap-6 font-semibold text-secondary-500 text-sm md:text-base">
          <div className="text-center md:text-left">
            ©2022 MORENT. All rights reserved
          </div>
          <div className="flex justify-between md:justify-end gap-10 w-full md:w-auto">
            <Link 
              href="#" 
              className="hover:text-primary-500 transition-colors text-center md:text-left flex-1 md:flex-initial"
            >
              Privacy & Policy
            </Link>
            <Link 
              href="#" 
              className="hover:text-primary-500 transition-colors text-center md:text-left flex-1 md:flex-initial"
            >
              Terms & Condition
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
