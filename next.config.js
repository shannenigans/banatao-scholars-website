const nextConfig = {
  poweredByHeader: false,
  allowedDevOrigins: ['127.0.0.1'],
  turbopack: {
    root: __dirname,
  },
  experimental: {
    serverActions: {
      // Gallery photo bytes upload directly to Supabase Storage via signed
      // URLs (createAlbumPhotoUploadTickets) and never pass through this
      // server. Only the 2MB profile photo (saveProfile) routes through
      // Server Actions now; add headroom for the rest of the form fields.
      bodySizeLimit: '3mb',
    },
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "media.licdn.com",
        port: "",
        pathname: "**",
      },
      {
        protocol: "https",
        hostname: "fcowugbzvvnpqjrlwyge.supabase.co",
        port: "",
        pathname: "**",
      },
    ],
  },
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'Content-Security-Policy', value: "base-uri 'self'; form-action 'self'; frame-ancestors 'none'; object-src 'none'" },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000' },
        ],
      },
    ];
  },
};

// Using CommonJS exports only
module.exports = nextConfig;
