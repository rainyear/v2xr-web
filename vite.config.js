import { defineConfig } from "vite";
import { readFileSync } from "fs";
import { chunkSplitPlugin } from "vite-plugin-chunk-split";
import { viteCommonjs } from "@originjs/vite-plugin-commonjs";

// const IP = "192.168.0.191";
const IP = "127.0.0.1";
// const IP = "10.109.9.194";

export default defineConfig(({ command, mode }) => {
    console.log("Mode: ", mode);
    const config = {
        resolve: {
            alias: {
                babylonjs:
                    mode === "development"
                        ? "babylonjs/babylon.max"
                        : "babylonjs",
            },
        },
        build: {
            outDir: "docs",
        },
    };
    if (mode === "development") {
        config["server"] = {
            host: IP,
            https: {
                key: readFileSync(`certs/${IP}-key.pem`),
                cert: readFileSync(`certs/${IP}.pem`),
            },
        };
    } else if (mode === "production") {
        config["plugins"] = [viteCommonjs(), chunkSplitPlugin()];
    }

    return config;
});
