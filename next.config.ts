import type { NextConfig } from "next";

const appwriteHostname = (() => {
  try {
    const endpoint = process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT;
    if (!endpoint) return null;
    return new URL(endpoint).hostname;
  } catch {
    return null;
  }
})();

const nextConfig: NextConfig = {
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      ...(appwriteHostname
        ? [
            {
              protocol: "https" as const,
              hostname: appwriteHostname,
              pathname: "/v1/storage/buckets/**",
            },
          ]
        : []),
      { protocol: "https", hostname: "**.amazonaws.com" },
      { protocol: "https", hostname: "**.cloudfront.net" },
      { protocol: "https", hostname: "**.wp.com" },
      { protocol: "https", hostname: "**.pinimg.com" },
      { protocol: "https", hostname: "**.ytimg.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.buzzfeed.com" },
      { protocol: "https", hostname: "**.tasty.co" },
      { protocol: "https", hostname: "**.nytimes.com" },
      { protocol: "https", hostname: "**.bbc.co.uk" },
      { protocol: "https", hostname: "**.bbc.com" },
      { protocol: "https", hostname: "**.allrecipes.com" },
      { protocol: "https", hostname: "**.foodnetwork.com" },
      { protocol: "https", hostname: "**.seriouseats.com" },
      { protocol: "https", hostname: "**.bonappetit.com" },
      { protocol: "https", hostname: "**.epicurious.com" },
      { protocol: "https", hostname: "**.kingarthurbaking.com" },
      { protocol: "https", hostname: "**.smittenkitchen.com" },
      { protocol: "https", hostname: "**" },
    ],
  },
};

export default nextConfig;
