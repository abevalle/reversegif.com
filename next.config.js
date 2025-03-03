const nextConfig = {
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cross-Origin-Embedder-Policy',
            value: 'require-corp',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin',
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
      'u488cwcco0gw00048g4wgoo0.coolify.valle.us'
    ],
  },
};

module.exports = nextConfig;
