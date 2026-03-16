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
import { ComModify } from "./ComModify";
import { ActPickObject } from "../acts/ActPickObject";
import { Edge2 } from "../../../geometry/data/brep/Brep2";
import { Arc2Data } from "../../../geometry/data/base/curve2/Arc2Data";
import { Curve2Type } from "../../../core/Constents";
import { ActPickAssist } from "../acts/ActPickAssist";
import { CurveBuilder } from "../../../geometry/algorithm/builder/CurveBuilder";
import { PI2, PI_2 } from "../../../math/MathUtils";


/**
 * Modify command class.
 * 
 */
class ModifyEllipseArc2Com extends ComModify {
    private isForward: boolean = true;   // 默认正向弧(按下左shift表示画反向弧-正时针旋转)
    constructor(executer: CommandExecuter, text: string) {
        super(executer, text);
    }
    async exec(): Promise<void> {
        let str = this._text;
        let paras = str.split(' ');
        let centerPoint: Vector2;
        let majorPoint: Vector2;
        let minorPoint: Vector2;
        let u0Point: Vector2;
        let u1Point: Vector2;
        if (paras.length == 12) {
            // 创建一个线段
            centerPoint = new Vector2(new Number(paras[1]).valueOf(), new Number(paras[2]).valueOf());
            majorPoint = new Vector2(new Number(paras[3]).valueOf(), new Number(paras[4]).valueOf());
            minorPoint = new Vector2(new Number(paras[5]).valueOf(), new Number(paras[6]).valueOf());
            u0Point = new Vector2(new Number(paras[7]).valueOf(), new Number(paras[8]).valueOf());
            u1Point = new Vector2(new Number(paras[9]).valueOf(), new Number(paras[10]).valueOf());
            this.isForward = new Boolean(paras[11]).valueOf();
        } else {
            this.bind(window);
            let context: ActionContext3D = new ActionContext3D(Global.scene, Global.camera, Global.renderer, Global.select);

            let act_pick_data = new ActPickObject();
            await act_pick_data.execute(context);
            if (this._isCancel) { this.cancel(); return; }
            while (!act_pick_data.result.userData
                || act_pick_data.result.userData.type != Curve2Type.EA
            ) {
                await act_pick_data.execute(context);
                if (this._isCancel) { this.cancel(); return; }
            }
            this.old = act_pick_data.result;



            let act_pick_assist = new ActPickAssist();
            await act_pick_assist.execute(context);
            this.assistIndex = this.getIndex(act_pick_assist.result);
            while (!act_pick_assist.result.userData.isAssist || this.assistIndex < 0) {
                await act_pick_assist.execute(context);
                this.assistIndex = this.getIndex(act_pick_assist.result);
                if (this._isCancel) { this.cancel(); return; }
            }

            let act_pick_new_pos = new ActPickPoint2();
            await act_pick_new_pos.execute(context);
            if (this._isCancel) { this.cancel(); return; }

            centerPoint = new Vector2(this.old.children[0].position.x, this.old.children[0].position.y);
            majorPoint = new Vector2(this.old.children[1].position.x, this.old.children[1].position.y);
            minorPoint = new Vector2(this.old.children[2].position.x, this.old.children[2].position.y);
            u0Point = new Vector2(this.old.children[3].position.x, this.old.children[3].position.y);
            u1Point = new Vector2(this.old.children[4].position.x, this.old.children[4].position.y);

            if (this.assistIndex == 0) {
                centerPoint.x = act_pick_new_pos.result.x;
                centerPoint.y = act_pick_new_pos.result.y;
            }
            if (this.assistIndex == 1) {
                majorPoint.x = act_pick_new_pos.result.x;
                majorPoint.y = act_pick_new_pos.result.y;
            }
            if (this.assistIndex == 2) {
                minorPoint.x = act_pick_new_pos.result.x;
                minorPoint.y = act_pick_new_pos.result.y;
            }
            if (this.assistIndex == 3) {
                u0Point.x = act_pick_new_pos.result.x;
                u0Point.y = act_pick_new_pos.result.y;
            }
            if (this.assistIndex == 4) {
                u1Point.x = act_pick_new_pos.result.x;
                u1Point.y = act_pick_new_pos.result.y;
            }


        }
        // 创建一个曲线段
        let edge = Brep2Builder.BuildEllipseEdge2FromCenterBeginEndPoint(centerPoint, majorPoint, minorPoint);

        let alg = CurveBuilder.Algorithm2ByData(edge.curve);

        minorPoint = alg.p(PI_2);

        let u0 = alg.u(u0Point);
        u0Point = alg.p(u0);

        let u1 = alg.u(u1Point);
        u1Point = alg.p(u1);

        this.assists[0] = this.createAssistPoint(centerPoint, THREE.Color.NAMES.greenyellow);
        this.assists[1] = this.createAssistPoint(majorPoint, THREE.Color.NAMES.limegreen);
        this.assists[2] = this.createAssistPoint(minorPoint, THREE.Color.NAMES.green);
        this.assists[3] = this.createAssistPoint(u0Point, THREE.Color.NAMES.deepskyblue);
        this.assists[4] = this.createAssistPoint(u1Point);

        this._text = paras[0] + ' ' + centerPoint.x + ' ' + centerPoint.y
            + ' ' + majorPoint.x + ' ' + majorPoint.y
            + ' ' + minorPoint.x + ' ' + minorPoint.y
            + ' ' + u0Point.x + ' ' + u0Point.y
            + ' ' + u1Point.x + ' ' + u1Point.y
            + ' ' + this.isForward
            ;

        edge.u.set(u0, u1);
        if (this.isForward) {
            if (u1 < u0) {
                edge.u.set(u0, u1 + PI2);
            }
        } else {
            if (u0 < u1) {
                edge.u.set(u0, u1 - PI2);
            }
        }

        let geo = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.red);
        geo.userData.type = Curve2Type.EA;
        this.result = geo;
        this.done();
    }
    onMouseMoveExec(event: MouseEvent) {
        if (this._isCancel) { this.cancel(); return; }
        if (this.assistIndex > -1) {
            if (this.tempResult) {
                Global.scene.remove(this.tempResult);
            }

            let centerPoint = new Vector2(this.old.children[0].position.x, this.old.children[0].position.y);
            let majorPoint = new Vector2(this.old.children[1].position.x, this.old.children[1].position.y);
            let minorPoint = new Vector2(this.old.children[2].position.x, this.old.children[2].position.y);
            let u0Point = new Vector2(this.old.children[3].position.x, this.old.children[3].position.y);
            let u1Point = new Vector2(this.old.children[4].position.x, this.old.children[4].position.y);

            if (this.assistIndex == 0) {
                centerPoint = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
            }
            if (this.assistIndex == 1) {
                majorPoint = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
            }
            if (this.assistIndex == 2) {
                minorPoint = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
            }
            if (this.assistIndex == 3) {
                u0Point = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
            }
            if (this.assistIndex == 4) {
                u1Point = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
            }
            // 创建一个临时曲线段
            let edge = Brep2Builder.BuildEllipseEdge2FromCenterBeginEndPoint(centerPoint, majorPoint, minorPoint);
            let alg = CurveBuilder.Algorithm2ByData(edge.curve);

            minorPoint = alg.p(PI_2);
            let u0 = alg.u(u0Point);
            u0Point = alg.p(u0);

            let u1 = alg.u(u1Point);
            u1Point = alg.p(u1);
            edge.u.set(u0, u1);

            if (this.isForward) {
                if (u1 < u0) {
                    edge.u.set(u0, u1 + PI2);
                }
            } else {
                if (u0 < u1) {
                    edge.u.set(u0, u1 - PI2);
                }
            }

            let t = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray, undefined, 0, false);
            t.name = "temp";
            this.tempResult = t;
            Global.scene.add(this.tempResult);
        }
    };

    onKeyDown = (event: KeyboardEvent) => {
        switch (event.code) {
            case "ShiftLeft":
                this.isForward = false;
                break;
        }
    }
    onKeyUp = (event: KeyboardEvent) => {
        switch (event.code) {
            case "ShiftLeft":
                this.isForward = true;
                break;
        }
    }
    override bind(window: Window) {
        super.bind(window);
        window.addEventListener("keydown", this.onKeyDown);
        window.addEventListener("keyup", this.onKeyUp);
    }
    override unbind(window: Window) {
        super.unbind(window);
        window.removeEventListener("keydown", this.onKeyDown);
        window.removeEventListener("keyup", this.onKeyUp);
    }
}
export { ModifyEllipseArc2Com };