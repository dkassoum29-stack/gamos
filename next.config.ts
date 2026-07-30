import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pg utilise des require() conditionnels : il ne doit pas être bundlé par Next.js
  serverExternalPackages: ["pg"],
  experimental: {
    // aligné sur la limite de 8 Mo des pièces d'identité (voir src/lib/stockage.ts)
    serverActions: { bodySizeLimit: "10mb" },
  },
};

export default nextConfig;
