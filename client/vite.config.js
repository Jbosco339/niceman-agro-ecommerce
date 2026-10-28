import { defineConfig, loadEnv } from "vite";
import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";
import { VitePWA } from "vite-plugin-pwa";

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, fileURLToPath(new URL(".", import.meta.url)), "");
  const configuredApiUrl = (env.VITE_API_URL || "").trim();
  const apiTarget = configuredApiUrl
    ? configuredApiUrl.replace(/\/api\/v1\/?$/i, "").replace(/\/api\/?$/i, "")
    : "http://localhost:5000";

  return {
    plugins: [
      react(),
      tailwindcss(),
      VitePWA({
        registerType: "prompt",
        includeAssets: ["pwa-192.png", "pwa-512.png"],
        manifest: {
          name: "Niceman Agro & Farms",
          short_name: "Niceman Agro",
          description: "Shop agricultural products from Niceman Agro & Farms.",
          theme_color: "#166534",
          background_color: "#f8fafc",
          display: "standalone",
          start_url: "/",
          scope: "/",
          icons: [
            {
              src: "/pwa-192.png",
              sizes: "192x192",
              type: "image/png",
              purpose: "any",
            },
            {
              src: "/pwa-512.png",
              sizes: "512x512",
              type: "image/png",
              purpose: "any maskable",
            },
          ],
        },
        workbox: {
          navigateFallbackDenylist: [/^\/api\//],
        },
      }),
    ],
    server: {
      host: "0.0.0.0",
      port: 5173,
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
    preview: {
      host: "0.0.0.0",
      port: 4173,
      proxy: {
        "/api": {
          target: apiTarget,
          changeOrigin: true,
          secure: false,
        },
      },
    },
  };
});
