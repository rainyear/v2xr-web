import * as BABYLON from "@babylonjs/core";
import { WebXRFeatureName } from "@babylonjs/core";
import * as GUI from "@babylonjs/gui";
// import { GUI3DManager, CylinderPanel, HolographicButton } from "babylonjs-gui";
// import * as GUI from "@"

export class App {
    private xrExperience: BABYLON.WebXRDefaultExperience | undefined;
    engine: BABYLON.Engine;
    scene: BABYLON.Scene;

    constructor(readonly canvas: HTMLCanvasElement) {
        console.log(`App constructor`);

        this.engine = new BABYLON.Engine(canvas);
        this.scene = new BABYLON.Scene(this.engine);

        const light = new BABYLON.HemisphericLight(
            "light",
            new BABYLON.Vector3(0, 1, 0),
            this.scene
        );
        // Dim the light a small amount 0 - 1
        light.intensity = 0.7;

        var camera = new BABYLON.ArcRotateCamera(
            "Camera",
            0,
            0,
            10,
            new BABYLON.Vector3(0, 0, 0),
            this.scene
        );
        camera.attachControl(canvas, true);

        // this.scene.addCamera(camera);

        const sphere = BABYLON.MeshBuilder.CreateSphere(
            "sphere",
            { diameter: 1, segments: 32 },
            this.scene
        );
        // Move sphere upward 1/2 its height
        // sphere.position.y = 1.7;
        // sphere.position.z = -2;

        // this.initXRExperience();

        this.add3DGUI();
    }

    // add 3D UI Manager
    // https://doc.babylonjs.com/how_to/gui3d
    add3DGUI() {
        var anchor = new BABYLON.TransformNode("");

        // camera.wheelDeltaPercentage = 0.01;
        // camera.attachControl(canvas, true);

        // Create the 3D UI manager
        var manager = new GUI.GUI3DManager(this.scene);

        var panel = new GUI.CylinderPanel();
        panel.margin = 0.2;

        manager.addControl(panel);
        panel.linkToTransformNode(anchor);
        panel.position.z = -1.5;

        // Let's add some buttons!
        var addButton = function () {
            var button = new GUI.HolographicButton("orientation");
            panel.addControl(button);

            button.text = "Button #" + panel.children.length;
        };

        panel.blockLayout = true;
        for (var index = 0; index < 60; index++) {
            addButton();
        }
        panel.blockLayout = false;
    }

    async initXRExperience() {
        this.xrExperience = await this.scene.createDefaultXRExperienceAsync({
            disableTeleportation: true,
            uiOptions: {
                sessionMode: "immersive-vr",
            },
            optionalFeatures: true,
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
