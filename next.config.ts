import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
  // Configuration pour déploiement rapide
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
  // Désactiver React strict mode pour éviter les doubles rendus
  reactStrictMode: false,
  // Images - Configuration pour le backend distant
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
      },
      {
        protocol: 'https',
        hostname: '*.railway.app',
      },
    ],
  },
}

export default nextConfig
