import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static frontend: exported to plain HTML/CSS/JS with no server runtime.
  output: "export",
  images: {
    // Static export cannot use the on-demand image optimizer.
    unoptimized: true,
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
};

export default nextConfig;
