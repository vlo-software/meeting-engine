import { defineNuxtConfig } from "nuxt3";
import api from "./server/api";

export default defineNuxtConfig({
  css: ["@/assets/main.css", "@/assets/colors.less"],
  // serverMiddleware: {
  //   "/api": "~/api/index.ts",
  // },
  serverMiddleware: [{ path: "/api", handler: api }],
});
