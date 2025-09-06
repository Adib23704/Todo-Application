import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },

  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },

  experimental: {
    serverActions: {
      allowedOrigins: ['localhost:3000', 'localhost:3001'],
    },
  },

  turbopack: {
    root: './',
  }
};

export default nextConfig;