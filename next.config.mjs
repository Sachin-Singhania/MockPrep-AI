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
serverComponentsExternalPackages: ['pdf-parse'],
},
};

export default nextConfig;
