/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Explicitly disable Pages Router features
  trailingSlash: false,
  poweredByHeader: false,
  // Performance optimizations
  // swcMinify: true, // Removed as it's deprecated in Next.js 15
  experimental: {
    optimizePackageImports: ['@radix-ui/react-accordion', '@radix-ui/react-alert-dialog', '@radix-ui/react-avatar', '@radix-ui/react-dialog', '@radix-ui/react-dropdown-menu', '@radix-ui/react-popover', '@radix-ui/react-select', '@radix-ui/react-tabs', '@radix-ui/react-toast', '@radix-ui/react-tooltip'],
  },
}

export default nextConfig
