import * as BABYLON from '@babylonjs/core';
import { GridMaterial } from '@babylonjs/materials';
import { Material } from '@babylonjs/core';

export class Mat {
    private scene: BABYLON.Scene;
    constructor(scene: BABYLON.Scene) {
        this.scene = scene;
    }
    grid(): Material {
        var groundMaterial = new GridMaterial("groundMaterial", this.scene);
        groundMaterial.majorUnitFrequency = 5;
        groundMaterial.minorUnitVisibility = 0.5;
        groundMaterial.gridRatio = 1;
        groundMaterial.opacity = 0.9;
        groundMaterial.useMaxLine = true;
        groundMaterial.lineColor = BABYLON.Color3.Teal();
        groundMaterial.mainColor = BABYLON.Color3.Black();

        return groundMaterial;
    }
    skybox(size: number): Material {
        const skyboxMaterial = new BABYLON.StandardMaterial("skyBoxMaterial", this.scene);
        skyboxMaterial.backFaceCulling = false;
        skyboxMaterial.reflectionTexture = new BABYLON.CubeTexture("textures/skybox/toySky", this.scene);//, size, false, true, false, true);
        skyboxMaterial.reflectionTexture.coordinatesMode = BABYLON.Texture.SKYBOX_MODE;
        skyboxMaterial.diffuseColor = new BABYLON.Color3(0, 0, 0);
        skyboxMaterial.specularColor = new BABYLON.Color3(0, 0, 0);

        return skyboxMaterial;
    }
    grayColor(): Material {
        const grayMat = new BABYLON.StandardMaterial("grayColor", this.scene);
        grayMat.diffuseColor = BABYLON.Color3.Gray();
        grayMat.emissiveColor = BABYLON.Color3.Teal();

        return grayMat;
    }
}