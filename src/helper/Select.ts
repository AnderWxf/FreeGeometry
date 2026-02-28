import * as THREE from 'three';
import { Vector2, Vector3 } from '../math/Math';

/**
 * Select controller.
 *
 */
class Select {
    private _camera: THREE.Camera;
    private _scene: THREE.Scene;
    private _raycaster: THREE.Raycaster;

    private _isMultiple: boolean = false;
    private _isSnap: boolean = true;

    selectedObjects: THREE.Object3D[] = [];
    overObjects: THREE.Object3D[] = [];
    pickedPoint: THREE.Vector3;
    overedPoint: THREE.Vector3;
    constructor(scene: THREE.Scene) {
        this._scene = scene;
        this._raycaster = new THREE.Raycaster();
        this._raycaster.params.Points.threshold = 0.1;
        this._raycaster.params.Line.threshold = 0.1;
        this._raycaster.params.Mesh.threshold = 0.1;
        this._raycaster.params.Sprite.threshold = 0.1;
        this._raycaster.params.LOD.threshold = 0.1;
    }
    get isMultiple(): boolean {
        return this._isMultiple;
    }
    set isMultiple(value: boolean) {
        this._isMultiple = value;
    }

    get isSnap(): boolean {
        return this._isSnap;
    }
    set isSnap(value: boolean) {
        this._isSnap = value;
    }

    set camera(camera: THREE.Camera) {
        this._camera = camera;

        this.bind(window);
    }
    clear() {
        this.selectedObjects = [];
        this.overObjects = [];
        this.pickedPoint = null;
    }

    onKeyDown = (event: KeyboardEvent) => {
        switch (event.code) {
            case "ControlLeft":
                this.isMultiple = true;
                break;
        }
    }
    onKeyUp = (event: KeyboardEvent) => {
        switch (event.code) {
            case "ControlLeft":
                this.isMultiple = false;
                break;
        }
    }
    onMouseClick = (event: MouseEvent) => {
        if (!this.isMultiple) {
            for (let i = 0; i < this.selectedObjects.length; i++) {
                let obj = this.selectedObjects[i] as THREE.Object3D;
                let originalColor = obj.userData.originalColor as THREE.Color;
                if (originalColor) {
                    (obj as any).material.color.copy(originalColor);
                }
            }
            this.selectedObjects = [];
        }
        // 创建射线投射器
        const raycaster = this._raycaster;
        const mouse = new THREE.Vector2();
        // 计算鼠标在canvas上的位置
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // 更新射线的起点和方向
        raycaster.setFromCamera(mouse, this._camera);
        let isCanPick = false;
        // 计算物体和射线的交点
        const intersects = raycaster.intersectObjects(this._scene.children);
        if (intersects.length > 0) {
            for (let i = 0; i < intersects.length; i++) {
                const obj = intersects[i].object;
                this.pickedPoint = intersects[i].point; // 交点的世界坐标
                if (obj.userData.canPick) {
                    isCanPick = true;
                    if (obj.userData.original instanceof Vector2) {
                        this.pickedPoint.set(obj.userData.original.x, obj.userData.original.y, 0);
                    }
                    else if (obj.userData.original instanceof Vector3) {
                        this.pickedPoint.set(obj.userData.original.x, obj.userData.original.y, obj.userData.original.z);
                    }
                    else if (obj.userData.original.p instanceof Vector2) {
                        this.pickedPoint.set(obj.userData.original.p.x, obj.userData.original.p.y, 0);
                    }
                    else if (obj.userData.original.p instanceof Vector3) {
                        this.pickedPoint.set(obj.userData.original.p.x, obj.userData.original.p.y, obj.userData.original.p.z);
                    }
                    if (!this.selectedObjects.includes(obj)) {
                        if (this.overObjects.includes(obj)) {
                            this.overObjects.splice(this.overObjects.indexOf(obj), 1);
                        } else {
                            if ((obj as any).material && (obj as any).material.color) {
                                let originalColor = (obj as any).material.color as THREE.Color;
                                obj.userData.originalColor = originalColor.clone();
                                (obj as any).material.color.set(THREE.Color.NAMES.aqua);
                            }
                        }
                        this.selectedObjects.push(obj);
                    }
                    return;
                }
            }
        } else {
            this.pickedPoint = raycaster.ray.origin; // 没有交点时，设置射线源点
        }
        if (this._isSnap && !isCanPick) {
            this.pickedPoint.x = Math.round(this.pickedPoint.x);
            this.pickedPoint.y = Math.round(this.pickedPoint.y);
        }
    };
    onMouseMove = (event: MouseEvent) => {
        // 可以在这里实现鼠标移动时的交互逻辑，例如高亮选中对象等
        for (let i = 0; i < this.overObjects.length; i++) {
            let obj = this.overObjects[i] as THREE.Object3D;
            let originalColor = obj.userData.originalColor as THREE.Color;
            if (originalColor) {
                (obj as any).material.color.copy(originalColor);
            }
        }
        this.overObjects = [];
        // 创建射线投射器
        const raycaster = this._raycaster;
        const mouse = new THREE.Vector2();
        // 计算鼠标在canvas上的位置
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

        // 更新射线的起点和方向
        raycaster.setFromCamera(mouse, this._camera);
        let isCanPick = false;
        // 计算物体和射线的交点
        const intersects = raycaster.intersectObjects(this._scene.children);
        if (intersects.length > 0) {
            for (let i = intersects.length - 1; i >= 0; i--) {
                const obj = intersects[i].object;
                this.overedPoint = intersects[i].point; // 交点的世界坐标
                if (obj.userData.canPick) {
                    isCanPick = true;
                    if (!this.overObjects.includes(obj) && !this.selectedObjects.includes(obj)) {
                        if ((obj as any).material && (obj as any).material.color) {
                            let originalColor = (obj as any).material.color as THREE.Color;
                            obj.userData.originalColor = originalColor.clone();
                            (obj as any).material.color.set(THREE.Color.NAMES.aqua);
                        }
                        this.overObjects.push(obj);
                    }
                }
            }
        } else {
            this.overedPoint = raycaster.ray.origin; // 没有交点时，设置射线源点
        }
        if (this._isSnap && !isCanPick) {
            this.overedPoint.x = Math.round(this.overedPoint.x);
            this.overedPoint.y = Math.round(this.overedPoint.y);
        }
    };

    bind(window: Window) {
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("keyup", this.onKeyUp);
        window.addEventListener('click', this.onMouseClick);
        window.addEventListener("mousemove", this.onMouseMove);
    }
    unbind(window: Window) {
        window.removeEventListener("keydown", this.onKeyDown);
        window.removeEventListener("keyup", this.onKeyUp);
        window.removeEventListener('click', this.onMouseClick);
        window.removeEventListener("mousemove", this.onMouseMove);
    }
}
export { Select };