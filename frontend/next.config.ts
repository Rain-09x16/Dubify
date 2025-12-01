import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    NEXT_PUBLIC_APP_NAME: 'Dubai Navigator AI',
    NEXT_PUBLIC_APP_VERSION: '1.0.0',
  },
};

export default nextConfig;
