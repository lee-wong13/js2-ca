import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  base: "./",
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        login: resolve(import.meta.dirname, "pages/auth/login.html"),
        register: resolve(import.meta.dirname, "pages/auth/register.html"),
        feed: resolve(import.meta.dirname, "pages/feed/index.html"),
        post: resolve(import.meta.dirname, "pages/post/index.html"),
        profile: resolve(import.meta.dirname, "pages/profile/index.html"),
      },
    },
  },
});
