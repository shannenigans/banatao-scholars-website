const nextConfig = {
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

export default nextConfig;