import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['www.1mg.com', 'onemg.gumlet.io'], // Add the new domain
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.1mg.com',
        port: '',
        pathname: '/**',
      },
      // Add pattern for the new domain
      {
        protocol: 'https',
        hostname: 'onemg.gumlet.io',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
        port: '',
        pathname: '/**',
      }
    ]
  },
  /* other config options here */
};

export default nextConfig;
