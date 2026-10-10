import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'https://eco-waste-backend-nine.vercel.app/api/v1/:path*',
      },
    ]
  },
};

export default nextConfig;
