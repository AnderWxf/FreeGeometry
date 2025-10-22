import * as THREE from 'three';

/**
 * Camera.
 *
 */
class CameraController {
    /**
     * The three camera.
     *
     * @type {THREE.Camera}
     */
    private camera: THREE.Camera;

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


    private MouseLeftDown: Boolean = false;
    private MouseMiddleDown: Boolean = false;
    private MouseRightDown: Boolean = false;



    private MoveSpeed: number = 10;

    /**
     * Constructs a CameraController.
     *
     * @param {THREE.Camera} [camera=THREE.Camera]
     */
    constructor(camera: THREE.Camera) {
        this.camera = camera;
        this.up = camera.up;
        this.pos = camera.position;
        let quaternion = camera.quaternion;

        this.up = new THREE.Vector3(0, 1, 0);
        this.right = new THREE.Vector3(1, 0, 0);
        this.back = new THREE.Vector3(0, 0, 1);
        this.up.applyQuaternion(quaternion);
        this.right.applyQuaternion(quaternion);
        this.back.applyQuaternion(quaternion);

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
            case "ControlLeft":
                this.KeyCtrlDown = !this.KeyCtrlDown;
                break;
            case "ShiftLeft":
                this.KeyShiftDown = false;
                break;
        }
    }
    onWheel = (event: WheelEvent) => {
        if (this.camera instanceof THREE.PerspectiveCamera) {
            let camera = this.camera;
            const min = 5;
            const max = 120;
            const step = 5;
            if (event.deltaY > 0 && camera.fov < max) { camera.fov += step; }
            if (event.deltaY < 0 && camera.fov > min) { camera.fov -= step; }
            if (camera.fov < min) { camera.fov = min; }
            if (camera.fov > max) { camera.fov = max; }
            camera.updateProjectionMatrix();
        }
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
        if (this.MouseRightDown && this.camera instanceof THREE.PerspectiveCamera) {
            this.pitch -= event.movementY * 0.1;
            this.pitch = THREE.MathUtils.clamp(this.pitch, -89, +89);
            this.yaw += event.movementX * 0.1;
        }
    };
    onFrame(time: number) {
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
        this.camera.setRotationFromMatrix(m);
        this.pos.add(off);
        this.camera.position.copy(this.pos);
        this.camera.updateMatrix();

    }
    bind(window: Window) {
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("keyup", this.onKeyUp);
        window.addEventListener("wheel", this.onWheel);
        window.addEventListener("mousedown", this.onMouseDown);
        window.addEventListener("mouseup", this.onMouseUp);
        window.addEventListener("mousemove", this.onMouseMove);
    }

}

export { CameraController };