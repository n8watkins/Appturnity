/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    "drizzle-orm",
    "drizzle-zod",
  ],
  // Configure webpack to handle shadcn and other dependencies
  webpack: (config) => {
    // Grab the existing rule that handles SVG imports
    const fileLoaderRule = config.module.rules.find((rule) =>
      rule.test?.test?.('.svg')
    );

    config.module.rules.push(
      // Convert SVGs to React components
      {
        test: /\.svg$/,
        issuer: /\.[jt]sx?$/,
        use: ['@svgr/webpack'],
      }
    );

    // Allow asset imports
    config.module.rules.push({
      test: /\.(jpe?g|png|gif|mp3|mp4|webp|webm)$/i,
      type: 'asset/resource',
    });

    return config;
  },
  // Allow importing from client and app directories
  modularizeImports: {
    '@/components': {
      transform: './client/src/components/{{member}}',
    },
    '@/hooks': {
      transform: './client/src/hooks/{{member}}',
    },
    '@/lib': {
      transform: './client/src/lib/{{member}}',
    },
    '@/shared': {
      transform: './shared/{{member}}',
    },
    '@app/components': {
      transform: './app/components/{{member}}',
    },
    '@app/lib': {
      transform: './app/lib/{{member}}',
    },
  },
  // Specify path aliases
  async rewrites() {
    return [
      // Rewrite API requests to the Next.js API routes
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
};

export default nextConfig;