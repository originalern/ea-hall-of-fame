import { defineConfig } from "vite";
import { resolve } from "path";
import { readdirSync, statSync } from "fs";

function findHtmlFiles(dir) {
    let files = [];

    for (const item of readdirSync(dir)) {
        if (
            item === "node_modules" ||
            item === "dist" ||
            item === ".git"
        ) {
            continue;
        }

        const fullPath = resolve(dir, item);

        if (statSync(fullPath).isDirectory()) {
            files = files.concat(findHtmlFiles(fullPath));
        } else if (item.endsWith(".html")) {
            files.push(fullPath);
        }
    }

    return files;
}

const htmlFiles = findHtmlFiles(process.cwd());

const input = Object.fromEntries(
    htmlFiles.map(file => [
        file
            .replace(process.cwd(), "")
            .replace(/^\//, "")
            .replace(/\.html$/, ""),
        file
    ])
);

export default defineConfig({
    build: {
        rollupOptions: {
            input
        }
    }
});