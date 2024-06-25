/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "content.mtfxgroup.com",
        port: "",
        pathname: "/uploads/**",
      },
    ],
  },
  async redirects() {
    return [
      // Basic redirect
      {
        source: '/',
        destination: '/collections',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
