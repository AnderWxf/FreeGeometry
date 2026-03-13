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
import { Curve2Type } from "../../../core/Constents";
import { CurveBuilder } from "../../../geometry/algorithm/builder/CurveBuilder";
import { PI_2 } from "../../../math/MathUtils";


/**
 * Create command class.
 * 
 */
class CreateEllipse2Com extends ComCreate {
    centerPoint: Vector2;
    majorPoint: Vector2;
    minorPoint: Vector2;
    constructor(executer: CommandExecuter, text: string) {
        super(executer, text);
    }
    async exec(): Promise<void> {
        let str = this._text;
        let paras = str.split(' ');
        if (paras.length == 7) {
            // 创建一个线段
            this.centerPoint = new Vector2(new Number(paras[1]).valueOf(), new Number(paras[2]).valueOf());
            this.majorPoint = new Vector2(new Number(paras[3]).valueOf(), new Number(paras[4]).valueOf());
            this.minorPoint = new Vector2(new Number(paras[5]).valueOf(), new Number(paras[6]).valueOf());
        } else {
            this.bind(window);
            let context: ActionContext3D = new ActionContext3D(Global.scene, Global.camera, Global.renderer, Global.select);

            let act_pick_center = new ActPickPoint2();
            await act_pick_center.execute(context);
            if (this._isCancel) { this.cancel(); return; }
            this.centerPoint = new Vector2(act_pick_center.result.x, act_pick_center.result.y);
            this.assists.push(this.createAssistPoint(this.centerPoint, THREE.Color.NAMES.greenyellow));
            Global.scene.add(this.assists[this.assists.length - 1]);

            let act_pick_major = new ActPickPoint2();
            await act_pick_major.execute(context);
            if (this._isCancel) { this.cancel(); return; }
            this.majorPoint = new Vector2(act_pick_major.result.x, act_pick_major.result.y);
            this.assists.push(this.createAssistPoint(this.majorPoint, THREE.Color.NAMES.limegreen));
            Global.scene.add(this.assists[this.assists.length - 1]);

            let act_pick_minor = new ActPickPoint2();
            await act_pick_minor.execute(context);
            if (this._isCancel) { this.cancel(); return; }
            this.minorPoint = new Vector2(act_pick_minor.result.x, act_pick_minor.result.y);

            this._text = paras[0] + ' ' + this.centerPoint.x + ' ' + this.centerPoint.y + ' ' + this.majorPoint.x + ' ' + this.majorPoint.y + ' ' + this.minorPoint.x + ' ' + this.minorPoint.y;
        }
        // 创建一个曲线段
        let edge = Brep2Builder.BuildEllipseEdge2FromCenterBeginEndPoint(this.centerPoint, this.majorPoint, this.minorPoint);
        let geo = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.red);
        geo.userData.type = Curve2Type.E;
        this.result = geo;

        let alg = CurveBuilder.Algorithm2ByData(edge.curve);
        this.minorPoint = alg.p(PI_2);
        this.assists.push(this.createAssistPoint(this.minorPoint, THREE.Color.NAMES.darkblue));
        Global.scene.add(this.assists[this.assists.length - 1]);

        this.done();
    }
    onMouseMove = (event: MouseEvent) => {
        if (this._isCancel) { this.cancel(); return; }
        if (this.centerPoint && !this.majorPoint) {
            if (this.tempResult) {
                Global.scene.remove(this.tempResult);
            }
            let majorPoint: Vector2 = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
            // 创建一个临时曲线段
            let edge = Brep2Builder.BuildCircleEdge2FromCenterRadius(this.centerPoint, majorPoint.distanceTo(this.centerPoint));
            let t = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray, undefined, 0, false);
            t.name = "temp";
            this.tempResult = t;
            Global.scene.add(this.tempResult);
        }
        if (this.centerPoint && this.majorPoint && !this.minorPoint) {
            if (this.tempResult) {
                Global.scene.remove(this.tempResult);
            }
            let minorPoint: Vector2 = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
            // 创建一个临时曲线段
            let edge = Brep2Builder.BuildEllipseEdge2FromCenterBeginEndPoint(this.centerPoint, this.majorPoint, minorPoint);
            let t = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray, undefined, 0, false);
            t.name = "temp";
            this.tempResult = t;
            Global.scene.add(this.tempResult);
        }

    };
}
export { CreateEllipse2Com };