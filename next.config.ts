import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // pg utilise des require() conditionnels : il ne doit pas être bundlé par Next.js
  serverExternalPackages: ["pg"],
  experimental: {
    // jusqu'à 3 photos de voiture + 1 pièce d'identité à 8 Mo chacune (voir src/lib/stockage.ts)
    serverActions: { bodySizeLimit: "25mb" },
  },
};

export default nextConfig;
