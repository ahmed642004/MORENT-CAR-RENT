import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "auibwzoxtpckkjhgfrhx.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
      {
        protocol: "https",
        hostname: "auibwzoxtpckkjhgfrhx.supabase.co",
        pathname: "/storage/v1/sign/**",
      },
    ],
  },
};

export default nextConfig;