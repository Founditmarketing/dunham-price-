import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Suppress the floating Next.js "N" dev indicator — it was leaking into
  // production-looking screenshots during review.
  devIndicators: false,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dunhamprice.com",
        pathname: "/wp-content/uploads/**",
      },
    ],
  },
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
};

export default nextConfig;
