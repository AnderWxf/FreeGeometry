import * as THREE from 'three';

/**
 * Perspective controller.
 *
 */
class PerspectiveController {

    private _camera: THREE.PerspectiveCamera;

    private up: THREE.Vector3;
    private right: THREE.Vector3;
    private back: THREE.Vector3;

    private pos: THREE.Vector3 = new THREE.Vector3(5, 0, 5);
    private yaw: number = -45;
    private pitch: number = 0;

    private KeyShiftDown: Boolean = false;
    private KeyCtrlDown: Boolean = false;
    private KeyWDown: Boolean = false;
    private KeySDown: Boolean = false;
    private KeyADown: Boolean = false;
    private KeyDDown: Boolean = false;
    private KeyEDown: Boolean = false;
    private KeyQDown: Boolean = false;
    private KeySpaceDown: Boolean = false;


    private MouseLeftDown: Boolean = false;
    private MouseMiddleDown: Boolean = false;
    private MouseRightDown: Boolean = false;
    private MoveSpeed: number = 10;

    private _isActive: boolean = false;

    /**
     * Constructs a Perspective controller.
     *
     */
    constructor() {
        // 创建一个透视相机
        const camera = new THREE.PerspectiveCamera(
            75, // 视场角（FOV）
            window.innerWidth / window.innerHeight, // 宽高比
            0.1, // 近裁剪面
            3000 // 远裁剪面
        );
        this._camera = camera;
        this.up = camera.up;
        camera.position.set(this.pos.x, this.pos.y, this.pos.z);
        camera.lookAt(new THREE.Vector3());
        let quaternion = camera.quaternion;
        this.up = new THREE.Vector3(0, 1, 0);
        this.right = new THREE.Vector3(1, 0, 0);
        this.back = new THREE.Vector3(0, 0, 1);
        this.up.applyQuaternion(quaternion);
        this.right.applyQuaternion(quaternion);
        this.back.applyQuaternion(quaternion);

    }

    get camera(): THREE.PerspectiveCamera {
        return this._camera;
    }
    get isActive(): boolean {
        return this._isActive;
    }

    onKeyDown = (event: KeyboardEvent) => {
        switch (event.code) {
            case "KeyW":
                this.KeyWDown = true;
                break;
            case "KeyS":
                this.KeySDown = true;
                break;
            case "KeyA":
                this.KeyADown = true;
                break;
            case "KeyD":
                this.KeyDDown = true;
                break;
            case "KeyE":
                this.KeyEDown = true;
                break;
            case "KeyQ":
                this.KeyQDown = true;
                break;
            case "Space":
                this.KeySpaceDown = true;
                break;
            case "ShiftLeft":
                this.KeyShiftDown = true;
                break;
        }
    }
    onKeyUp = (event: KeyboardEvent) => {
        switch (event.code) {
            case "KeyW":
                this.KeyWDown = false;
                break;
            case "KeyS":
                this.KeySDown = false;
                break;
            case "KeyA":
                this.KeyADown = false;
                break;
            case "KeyD":
                this.KeyDDown = false;
                break;
            case "KeyE":
                this.KeyEDown = false;
                break;
            case "KeyQ":
                this.KeyQDown = false;
                break;
            case "Space":
                this.KeySpaceDown = false;
                break;
            case "ControlLeft":
                this.KeyCtrlDown = !this.KeyCtrlDown;
                break;
            case "ShiftLeft":
                this.KeyShiftDown = false;
                break;
        }
    }
    onWheel = (event: WheelEvent) => {

        let _camera = this._camera;
        const min = 5;
        const max = 120;
        const step = 5;
        if (event.deltaY > 0 && _camera.fov < max) { _camera.fov += step; }
        if (event.deltaY < 0 && _camera.fov > min) { _camera.fov -= step; }
        if (_camera.fov < min) { _camera.fov = min; }
        if (_camera.fov > max) { _camera.fov = max; }
        _camera.updateProjectionMatrix();
    }
    onMouseDown = (event: MouseEvent) => {
        if (event.button == 0) { this.MouseLeftDown = true; }
        if (event.button == 1) { this.MouseMiddleDown = true; }
        if (event.button == 2) { this.MouseRightDown = true; }
    };

    onMouseUp = (event: MouseEvent) => {
        if (event.button == 0) { this.MouseLeftDown = false; }
        if (event.button == 1) { this.MouseMiddleDown = false; }
        if (event.button == 2) { this.MouseRightDown = false; }
    };

    onMouseMove = (event: MouseEvent) => {
        if (this.MouseRightDown) {
            this.pitch -= event.movementY * 0.1;
            this.pitch = THREE.MathUtils.clamp(this.pitch, -89, +89);
            this.yaw += event.movementX * 0.1;
        } else if (this.MouseLeftDown && this.KeySpaceDown) {
            let keyScale = 1.0;
            if (this.KeyShiftDown) {
                keyScale = 0.1;
            } else if (this.KeyCtrlDown) {
                keyScale = 10;
            }
            let off = new THREE.Vector3();
            off.add(this.right.clone().multiplyScalar(event.movementX * keyScale * -0.025));
            off.add(this.up.clone().multiplyScalar(event.movementY * keyScale * 0.025));
            this.pos.add(off);
        }
        else if (this.MouseMiddleDown) {
            let keyScale = 1.0;
            if (this.KeyShiftDown) {
                keyScale = 0.1;
            } else if (this.KeyCtrlDown) {
                keyScale = 10;
            }
            let off = new THREE.Vector3();
            let distance = Math.abs(event.movementX) > Math.abs(event.movementY) ? event.movementX : event.movementY;
            off.add(this.back.clone().multiplyScalar(distance * keyScale * -0.025));
            this.pos.add(off);
        }
    };
    onFrame(time: number) {
        if (!this._isActive) { return; }
        let keyScale = 1.0;
        if (this.KeyShiftDown) {
            keyScale = 0.1;
        } else if (this.KeyCtrlDown) {
            keyScale = 10;
        }
        let distance = this.MoveSpeed * keyScale * time;
        let off = new THREE.Vector3();
        if (this.KeyWDown) { off.add(this.back.clone().multiplyScalar(-distance)); }
        if (this.KeySDown) { off.add(this.back.clone().multiplyScalar(distance)); }
        if (this.KeyADown) { off.add(this.right.clone().multiplyScalar(-distance)); }
        if (this.KeyDDown) { off.add(this.right.clone().multiplyScalar(distance)); }
        if (this.KeyEDown) { off.add(this.up.clone().multiplyScalar(distance)); }
        if (this.KeyQDown) { off.add(this.up.clone().multiplyScalar(-distance)); }


        let yaw = THREE.MathUtils.degToRad(this.yaw);
        let pitch = THREE.MathUtils.degToRad(this.pitch);

        this.right.set(Math.cos(yaw), 0, Math.sin(yaw));
        this.back.set(Math.cos(yaw + Math.PI * 0.5), 0, Math.sin(yaw + Math.PI * 0.5));
        this.up.set(0, 1, 0);
        this.up.applyAxisAngle(this.right, pitch);
        this.back.applyAxisAngle(this.right, pitch);
        let m = new THREE.Matrix4;
        m.makeBasis(this.right, this.up, this.back);
        this._camera.setRotationFromMatrix(m);
        this.pos.add(off);
        this._camera.position.copy(this.pos);
        this._camera.updateMatrix();

    }
    bind(window: Window) {
        this._isActive = true;
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("keyup", this.onKeyUp);
        window.addEventListener("wheel", this.onWheel);
        window.addEventListener("mousedown", this.onMouseDown);
        window.addEventListener("mouseup", this.onMouseUp);
        window.addEventListener("mousemove", this.onMouseMove);
    }
    unbind(window: Window) {
        this._isActive = false;
        window.removeEventListener("keydown", this.onKeyDown);
        window.removeEventListener("keyup", this.onKeyUp);
        window.removeEventListener("wheel", this.onWheel);
        window.removeEventListener("mousedown", this.onMouseDown);
        window.removeEventListener("mouseup", this.onMouseUp);
        window.removeEventListener("mousemove", this.onMouseMove);
    }

}

export { PerspectiveController };