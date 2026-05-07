import type { NextConfig } from "next";
const projectRoot = process.cwd();

const nextConfig: NextConfig = {
  reactStrictMode: true,
  devIndicators: false,
  allowedDevOrigins: ["127.0.0.1", "localhost"],
  experimental: {
    optimizePackageImports: ["lucide-react"],
    devtoolSegmentExplorer: false
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  outputFileTracingRoot: projectRoot,
  webpack(config) {
    return config;
  }
};

export default nextConfig;
