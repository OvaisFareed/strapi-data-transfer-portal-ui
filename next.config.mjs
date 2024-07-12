/** @type {import('next').NextConfig} */
import * as env from "./env.json" assert { type: "json" };
const envr = env.default;

const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: `${envr.from.slice(8)}`,
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
        destination: '/home',
        permanent: true,
      },
    ]
  },
};

export default nextConfig;
