import type { NextConfig } from "next";
import os from "os";

function getLocalIPv4s(): string[] {
  const ips: string[] = [];
  for (const iface of Object.values(os.networkInterfaces())) {
    for (const addr of iface ?? []) {
      if (addr.family === "IPv4" && !addr.internal) {
        ips.push(addr.address);
      }
    }
  }
  return ips;
}

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
  // Allow dev access from phone via LAN IP (e.g. http://192.168.1.x:3048)
  allowedDevOrigins: getLocalIPv4s(),
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
