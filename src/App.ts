import * as BABYLON from "@babylonjs/core";
import { WebXRFeatureName } from "@babylonjs/core";

export class App {
    private xrExperience: BABYLON.WebXRDefaultExperience | undefined;
    engine: BABYLON.Engine;
    scene: BABYLON.Scene;

    constructor(readonly canvas: HTMLCanvasElement) {
        console.log(`App constructor`);

        this.engine = new BABYLON.Engine(canvas);
        this.scene = new BABYLON.Scene(this.engine);

        var camera = new BABYLON.FreeCamera(
            "mainCam",
            new BABYLON.Vector3(0, 5, -10),
            this.scene
        );

        this.scene.addCamera(camera);
        const sphere = BABYLON.MeshBuilder.CreateSphere(
            "sphere",
            { diameter: 2, segments: 32 },
            this.scene
        );
        // Move sphere upward 1/2 its height
        sphere.position.y = 1.7;
        sphere.position.z = -2;

        this.initXRExperience();
    }

    async initXRExperience() {
        this.xrExperience = await this.scene.createDefaultXRExperienceAsync({
            disableTeleportation: true,
            uiOptions: {
                sessionMode: "immersive-vr",
            },
        });
        const fm = this.xrExperience.baseExperience.featuresManager;
        var ground = BABYLON.MeshBuilder.CreateGround("Ground", {
            width: 100,
            height: 100,
        });
        fm.enableFeature(WebXRFeatureName.TELEPORTATION, "stable", {
            xrInput: this.xrExperience.input,
            floorMeshes: [ground],
            // snapPointsOnly: true
        });
    }
    async run() {
        // this.debug();

        // new Ammo().then((ammo) => {
        this.engine.runRenderLoop(() => {
            // this.scene.enablePhysics(undefined, new BABYLON.AmmoJSPlugin(true, ammo));
            this.scene.render();
        });

        // });
    }
}
