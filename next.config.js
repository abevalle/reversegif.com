const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  // Security headers are now handled by middleware.js for better AdSense compatibility
  // The middleware dynamically adjusts headers based on the request
  async rewrites() {
    return [
      {
        source: '/blog',
        destination: '/blog',
      },
      {
        source: '/blog/:slug',
        destination: '/blog/:slug',
      },
    ];
  },
  images: {
    domains: [
      'media.giphy.com',
      'u488cwcco0gw00048g4wgoo0.coolify.valle.us',
      'blg01.coolify.valle.us'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**.coolify.valle.us',
        port: '',
        pathname: '/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'media.giphy.com',
        port: '',
        pathname: '/**',
      }
    ],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    // Removed restrictive CSP to allow AdSense images to load properly
    minimumCacheTTL: 86400, // Cache images for 24 hours
    formats: ['image/webp'],
  },
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  compress: true,
};

module.exports = nextConfig;
