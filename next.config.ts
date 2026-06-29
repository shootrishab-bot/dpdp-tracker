import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // Tree-shake lucide-react so only used icons are bundled
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Compress output
  compress: true,
  // Power optimisations for production
  poweredByHeader: false,
}

export default nextConfig
