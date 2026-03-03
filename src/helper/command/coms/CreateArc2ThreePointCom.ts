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
class CreateArc2ThreePointCom extends ComCreate {
    beginPoint: Vector2;
    middlePoint: Vector2;
    endPoint: Vector2;
    constructor(executer: CommandExecuter, text: string) {
        super(executer, text);
    }
    async exec(): Promise<void> {
        let str = this._text;
        let paras = str.split(' ');
        if (paras.length == 7) {
            // 创建一个直线段
            this.beginPoint = new Vector2(new Number(paras[1]).valueOf(), new Number(paras[2]).valueOf());
            this.middlePoint = new Vector2(new Number(paras[3]).valueOf(), new Number(paras[4]).valueOf());
            this.endPoint = new Vector2(new Number(paras[5]).valueOf(), new Number(paras[6]).valueOf());
        } else {
            this.bind(window);
            let context: ActionContext3D = new ActionContext3D(Global.scene, Global.camera, Global.renderer, Global.select);

            let act_pick_begin = new ActPickPoint2();
            await act_pick_begin.execute(context);
            if (this._isCancel) { this.cancel(); return; }
            this.beginPoint = new Vector2(act_pick_begin.result.x, act_pick_begin.result.y);

            let act_pick_middle = new ActPickPoint2();
            await act_pick_middle.execute(context);
            if (this._isCancel) { this.cancel(); return; }
            this.middlePoint = new Vector2(act_pick_middle.result.x, act_pick_middle.result.y);

            let act_pick_end = new ActPickPoint2();
            await act_pick_end.execute(context);
            if (this._isCancel) { this.cancel(); return; }
            this.endPoint = new Vector2(act_pick_end.result.x, act_pick_end.result.y);
            this._text = 'A3' + ' ' + this.beginPoint.x + ' ' + this.beginPoint.y + ' ' + this.endPoint.x + ' ' + this.endPoint.y;
        }
        // 创建一个曲线段
        let edge = Brep2Builder.BuildArcFromBeginMiddleEndPoint(this.beginPoint, this.middlePoint, this.endPoint);
        let geo = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.red);
        geo.name = "Arc2";
        geo.frustumCulled = false;
        this.result = geo;
        Global.scene.add(this.result);
        this.done();
    }
    onMouseMove = (event: MouseEvent) => {
        if (this._isCancel) { this.cancel(); return; }
        if (this.beginPoint && !this.middlePoint) {
            if (this.temp) {
                Global.scene.remove(this.temp);
            }
            let middlePoint: Vector2 = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
            // 创建一个临时曲线段
            let edge = Brep2Builder.BuildLineEdge2FromBeginEndPoint(this.beginPoint, middlePoint);
            let t = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray);
            t.name = "temp";
            t.frustumCulled = false;
            this.temp = t;
            Global.scene.add(this.temp);
        }
        if (this.beginPoint && this.middlePoint && !this.endPoint) {
            if (this.temp) {
                Global.scene.remove(this.temp);
            }
            let endPoint: Vector2 = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
            // 创建一个临时曲线段
            let edge = Brep2Builder.BuildArcFromBeginMiddleEndPoint(this.beginPoint, this.middlePoint, endPoint);
            let t = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray);
            t.name = "temp";
            t.frustumCulled = false;
            this.temp = t;
            Global.scene.add(this.temp);
        }
    };
}
export { CreateArc2ThreePointCom };