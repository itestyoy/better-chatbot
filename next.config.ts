import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const BUILD_OUTPUT = process.env.NEXT_STANDALONE_OUTPUT
  ? "standalone"
  : undefined;

// Add your basePath here, or read from env for flexibility
const NEXT_PUBLIC_BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH || "";

export default () => {
  const nextConfig: NextConfig = {
    output: BUILD_OUTPUT,
    cleanDistDir: true,
    trailingSlash: true, 
    devIndicators: {
      position: "bottom-right",
    },
    env: {
      NO_HTTPS: process.env.NO_HTTPS,
    },
    async rewrites() {
      return [
        {
          source: `${NEXT_PUBLIC_BASE_PATH}/api/auth/:path*`,
          destination: '/api/auth/:path*'
        }
      ]
    },
    assetPrefix: NEXT_PUBLIC_BASE_PATH + "/",
    basePath: NEXT_PUBLIC_BASE_PATH,
    experimental: {
      taint: true,
    },
  };
  const withNextIntl = createNextIntlPlugin();
  return withNextIntl(nextConfig);
};
