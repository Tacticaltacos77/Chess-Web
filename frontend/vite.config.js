import { defineConfig } from "vite";
import { fileURLToPath } from "node:url";


export default defineConfig({
    // Assets are served by Django out of backend/static/dist/
    base: "/static/dist/",
    server: {
        // Pages come from Django (:8000), so in dev, imported assets (sounds, images)
        // need the full Vite URL or the browser asks Django for them and gets a 404
        origin: "http://localhost:5173",
    },
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
                play: "src/game/play.js",
                game_online: "src/game/online.js",
                game_local: "src/game/local.js",
                auth: "src/users/auth.js",
                auth_base: "src/users/auth_base.css",
            },
        },
    },
});
