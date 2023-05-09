import * as BABYLON from "@babylonjs/core";
import {
    AbstractMesh,
    Mesh,
    WebXRFeatureName,
    WebXRFeaturesManager,
} from "@babylonjs/core";
import { Mat } from "./materials/Materials";

export class AppOne {
    private xrExperience: BABYLON.WebXRDefaultExperience | undefined;
    engine: BABYLON.Engine;
    scene: BABYLON.Scene;
    ground: BABYLON.GroundMesh | undefined;
    mats: Mat | undefined;

    constructor(readonly canvas: HTMLCanvasElement) {
        this.engine = new BABYLON.Engine(canvas);
        window.addEventListener("resize", () => {
            this.engine.resize();
        });
        this.scene = this.createScene();

        this.initGround();
        this.addSkybox();

        // this.initFreeCam(canvas);
        this.initXRExperience();
    }

    createScene(): BABYLON.Scene {
        var scene = new BABYLON.Scene(this.engine);
        this.mats = new Mat(scene);

        var light = new BABYLON.DirectionalLight(
            "dir01",
            new BABYLON.Vector3(-1, -2, -1),
            scene
        );
        light.position = new BABYLON.Vector3(-5, 10, 5);
        light.intensity = 0.5;
        new BABYLON.HemisphericLight(
            "light",
            new BABYLON.Vector3(1, 1, 0),
            scene
        );

        scene.enablePhysics(
            undefined,
            new BABYLON.CannonJSPlugin(undefined, undefined, CANNON)
        );

        // const torus = BABYLON.MeshBuilder.CreateTorus("torus", { diameter: 0.5, thickness: 0.2, tessellation: 50 }, scene);
        const torus = BABYLON.MeshBuilder.CreateSphere(
            "target",
            { diameter: 0.5 },
            scene
        );
        torus.position.y = 2;
        torus.material = this.mats.grayColor();
        torus.physicsImpostor = new BABYLON.PhysicsImpostor(
            torus,
            BABYLON.PhysicsImpostor.SphereImpostor,
            { mass: 1, restitution: 0.5 },
            scene
        );

        // Our built-in 'ground' shape.
        const table = BABYLON.MeshBuilder.CreateGround(
            "ground",
            { width: 6, height: 2 },
            scene
        );
        table.position.y = 1;
        table.physicsImpostor = new BABYLON.PhysicsImpostor(
            table,
            BABYLON.PhysicsImpostor.BoxImpostor,
            { mass: 0 }
        );

        return scene;
    }
    initFreeCam(canvas: HTMLCanvasElement) {
        console.log("Enable Free Camera");
        var camera = new BABYLON.FreeCamera(
            "camera1",
            new BABYLON.Vector3(0, 2.5, -6),
            this.scene
        );
        camera.setTarget(BABYLON.Vector3.Zero());
        camera.attachControl(canvas, true);
        camera.checkCollisions = true;
        camera.applyGravity = true;
    }
    initGround() {
        this.ground = BABYLON.MeshBuilder.CreateGround("Ground", {
            width: 100,
            height: 100,
        });
        this.ground.material = this.mats!.grid();
        this.ground.checkCollisions = true;
        this.ground.physicsImpostor = new BABYLON.PhysicsImpostor(
            this.ground,
            BABYLON.PhysicsImpostor.BoxImpostor,
            { mass: 0 }
        );
    }

    async initXRExperience() {
        const supportsVR =
            await BABYLON.WebXRSessionManager.IsSessionSupportedAsync(
                "immersive-vr"
            );
        console.log(`Is this browser support VR: ${supportsVR}`);

        const availableFeatures = WebXRFeaturesManager.GetAvailableFeatures();
        console.log(availableFeatures);

        this.xrExperience = await this.scene.createDefaultXRExperienceAsync({
            disableTeleportation: true,
            uiOptions: {
                sessionMode: "immersive-ar",
            },
        });
        const fm = this.xrExperience.baseExperience.featuresManager;
        const snapPoses = [
            new BABYLON.Vector3(0, 0, 5),
            new BABYLON.Vector3(5, 0, 5),
        ];
        fm.enableFeature(WebXRFeatureName.TELEPORTATION, "stable", {
            xrInput: this.xrExperience.input,
            floorMeshes: [this.ground],
            snapPositions: snapPoses,
            // snapPointsOnly: true
        });
        const xrCamera = this.xrExperience.baseExperience.camera;
        console.log(xrCamera.position);
        /*
        fm.enableFeature(WebXRFeatureName.MOVEMENT, "latest", {
            xrInput: this.xrExperience.input,
            movementOrientationFollowsViewerPose: false
        });
        */

        fm.enableFeature(BABYLON.WebXRFeatureName.POINTER_SELECTION, "stable", {
            xrInput: this.xrExperience.input,
            enablePointerSelectionOnAllControllers: true,
        });

        // enable hand tracking
        if (window.navigator.userAgent.includes("OculusBrowser")) {
            fm.enableFeature(BABYLON.WebXRFeatureName.HAND_TRACKING, "latest", {
                xrInput: this.xrExperience.input,
                jointMeshes: {
                    enablePhysics: true,
                },
            });
        }

        this.xrExperience.input.onControllerAddedObservable.add(
            (controller) => {
                controller.onMotionControllerInitObservable.add(
                    (motionController) => {
                        var mesh: AbstractMesh | null;
                        const xr_ids = motionController.getComponentIds();
                        let triggerComponent =
                            motionController.getComponentOfType("squeeze"); //getComponent(xr_ids[0]);//xr-standard-trigger
                        if (triggerComponent) {
                            triggerComponent.onButtonStateChangedObservable.add(
                                () => {
                                    if (triggerComponent?.changes.pressed) {
                                        // is it pressed?
                                        if (triggerComponent.pressed) {
                                            mesh = this.scene.meshUnderPointer;
                                            console.log(mesh && mesh.name);
                                            /*
                                if (this.xrExperience?.pointerSelection.getMeshUnderPointer) {
                                    mesh = this.xrExperience.pointerSelection.getMeshUnderPointer(controller.uniqueId);
                                }
                                console.log(mesh && mesh.name);
                                */
                                            if (
                                                !mesh!.name.includes("target")
                                            ) {
                                                return;
                                            }
                                            mesh!.setParent(
                                                motionController.rootMesh
                                            );
                                            // mesh.position = motionController.rootMesh?.position;
                                            mesh!.physicsImpostor?.setMass(0);
                                        } else {
                                            mesh!.setParent(null);
                                            mesh!.physicsImpostor?.setMass(1);
                                        }
                                    }
                                }
                            );
                        }
                    }
                );
            }
        );
    }

    addSkybox() {
        const skyBox = BABYLON.MeshBuilder.CreateBox(
            "skyBox",
            { size: 100 },
            this.scene
        );
        skyBox.material = this.mats!.skybox(500);
    }

    debug(debugOn: boolean = true) {
        // hide/show the Inspector
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
                if (this.scene.debugLayer.isVisible()) {
                    this.scene.debugLayer.hide();
                } else {
                    this.scene.debugLayer.show();
                }
            }
        });
    }

    async run() {
        this.debug();

        // new Ammo().then((ammo) => {
        console.log("Ammo Engin loaded.");
        this.engine.runRenderLoop(() => {
            // this.scene.enablePhysics(undefined, new BABYLON.AmmoJSPlugin(true, ammo));
            this.scene.render();
        });

        // });
    }
}
