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
import { PI, PI2, PI_2 } from "../../../math/MathUtils";


/**
 * Create command class.
 * 
 */
class CreateHyperbola2Com extends ComCreate {
    centerPoint: Vector2;
    majorPoint: Vector2;
    minorPoint: Vector2;
    u0Point: Vector2;
    u1Point: Vector2;
    private isRight: boolean = true;   // 默认右侧弧(按下左shift表示画左侧弧)
    constructor(executer: CommandExecuter, text: string) {
        super(executer, text);
    }
    async exec(): Promise<void> {
        let str = this._text;
        let paras = str.split(' ');
        if (paras.length == 12) {
            // 创建一个线段
            this.centerPoint = new Vector2(new Number(paras[1]).valueOf(), new Number(paras[2]).valueOf());
            this.majorPoint = new Vector2(new Number(paras[3]).valueOf(), new Number(paras[4]).valueOf());
            this.minorPoint = new Vector2(new Number(paras[5]).valueOf(), new Number(paras[6]).valueOf());
            this.u0Point = new Vector2(new Number(paras[7]).valueOf(), new Number(paras[8]).valueOf());
            this.u1Point = new Vector2(new Number(paras[9]).valueOf(), new Number(paras[10]).valueOf());
            this.isRight = new Boolean(paras[11]).valueOf();
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

            let act_pick_u0 = new ActPickPoint2();
            await act_pick_u0.execute(context);
            if (this._isCancel) { this.cancel(); return; }
            this.u0Point = new Vector2(act_pick_u0.result.x, act_pick_u0.result.y);

            let act_pick_u1 = new ActPickPoint2();
            await act_pick_u1.execute(context);
            if (this._isCancel) { this.cancel(); return; }
            this.u1Point = new Vector2(act_pick_u1.result.x, act_pick_u1.result.y);

            this._text = paras[0] + ' ' + this.centerPoint.x + ' ' + this.centerPoint.y
                + ' ' + this.majorPoint.x + ' ' + this.majorPoint.y
                + ' ' + this.minorPoint.x + ' ' + this.minorPoint.y
                + ' ' + this.u0Point.x + ' ' + this.u0Point.y
                + ' ' + this.u1Point.x + ' ' + this.u1Point.y
                + ' ' + this.isRight;
        }
        // 创建一个曲线段
        let edge = Brep2Builder.BuildHyperbolaEdge2FromCenterABPoint(this.centerPoint, this.majorPoint, this.minorPoint);

        let alg = CurveBuilder.Algorithm2ByData(edge.curve);

        this.assists.push(this.createAssistPoint(this.minorPoint, THREE.Color.NAMES.green));
        Global.scene.add(this.assists[this.assists.length - 1]);

        let u0 = alg.u(this.u0Point);
        this.u0Point = alg.p(u0);
        this.assists.push(this.createAssistPoint(this.u0Point, THREE.Color.NAMES.deepskyblue));
        Global.scene.add(this.assists[this.assists.length - 1]);

        let u1 = alg.u(this.u1Point);
        this.u1Point = alg.p(u1);
        this.assists.push(this.createAssistPoint(this.u1Point));
        Global.scene.add(this.assists[this.assists.length - 1]);

        edge.u.set(u0, u1);
        let geo = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.red);
        geo.userData.type = Curve2Type.HY;
        this.result = geo;

        this.done();
    }
    onMouseMoveExec(event: MouseEvent) {
        if (this._isCancel) { this.cancel(); return; }
        if (this.centerPoint && !this.majorPoint) {
            if (this.tempResult) {
                Global.scene.remove(this.tempResult);
            }
            let majorPoint: Vector2 = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
            // 创建一个临时曲线段
            let edge = Brep2Builder.BuildLineEdge2FromBeginEndPoint(this.centerPoint, majorPoint);
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
            let edge = Brep2Builder.BuildHyperbolaEdge2FromCenterABPoint(this.centerPoint, this.majorPoint, minorPoint);
            if (this.isRight) {
                edge.u.set(-PI_2 + 1e-4, PI_2 - 1e-4);
            } else {
                edge.u.set(PI_2 + 1e-4, PI_2 + PI - 1e-4);
            }
            let t = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray, undefined, 0, false);
            t.name = "temp";
            this.tempResult = t;
            Global.scene.add(this.tempResult);
        }

        if (this.centerPoint && this.majorPoint && this.minorPoint && !this.u0Point) {
            if (this.tempResult) {
                Global.scene.remove(this.tempResult);
            }
            let u0Point: Vector2 = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
            // 创建一个临时曲线段
            let edge = Brep2Builder.BuildHyperbolaEdge2FromCenterABPoint(this.centerPoint, this.majorPoint, this.minorPoint);
            let alg = CurveBuilder.Algorithm2ByData(edge.curve);
            let u0 = alg.u(u0Point);
            if (this.isRight) {
                edge.u.set(u0, PI_2 - 1e-4);
            } else {
                edge.u.set(u0, PI_2 + PI - 1e-4);
            }
            let t = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray, undefined, 0, false);
            t.name = "temp";
            this.tempResult = t;
            Global.scene.add(this.tempResult);
        }

        if (this.centerPoint && this.majorPoint && this.minorPoint && this.u0Point && !this.u1Point) {
            if (this.tempResult) {
                Global.scene.remove(this.tempResult);
            }
            let u1Point: Vector2 = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
            // 创建一个临时曲线段
            let edge = Brep2Builder.BuildHyperbolaEdge2FromCenterABPoint(this.centerPoint, this.majorPoint, this.minorPoint);
            let alg = CurveBuilder.Algorithm2ByData(edge.curve);
            let u0 = alg.u(this.u0Point);
            let u1 = alg.u(u1Point);
            edge.u.set(u0, u1);
            let t = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray, undefined, 0, false);
            t.name = "temp";
            this.tempResult = t;
            Global.scene.add(this.tempResult);
        }
    };

    override onKeyDownExec(event: KeyboardEvent) {
        super.onKeyDownExec(event);
        switch (event.code) {
            case "ShiftLeft":
                this.isRight = false;
                break;
        }
    }
    override onKeyUpExec(event: KeyboardEvent) {
        super.onKeyUpExec(event);
        switch (event.code) {
            case "ShiftLeft":
                this.isRight = true;
                break;
        }
    }

}
export { CreateHyperbola2Com };