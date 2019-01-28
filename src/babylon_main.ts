
import * as BABYLON from 'babylonjs';
import 'babylonjs-materials';

let pad = function (num:number, size:number): string {
    let s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

let addTexturedPlanes = function(scene: BABYLON.Scene, 
                                    shaderMaterial: BABYLON.ShaderMaterial) {
    // tie in slider for exposure change, get it now or quit early
    let slide : HTMLInputElement = <HTMLInputElement>document.getElementById('myRange');
    if (slide == null) {
        console.log("Error: unable to find range");
        return;
    }
    let shaderMatList : BABYLON.ShaderMaterial[] = [];
    // load in the list of images
    for (let i = 0; i < 100; i++) {
        var plane = BABYLON.Mesh.CreatePlane("plane", 0.5, scene);
        plane.position = new BABYLON.Vector3(2.0, 1, i*0.05);
        let srcTex = new BABYLON.Texture("./sample_data/"+pad(i, 8)+".png", scene);
        let mc : BABYLON.ShaderMaterial = shaderMaterial.clone(`planeShader{{i}}`);
        mc.setTexture("textureSampler", srcTex);
        mc.setFloat("exposure", 1.0);
        plane.material = mc;
        shaderMatList.push(mc);
        plane.material.backFaceCulling = false;
		plane.hasVertexAlpha = true;
    }
    // setup the slide to 
    slide.onchange = () => {
        for (let i = 0; i < shaderMatList.length; i++) {
            shaderMatList[i].setFloat("exposure", Number(slide.value)/50.0);
        }
    };
    return shaderMatList;
}

let addTextureShaderMaterial = function (scene : BABYLON.Scene) : BABYLON.ShaderMaterial {
    let shaderMaterial : BABYLON.ShaderMaterial = new BABYLON.ShaderMaterial("shader", scene, "./shaders/exposure_shader",
    {
        attributes: ["position", "normal", "uv"],
        uniforms: ["world", "worldView", "worldViewProjection", "view", "textureSampler", "exposure" ]
    });
    shaderMaterial.setFloat("exposure", 0.5);
    shaderMaterial.needAlphaBlending();// = true;
    return shaderMaterial;
}

let addWalkingCamera = function(scene : BABYLON.Scene, canvas : any) {
    let camera : BABYLON.FreeCamera = new BABYLON.FreeCamera('camera1', 
                                        new BABYLON.Vector3(0, 1.8,-5), 
                                        scene);
    camera.setTarget(new BABYLON.Vector3(0, 1.8, 0));
    camera.keysUp.push(87);    //W
    camera.keysDown.push(83)   //D
    camera.keysLeft.push(65);  //A
    camera.keysRight.push(68); //S
    camera.attachControl(canvas,true);
}


class MainScene {
    canvas: any;
    engine: BABYLON.Engine;
    scene: BABYLON.Scene;

    constructor() {
        this.canvas = document.getElementById("renderCanvas");
        this.engine = new BABYLON.Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true });
        this.scene = new BABYLON.Scene(this.engine);
    }

    private createDefaultEnvironment() {
        if  (this.scene == null || this.scene.activeCamera == null)
            return;
        var sphere = BABYLON.Mesh.CreateIcoSphere("sphere", {radius:0.2, flat:true, subdivisions: 1}, this.scene);
        sphere.position.y = 3;
        sphere.material = new BABYLON.StandardMaterial("sphere material",this.scene)
        // Lights and camera
        let light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(0, -0.5, 1.0), this.scene);
        light.position = new BABYLON.Vector3(0, 5, -2);
        //this.scene.activeCamera.beta += 0.8;

        // Default Environment
        let environment = this.scene.createDefaultEnvironment({ enableGroundShadow: true, groundYBias: 1 });
        if (environment == null)
            return;
        environment.setMainColor(BABYLON.Color3.FromHexString("#74b9ff"))        
        // Shadows
        var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
        shadowGenerator.useBlurExponentialShadowMap = true;
        shadowGenerator.blurKernel = 32;
        shadowGenerator.addShadowCaster(sphere, true);        
    }

    public start() {
        console.log("data", this.canvas, this.scene);
        // Playground needs to return at least an empty scene and default camera
        this.engine.runRenderLoop(() => {
            if (this.scene) {
                this.scene.render();
            }
        });
        this.createDefaultEnvironment();
        addWalkingCamera(this.scene, this.canvas);
  
        this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
        this.scene.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    
        // Create simple sphere
        var shaderSphere = BABYLON.Mesh.CreateIcoSphere("sphere", {radius:0.2, flat:true, subdivisions: 1}, this.scene);
        shaderSphere.position.y = 2;
      
        // Resize
        window.addEventListener("resize", () => {
            this.engine.resize();
        });   
    
        this.scene.executeWhenReady(() => {
            addTexturedPlanes(this.scene, addTextureShaderMaterial(this.scene));
        });
    
    }    
}

export class Startup {
    public static main(): number {
        let scene = new MainScene();
        scene.start();
        console.log('Hello World');
        return 0;
    }
}

