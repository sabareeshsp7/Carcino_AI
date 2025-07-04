/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'thumbs.dreamstime.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'onemg.gumlet.io',
        port: '',
        pathname: '/**',
      }
    ],
  },
}

module.exports = nextConfig