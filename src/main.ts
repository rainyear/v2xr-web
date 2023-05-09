import { App } from "./App";

console.log(`main.ts starting ${App.name}`);
window.addEventListener("DOMContentLoaded", async () => {
    // const ammo = await Ammo();
    let canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
    let app = new App(canvas);
    // app.debug(false);
    app.run();
});
