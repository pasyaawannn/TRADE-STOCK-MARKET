/** @type {import('next').NextConfig} */..........12
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: '/api/v1/:path*',
        destination: 'http://backend:8000/api/v1/:path*',
      },
      {
        source: '/ws/:path*',
        destination: 'http://backend:8000/ws/:path*',
      },
    ]
  },
}
 
module.exports = nextConfig
