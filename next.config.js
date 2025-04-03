/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  transpilePackages: [
    "drizzle-orm",
    "drizzle-zod",
  ],
  // Add any custom configuration if needed
};

module.exports = nextConfig;