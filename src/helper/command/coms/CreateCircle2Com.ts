import * as THREE from "three";
import { Command } from "../Command";
import { ComCreate } from "./ComCreate";
import { ActionContext3D } from "../Active";
import { Global } from "../../../core/Global";
import { ActPickPoint2 } from "../acts/ActPickPoint2";
import { Brep2Builder } from "../../../geometry/algorithm/builder/Brep2Builder";
import { Vector2 } from "../../../math/Math";
import { BrepMeshBuilder } from "../../MeshBuilder";
import type { CommandExecuter } from "../CommandExecuter";

/**
 * Create command class.
 * 
 */
class CreateCircle2Com extends ComCreate {
    beginPoint: Vector2;
    endPoint: Vector2;
    constructor(executer: CommandExecuter, text: string) {
        super(executer, text);
    }
    async exec(): Promise<void> {
        let str = this._text;
        let paras = str.split(' ');
        if (paras.length == 5) {
            // 创建一个直线段
            this.beginPoint = new Vector2(new Number(paras[1]).valueOf(), new Number(paras[2]).valueOf());
            this.endPoint = new Vector2(new Number(paras[3]).valueOf(), new Number(paras[4]).valueOf());
        } else {
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
            this._text = 'C' + ' ' + this.beginPoint.x + ' ' + this.beginPoint.y + ' ' + this.endPoint.x + ' ' + this.endPoint.y;
        }
        // 创建一个曲线段
        let edge = Brep2Builder.BuildCircleEdge2FromCenterRadius(this.beginPoint, this.endPoint.distanceTo(this.beginPoint));
        let geo = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.red);
        geo.name = "Circle2";
        geo.frustumCulled = false;
        this.result = geo;
        Global.scene.add(this.result);
        this.done();
    }
    onMouseMove = (event: MouseEvent) => {
        if (this._isCancel) { this.cancel(); return; }
        if (this.beginPoint && !this.endPoint) {
            if (this.temp) {
                Global.scene.remove(this.temp);
            }
            let endPoint: Vector2 = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
            // 创建一个临时曲线段
            let edge = Brep2Builder.BuildCircleEdge2FromCenterRadius(this.beginPoint, endPoint.distanceTo(this.beginPoint));
            let t = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray);
            t.name = "temp";
            t.frustumCulled = false;
            this.temp = t;
            Global.scene.add(this.temp);
        }
    };
}
export { CreateCircle2Com };