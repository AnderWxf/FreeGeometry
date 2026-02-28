import type { Select } from "../Select";
import * as THREE from 'three';
import * as WEBGPU from 'three/src/three.WebGPU';
/**
 * Active base class.
 * 
 */
class Active {
    protected _isCancel: boolean = false;
    get isCancel(): boolean {
        return this._isCancel;
    }
    cancel() {
        this._isCancel = true;
    }
    async execute(context: ActionContext3D): Promise<void> {
        this._isCancel = false;
    }
}
// 操作上下文
class ActionContext3D {
    scene: THREE.Scene;
    camera: THREE.Camera;
    renderer: WEBGPU.WebGPURenderer;
    select: Select;
    constructor(scene: THREE.Scene, camera: THREE.Camera, renderer: WEBGPU.WebGPURenderer, select: Select) {
        this.scene = scene;
        this.camera = camera;
        this.renderer = renderer;
        this.select = select;
    }
}
export { Active, ActionContext3D };