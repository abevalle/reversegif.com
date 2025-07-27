const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  // Security headers are now handled by middleware.js for better AdSense compatibility
  // The middleware dynamically adjusts headers based on the request
  async rewrites() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/api/sitemap',
      },
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
      },
      {
        protocol: 'https',
        hostname: '**.digitaloceanspaces.com',
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
