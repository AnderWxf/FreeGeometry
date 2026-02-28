import * as THREE from "three";
import { Command } from "../Command";
import { ComCreate } from "./ComCreate";
import { ActionContext3D } from "../Active";
import { Global } from "../../../core/Global";
import { ActPickPoint2 } from "../acts/ActPickPoint2";
import { Brep2Builder } from "../../../geometry/algorithm/builder/Brep2Builder";
import { Vector2 } from "../../../math/Math";
import { BrepMeshBuilder } from "../../MeshBuilder";

/**
 * Create command class.
 * 
 */
class CreateLine2Com extends ComCreate {
    result: THREE.Object3D;
    beginPoint: Vector2;
    endPoint: Vector2;
    tempLine: THREE.Object3D;
    constructor() {
        super();
    }
    async exec(): Promise<void> {
        this.bind(window);
        let context: ActionContext3D = new ActionContext3D(Global.scene, Global.camera, Global.renderer, Global.select);
        let act_pick_begin = new ActPickPoint2();

        await act_pick_begin.execute(context);
        if (this._isCancel) { this.cancel(); return; }
        this.beginPoint = new Vector2(act_pick_begin.result.x, act_pick_begin.result.y);
        let act_pick_end = new ActPickPoint2();
        await act_pick_end.execute(context);
        if (this._isCancel) { this.cancel(); return; }
        this.endPoint = new Vector2(act_pick_end.result.x, act_pick_end.result.y);

        // 创建一个直线段
        let lineEdge = Brep2Builder.BuildLineEdge2FromBeginEndPoint(this.beginPoint, this.endPoint);
        let geoLineEdge = BrepMeshBuilder.BuildEdge2Mesh(lineEdge, THREE.Color.NAMES.red);
        geoLineEdge.name = "Line2";
        geoLineEdge.frustumCulled = false;
        this.result = geoLineEdge;
        Global.scene.add(this.result);
        this.done();
    }
    onMouseMove = (event: MouseEvent) => {
        if (this._isCancel) { this.cancel(); return; }
        if (this.beginPoint && !this.endPoint) {
            if (this.tempLine) {
                Global.scene.remove(this.tempLine);
            }
            let endPoint: Vector2 = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
            // 创建一个临时直线段
            let lineEdge = Brep2Builder.BuildLineEdge2FromBeginEndPoint(this.beginPoint, endPoint);
            let tempLine = BrepMeshBuilder.BuildEdge2Mesh(lineEdge, THREE.Color.NAMES.gray);
            tempLine.name = "temp";
            tempLine.frustumCulled = false;
            this.tempLine = tempLine;
            Global.scene.add(this.tempLine);
        }
    };
    protected cancel() {
        this.unbind(window);
        if (this.tempLine) {
            Global.scene.remove(this.tempLine);
        }
    }

    override bind(window: Window) {
        super.bind(window);
        window.addEventListener("mousemove", this.onMouseMove);
    }
    override unbind(window: Window) {
        super.unbind(window);
        window.removeEventListener("mousemove", this.onMouseMove);
    }
    override undo() {
        if (this._isDone) {
            Global.scene.remove(this.result);
        }
    }
    override redo() {
        if (this._isDone) {
            Global.scene.add(this.result);
        }
    }
}
export { CreateLine2Com };