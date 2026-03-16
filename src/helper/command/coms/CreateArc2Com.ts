import * as THREE from "three";
import { ComCreate } from "./ComCreate";
import { ActionContext3D } from "../Active";
import { Global } from "../../../core/Global";
import { ActPickPoint2 } from "../acts/ActPickPoint2";
import { Brep2Builder } from "../../../geometry/algorithm/builder/Brep2Builder";
import { Vector2 } from "../../../math/Math";
import { BrepMeshBuilder } from "../../MeshBuilder";
import type { CommandExecuter } from "../CommandExecuter";
import { Curve2Type } from "../../../core/Constents";


/**
 * Create command class.
 * 
 */
class CreateArc2Com extends ComCreate {
    centerPoint: Vector2;
    beginPoint: Vector2;
    endPoint: Vector2;
    constructor(executer: CommandExecuter, text: string) {
        super(executer, text);
    }
    async exec(): Promise<void> {
        let str = this._text;
        let paras = str.split(' ');
        if (paras.length == 7) {
            // 创建一个线段
            this.centerPoint = new Vector2(new Number(paras[1]).valueOf(), new Number(paras[2]).valueOf());
            this.beginPoint = new Vector2(new Number(paras[3]).valueOf(), new Number(paras[4]).valueOf());
            this.endPoint = new Vector2(new Number(paras[5]).valueOf(), new Number(paras[6]).valueOf());
        } else {
            this.bind(window);
            let context: ActionContext3D = new ActionContext3D(Global.scene, Global.camera, Global.renderer, Global.select);

            let act_pick_center = new ActPickPoint2();
            await act_pick_center.execute(context);
            if (this._isCancel) { this.cancel(); return; }
            this.centerPoint = new Vector2(act_pick_center.result.x, act_pick_center.result.y);
            this.assists.push(this.createAssistPoint(this.centerPoint, THREE.Color.NAMES.greenyellow));
            Global.scene.add(this.assists[this.assists.length - 1]);

            let act_pick_begin = new ActPickPoint2();
            await act_pick_begin.execute(context);
            if (this._isCancel) { this.cancel(); return; }
            this.beginPoint = new Vector2(act_pick_begin.result.x, act_pick_begin.result.y);
            this.assists.push(this.createAssistPoint(this.beginPoint, THREE.Color.NAMES.limegreen));
            Global.scene.add(this.assists[this.assists.length - 1]);

            let act_pick_end = new ActPickPoint2();
            await act_pick_end.execute(context);
            if (this._isCancel) { this.cancel(); return; }
            this.endPoint = new Vector2(act_pick_end.result.x, act_pick_end.result.y);
        }
        // 创建一个曲线段
        let edge = Brep2Builder.BuildCircleArcEdge2FromCenterBeginEndPoin(this.centerPoint, this.beginPoint, this.endPoint);
        let geo = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.red);
        geo.userData.type = Curve2Type.A;
        edge.curve
        this.result = geo;

        this.assists.push(this.createAssistPoint(this.endPoint));
        Global.scene.add(this.assists[this.assists.length - 1]);
        this._text = paras[0] + ' ' + this.centerPoint.x + ' ' + this.centerPoint.y + ' ' + this.beginPoint.x + ' ' + this.beginPoint.y + ' ' + this.endPoint.x + ' ' + this.endPoint.y;

        this.done();
    }
    onMouseMoveExec(event: MouseEvent) {
        if (this._isCancel) { this.cancel(); return; }
        if (this.centerPoint && !this.beginPoint) {
            if (this.tempResult) {
                Global.scene.remove(this.tempResult);
            }
            let beginPoint: Vector2 = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
            // 创建一个临时曲线段
            let edge = Brep2Builder.BuildCircleEdge2FromCenterRadius(this.centerPoint, beginPoint.distanceTo(this.centerPoint));
            let t = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray, undefined, 0, false);
            t.name = "temp";
            this.tempResult = t;
            Global.scene.add(this.tempResult);
        }
        if (this.centerPoint && this.beginPoint && !this.endPoint) {
            if (this.tempResult) {
                Global.scene.remove(this.tempResult);
            }
            let endPoint: Vector2 = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
            // 创建一个临时曲线段
            let edge = Brep2Builder.BuildCircleArcEdge2FromCenterBeginEndPoin(this.centerPoint, this.beginPoint, endPoint);
            let t = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray, undefined, 0, false);
            t.name = "temp";
            this.tempResult = t;
            Global.scene.add(this.tempResult);
        }
    };
}
export { CreateArc2Com };