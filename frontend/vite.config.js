import { defineConfig } from "vite";

export default defineConfig({
    // Assets are served by Django out of backend/static/dist/
    base: "/static/dist/",
    build: {
        manifest: true,
        outDir: "../backend/static/dist",
        emptyOutDir: true,
        rollupOptions: {
            input: {
                puzzle: "src/puzzle/main.js",
            },
        },
    },
});
