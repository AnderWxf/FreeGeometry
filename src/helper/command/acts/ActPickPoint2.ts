import { Global } from "../../../core/Global";
import { Vector2 } from "../../../math/Math";
import { BrepMeshBuilder } from "../../MeshBuilder";
import { ActionContext3D, Active } from "../Active";
import * as THREE from "three";

/**
 * ActPickPoint2 base class.
 * 
 */
class ActPickPoint2 extends Active {
    result: Vector2;
    context: ActionContext3D;
    static PickCursor: THREE.Object3D;
    constructor() {
        super();
        if (!ActPickPoint2.PickCursor) {
            let s = 0.75;
            let vertices = new Array<number>;
            {
                //
                vertices.push(-1 * s);
                vertices.push(0);
                vertices.push(0);
                vertices.push(1 * s);
                vertices.push(0);
                vertices.push(0);

                //
                vertices.push(0);
                vertices.push(-1 * s);
                vertices.push(0);
                vertices.push(0);
                vertices.push(1 * s);
                vertices.push(0);

                //
                vertices.push(-0.5 * s);
                vertices.push(-0.5 * s);
                vertices.push(0);
                vertices.push(0.5 * s);
                vertices.push(-0.5 * s);
                vertices.push(0);
                //
                vertices.push(0.5 * s);
                vertices.push(-0.5 * s);
                vertices.push(0);
                vertices.push(0.5 * s);
                vertices.push(0.5 * s);
                vertices.push(0);
                //
                vertices.push(0.5 * s);
                vertices.push(0.5 * s);
                vertices.push(0);
                vertices.push(-0.5 * s);
                vertices.push(0.5 * s);
                vertices.push(0);
                //
                vertices.push(-0.5 * s);
                vertices.push(0.5 * s);
                vertices.push(0);
                vertices.push(-0.5 * s);
                vertices.push(-0.5 * s);
                vertices.push(0);

            }
            let buff = new THREE.BufferGeometry()
            // buff.setIndex(indices);
            buff.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

            const materialline = new THREE.MeshBasicMaterial({ color: THREE.Color.NAMES.lime });
            ActPickPoint2.PickCursor = new THREE.LineSegments(buff, materialline);
        }
    }
    override async execute(context: ActionContext3D): Promise<void> {
        super.execute(context);
        this.bind(window);
        context.select.clear();
        this.context = context;
        Global.scene.add(ActPickPoint2.PickCursor);
        while (!context.select.pickedPoint && !this._isCancel) {
            await new Promise(resolve => setTimeout(resolve, 10)); // 等待10ms
        }
        if (!this._isCancel)
            this.result = new Vector2(context.select.pickedPoint.x, context.select.pickedPoint.y);
        Global.scene.remove(ActPickPoint2.PickCursor);
        this.unbind(window);
    }
    onMouseMove = (event: MouseEvent) => {
        if (this._isCancel) { return; }
        ActPickPoint2.PickCursor.position.set(this.context.select.overedPoint.x, this.context.select.overedPoint.y, 0);
    };
    bind(window: Window) {
        window.addEventListener("mousemove", this.onMouseMove);
    }
    unbind(window: Window) {
        window.removeEventListener("mousemove", this.onMouseMove);
    }
}
export { ActPickPoint2 };