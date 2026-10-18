import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Links from the old wedding invitation keep working.
  async redirects() {
    return [
      { source: "/bride/:path*", destination: "/fazna", permanent: true },
      { source: "/groom/:path*", destination: "/nisham", permanent: true },
    ];
  },
};

export default nextConfig;
