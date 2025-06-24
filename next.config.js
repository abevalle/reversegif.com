const nextConfig = {
  pageExtensions: ['js', 'jsx', 'ts', 'tsx'],
  async headers() {
    return [
      {
        // Apply COEP/COOP headers to root path for FFmpeg
        source: '/',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        // Apply COEP/COOP headers to video-2-gif path
        source: '/video-2-gif',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'credentialless',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
      {
        // Apply general security headers to all other paths
        source: '/:path((?!video-2-gif).*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
        ],
      },
    ];
  },
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
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
    minimumCacheTTL: 86400, // Cache images for 24 hours
    formats: ['image/webp'],
  },
  productionBrowserSourceMaps: false,
  poweredByHeader: false,
  compress: true,
};

module.exports = nextConfig;
