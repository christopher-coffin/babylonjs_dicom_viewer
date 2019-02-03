
import * as BABYLON from 'babylonjs';
import 'babylonjs-materials';


let pad = function (num:number, size:number): string {
    let s = num+"";
    while (s.length < size) s = "0" + s;
    return s;
}

let getImageHistogram = function (srcTex : BABYLON.Texture) {
    let buffer = new Uint8Array(4*512*512);
    let b2 : Uint8Array = <Uint8Array>srcTex.readPixels();
    //console.log('got it', b2);
    let hist = Array(256).fill(0);
    // now go through b2 and get the sum of the values for each color filling an array of 0-255
    if (b2 !== null) {
        for (let i = 0; i < b2.length; i+=4) {
            hist[b2[i]]++;
        }
    }
    //console.log(hist);
    return hist;
}

let addTexturedPlanes = function(scene: BABYLON.Scene, 
                                    jsScope: any,
                                    shaderMaterial: BABYLON.ShaderMaterial,
                                    callback: Function,
                                    callbackObj : MainScene) : BABYLON.TransformNode {
    let commonParent : BABYLON.TransformNode = new BABYLON.TransformNode("dicomCommonParent");
    let shaderMatList : BABYLON.ShaderMaterial[] = [];
    // load in the list of images
    let numberOfImages = 900;
    let imageSpacing = 0.0025;
    let pixelCount = 512.0;
    let pixelSpacing = 0.001782;
    for (let i = 0; i < numberOfImages; i++) {
        var plane = BABYLON.Mesh.CreatePlane("plane", pixelCount*pixelSpacing, scene);
        plane.position = new BABYLON.Vector3(0, 0, (i-(numberOfImages/2.0))*imageSpacing);
        let srcTex = new BABYLON.Texture("./sample_data/fbt/"+pad(i, 3)+".png", scene, 
                                        undefined, undefined, undefined, function() {
                                            callback(callbackObj, srcTex);
                                        });
        let mc : BABYLON.ShaderMaterial = shaderMaterial.clone(`planeShader{{i}}`);
        mc.setTexture("textureSampler", srcTex);
        mc.setFloat("exposure", 1.0);
        plane.material = mc;
        shaderMatList.push(mc);
        plane.material.backFaceCulling = false;
        plane.hasVertexAlpha = true;
        plane.material.disableDepthWrite = true;
        plane.setParent(commonParent);
        mc.setFloat("wMinThreshold", 0.0);
        mc.setFloat("wMaxThreshold", 255.0);
        mc.setFloat("yClip", 1.0);
    }
    // setup the slide to watch the min max thresholds for white
    jsScope.$watch('wMinThreshold', function (newValue: number) {
        for (let i = 0; i < shaderMatList.length; i++) {
            shaderMatList[i].setFloat("wMinThreshold", Number(newValue)/255.0);
        }
    });
    jsScope.$watch('wMaxThreshold', function (newValue: number) {
        for (let i = 0; i < shaderMatList.length; i++) {
            shaderMatList[i].setFloat("wMaxThreshold", Number(newValue)/255.0);
        }
    });
    jsScope.$watch('yClip', function (newValue: number) {
        for (let i = 0; i < shaderMatList.length; i++) {
            shaderMatList[i].setFloat("yClip", Number(newValue)/100.0);
        }
    });
    commonParent.setAbsolutePosition(new BABYLON.Vector3(0, 0, 0));
    return commonParent;
}

let addTextureShaderMaterial = function (scene : BABYLON.Scene) : BABYLON.ShaderMaterial {
    let shaderMaterial : BABYLON.ShaderMaterial = new BABYLON.ShaderMaterial("shader", scene, "./shaders/exposure_shader",
    {
        attributes: ["position", "normal", "uv"],
        uniforms: ["world", "worldView", "worldViewProjection", "view", 
                    "textureSampler", "wMinThreshold", "wMaxThreshold","yClip" ]
    });
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

let addArcRotateCamera = function(scene : BABYLON.Scene, canvas : any) : BABYLON.ArcRotateCamera {
    // Parameters: alpha, beta, radius, target position, scene
    let camera = new BABYLON.ArcRotateCamera("Camera", 0, 0, 2, new BABYLON.Vector3(0, 0, 0), scene);
    // Positions the camera overwriting alpha, beta, radius
    camera.setPosition(new BABYLON.Vector3(0, 0, 5));
    camera.keysUp.push(87);    //W
    camera.keysDown.push(83)   //D
    camera.keysLeft.push(65);  //A
    camera.keysRight.push(68); //S
    camera.speed = 0.5;
    camera.wheelPrecision = 60;
    // This attaches the camera to the canvas
    camera.attachControl(canvas, true);
    return camera;
}


class MainScene {
    canvas: HTMLCanvasElement;
    engine: BABYLON.Engine;
    scene: BABYLON.Scene;
    hist_sum: Array<number>;
    hist_sample_count: number;
    js_scope: any;

    constructor(js_scope: any) {
        this.js_scope = js_scope;
        this.canvas = <HTMLCanvasElement>document.getElementById("renderCanvas");
        this.engine = new BABYLON.Engine(this.canvas, true, { preserveDrawingBuffer: true, stencil: true });
        this.scene = new BABYLON.Scene(this.engine);
        this.hist_sum = Array(256).fill(0);
        this.hist_sample_count = 0;
    }

    public updateHistSum(srcTex : BABYLON.Texture) {
        let image_hist : Array<number> = getImageHistogram(srcTex)
        for (let i = 0; i < 256; i++) {
            this.hist_sum[i] = (this.hist_sample_count + image_hist[i]*this.hist_sample_count)/(this.hist_sample_count+1);
            this.hist_sample_count++;
        }
        this.js_scope.$store.commit("setArray", this.hist_sum);
    };

    private createDefaultEnvironment() {
        if  (this.scene == null)
            return;
        var sphere = BABYLON.Mesh.CreateIcoSphere("sphere", {radius:0.2, flat:true, subdivisions: 1}, this.scene);
        sphere.position.y = 3;
        sphere.material = new BABYLON.StandardMaterial("sphere material",this.scene)
        // Lights and camera
        let light = new BABYLON.DirectionalLight("light", new BABYLON.Vector3(0, -0.5, 1.0), this.scene);
        light.position = new BABYLON.Vector3(0, 5, -2);
        //this.scene.activeCamera.beta += 0.8;

        // Default Environment
        let environment = this.scene.createDefaultEnvironment();//{ enableGroundShadow: true, groundYBias: 3 });
        if (environment == null)
            return;
        environment.setMainColor(BABYLON.Color3.FromHexString("#74b9ff"))        
        // Shadows
        /*var shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
        shadowGenerator.useBlurExponentialShadowMap = true;
        shadowGenerator.blurKernel = 32;
        shadowGenerator.addShadowCaster(sphere, true);        
        */
    }

    public start(jsScope: any) {
        this.canvas.focus();
        // Playground needs to return at least an empty scene and default camera
        this.engine.runRenderLoop(() => {
            if (this.scene) {
                this.scene.render();
            }
        });
        this.createDefaultEnvironment();
        //addWalkingCamera(this.scene, this.canvas);
        let camera : BABYLON.ArcRotateCamera = addArcRotateCamera(this.scene, this.canvas);
  
        this.scene.clearColor = new BABYLON.Color4(0, 0, 0, 0);
        this.scene.ambientColor = new BABYLON.Color3(0.3, 0.3, 0.3);
    
        // Create simple sphere
        var shaderSphere = BABYLON.Mesh.CreateIcoSphere("sphere", {radius:0.2, flat:true, subdivisions: 1}, this.scene);
        shaderSphere.position.y = 2;
      
        // Resize
        window.addEventListener("resize", () => {
            this.engine.resize();
        });

        let defaultPipeline = new BABYLON.DefaultRenderingPipeline("default", true, this.scene, [camera]);
        defaultPipeline.samples = 4;

        this.scene.executeWhenReady(() => {
            let planeHolder : BABYLON.TransformNode = addTexturedPlanes(this.scene, 
                                                                        jsScope, 
                                                                        addTextureShaderMaterial(this.scene), 
                                                                        staticUpdateHistSum,
                                                                        this);
            //camera.setTarget(planeHolder);
            //this.scene.clipPlane = new BABYLON.Plane(0, 1, 0, -.5);
        });
    
    }    
};

let staticUpdateHistSum = function(thisObj : MainScene, srcTex : BABYLON.Texture) {
    thisObj.updateHistSum(srcTex);
}

export class Startup {
    public static main(js_scope: any): number {
        console.log("scope passed in", js_scope);
        let scene = new MainScene(js_scope);
        scene.start(js_scope);
        return 0;
    }
};

