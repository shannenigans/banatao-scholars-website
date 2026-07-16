const nextConfig = {
  allowedDevOrigins: ['127.0.0.1'],
  turbopack: {
    root: __dirname,
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
        hostname: "hisjorhwwdqudqtqzidc.supabase.co",
        port: "",
        pathname: "**",
      },
    ],
  },
};

// Using CommonJS exports only
module.exports = nextConfig;
