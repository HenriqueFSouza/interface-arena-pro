import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        hostname: 'arena-pro.s3.us-east-2.amazonaws.com',
        protocol: 'https',
      },
    ],
  },
};

export default nextConfig;
