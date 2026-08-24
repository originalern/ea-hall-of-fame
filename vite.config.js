import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, "index.html"),

                boxersList: resolve(
                    __dirname,
                    "pages/boxing/boxers-list.html"
                ),

                ivanK: resolve(
                    __dirname,
                    "pages/boxing/ivan-k.html"
                ),

                andropov: resolve(
                    __dirname,
                    "pages/boxing/andropov.html"
                ),

                campbell: resolve(
                    __dirname,
                    "pages/boxing/campbell.html"
                ),

                mackinney: resolve(
                    __dirname,
                    "pages/boxing/mackinney.html"
                ),

                suleman: resolve(
                    __dirname,
                    "pages/boxing/syleman.html"
                ),

                footballList: resolve(
                    __dirname,
                    "pages/football/football-list.html"
                ),

                kuznetsov: resolve(
                    __dirname,
                    "pages/football/kuznetsov.html"
                ),

                smith: resolve(
                    __dirname,
                    "pages/football/smith.html"
                ),

                young: resolve(
                    __dirname,
                    "pages/football/young.html"
                )
            }
        }
    }
});