/** @type {import('next').NextConfig} */
const nextConfig = {
    // reactStrictMode: true,
    async rewrites() {
        return [
          {
            source: '/socket.io/:path*',
            destination: '/api/socket',
          },
        ];
    },
};

export default nextConfig;
