import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";


export default defineConfig({
    // Assets are served by Django out of backend/static/dist/
    base: "/static/dist/",
    resolve: {
        alias: {
            "@": fileURLToPath(new URL("./src", import.meta.url)),
        },
    },
    build: {
        manifest: true,
        outDir: "../backend/static/dist",
        emptyOutDir: true,
        rollupOptions: {
            input: {
                base: "src/base/base.css",
                home: "src/home/home.js",
                puzzle: "src/puzzle/main.js",
                game: "src/game/game.js",
            },
        },
    },
});
