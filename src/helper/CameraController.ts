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

    private pos: THREE.Vector3;

    private KeyShiftDown: Boolean = false;
    private KeyCtrlDown: Boolean = false;
    private MouseLeftDown: Boolean = false;
    private MouseMiddleDown: Boolean = false;
    private MouseRightDown: Boolean = false;

    private yaw: number = 0;
    private pitch: number = 0;

    private MoveSpeed: number = 0.1;

    /**
     * Constructs a CameraController.
     *
     * @param {THREE.Camera} [camera=THREE.Camera]
     */
    constructor(camera: THREE.Camera) {
        this.camera = camera;
        this.up = camera.up;
        let m = camera.matrix;
        let position = new THREE.Vector3();
        let quaternion = new THREE.Quaternion();
        let scale = new THREE.Vector3();
        m.decompose(position, quaternion, scale);
        this.pos = position;
        this.up = new THREE.Vector3(0, 1, 0);
        this.right = new THREE.Vector3(1, 0, 0);
        this.back = new THREE.Vector3(0, 0, 1);
        this.up.applyQuaternion(quaternion);
        this.right.applyQuaternion(quaternion);
        this.back.applyQuaternion(quaternion);

    }
    onKeyDown = (event: KeyboardEvent) => {
        let speed = 1.0;
        if (event.shiftKey) {
            speed = 0.1;
        }
        speed *= this.MoveSpeed;
        let off = new THREE.Vector3();
        switch (event.code) {
            case "KeyW":
                off.add(this.back.clone().multiplyScalar(-speed));
                break;
            case "KeyS":
                off.add(this.back.clone().multiplyScalar(speed));
                break;
            case "KeyA":
                off.add(this.right.clone().multiplyScalar(-speed));
                break;
            case "KeyD":
                off.add(this.right.clone().multiplyScalar(speed));
                break;
            case "KeyE":
                off.add(this.up.clone().multiplyScalar(speed));
                break;
            case "KeyQ":
                off.add(this.up.clone().multiplyScalar(-speed));
                break;
        }
        this.pos.add(off);
        this.camera.position.copy(this.pos);
        this.camera.updateMatrix();
    }
    onKeyUp = (event: KeyboardEvent) => {
        switch (event.code) {
            case "ControlLeft":
                if (this.MoveSpeed == 0.1) {
                    this.MoveSpeed = 1.0
                } else if (this.MoveSpeed == 1.0) {
                    this.MoveSpeed = 0.1;
                }
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

            this.yaw += THREE.MathUtils.degToRad(event.movementX * 0.1);

            this.right.set(Math.cos(this.yaw), 0, Math.sin(this.yaw));
            this.back.set(Math.cos(this.yaw + Math.PI * 0.5), 0, Math.sin(this.yaw + Math.PI * 0.5));
            this.up.set(0, 1, 0);
            this.up.applyAxisAngle(this.right, THREE.MathUtils.degToRad(this.pitch));
            this.back.applyAxisAngle(this.right, THREE.MathUtils.degToRad(this.pitch));
            let m = new THREE.Matrix4;
            m.makeBasis(this.right, this.up, this.back);
            this.camera.setRotationFromMatrix(m);
            this.camera.updateProjectionMatrix();
        }
    };
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