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


/**
 * Modify command class.
 * 
 */
class ModifyParabola2Com extends ComModify {
    constructor(executer: CommandExecuter, text: string) {
        super(executer, text);
    }
    async exec(): Promise<void> {
        let str = this._text;
        let paras = str.split(' ');
        let centerPoint: Vector2;
        let focusPoint: Vector2;
        let beginPoint: Vector2;
        if (paras.length == 7) {
            // 创建一个线段
            centerPoint = new Vector2(new Number(paras[1]).valueOf(), new Number(paras[2]).valueOf());
            focusPoint = new Vector2(new Number(paras[3]).valueOf(), new Number(paras[4]).valueOf());
            beginPoint = new Vector2(new Number(paras[5]).valueOf(), new Number(paras[6]).valueOf());
        } else {
            this.bind(window);
            let context: ActionContext3D = new ActionContext3D(Global.scene, Global.camera, Global.renderer, Global.select);

            let act_pick_data = new ActPickObject();
            await act_pick_data.execute(context);
            if (this._isCancel) { this.cancel(); return; }
            while (!act_pick_data.result.userData
                || act_pick_data.result.userData.type != Curve2Type.PA
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
            focusPoint = new Vector2(this.old.children[1].position.x, this.old.children[1].position.y);
            beginPoint = new Vector2(this.old.children[2].position.x, this.old.children[2].position.y);


            if (this.assistIndex == 0) {
                centerPoint.x = act_pick_new_pos.result.x;
                centerPoint.y = act_pick_new_pos.result.y;
            }
            if (this.assistIndex == 1) {
                focusPoint.x = act_pick_new_pos.result.x;
                focusPoint.y = act_pick_new_pos.result.y;
            }
            if (this.assistIndex == 2) {
                beginPoint.x = act_pick_new_pos.result.x;
                beginPoint.y = act_pick_new_pos.result.y;
            }


        }
        // 创建一个曲线段
        let edge = Brep2Builder.BuildParabolaEdge2FromCenterABPoint(centerPoint, focusPoint, beginPoint);
        let geo = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.red);
        geo.userData.type = Curve2Type.PA;
        this.result = geo;
        let alg = CurveBuilder.Algorithm2ByData(edge.curve);
        beginPoint = alg.p(edge.u.x);

        this.assists[0] = this.createAssistPoint(centerPoint, THREE.Color.NAMES.greenyellow);
        this.assists[1] = this.createAssistPoint(focusPoint, THREE.Color.NAMES.limegreen);
        this.assists[2] = this.createAssistPoint(beginPoint);

        this._text = paras[0] + ' ' + centerPoint.x + ' ' + centerPoint.y + ' ' + focusPoint.x + ' ' + focusPoint.y + ' ' + beginPoint.x + ' ' + beginPoint.y;

        this.done();
    }
    onMouseMoveExec(event: MouseEvent) {
        if (this._isCancel) { this.cancel(); return; }
        if (this.assistIndex > -1) {
            if (this.tempResult) {
                Global.scene.remove(this.tempResult);
            }

            let centerPoint = new Vector2(this.old.children[0].position.x, this.old.children[0].position.y);
            let focusPoint = new Vector2(this.old.children[1].position.x, this.old.children[1].position.y);
            let beginPoint = new Vector2(this.old.children[2].position.x, this.old.children[2].position.y);

            if (this.assistIndex == 0) {
                centerPoint = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
            }
            if (this.assistIndex == 1) {
                focusPoint = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
            }
            if (this.assistIndex == 2) {
                beginPoint = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
            }
            // 创建一个临时曲线段
            let edge = Brep2Builder.BuildParabolaEdge2FromCenterABPoint(centerPoint, focusPoint, beginPoint);
            let t = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray, undefined, 0, false);
            t.name = "temp";
            this.tempResult = t;
            Global.scene.add(this.tempResult);
        }
    };
}
export { ModifyParabola2Com };