/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  }, reactStrictMode: false,experimental: {
serverComponentsExternalPackages: ['pdf-parse','@prisma/client', 'prisma'],
},
};

export default nextConfig;
