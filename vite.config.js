import { defineConfig } from 'vite';
import {readFileSync} from 'fs';

// const IP = "192.168.0.191";
// const IP = "127.0.0.1";
const IP = "10.109.9.194";
export default defineConfig(({ command, mode }) => {
    return {
        resolve: {
            alias: {
                'babylonjs': mode === 'development' ? 'babylonjs/babylon.max' : 'babylonjs'
            }
        },
        logLevel: "info",
        server: {
            host: IP,
            https: {
                key: readFileSync(`certs/${IP}-key.pem`),
                cert: readFileSync(`certs/${IP}.pem`)
            }
        }
    };
});
