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

/**
 * Modify command class.
 * 
 */
class ModifyCircle2ThreePointCom extends ComModify {
    constructor(executer: CommandExecuter, text: string) {
        super(executer, text);
    }
    async exec(): Promise<void> {
        let str = this._text;
        let paras = str.split(' ');
        let beginPoint: Vector2;
        let middlePoint: Vector2;
        let endPoint: Vector2;
        if (paras.length == 7) {
            // 创建一个线段
            beginPoint = new Vector2(new Number(paras[1]).valueOf(), new Number(paras[2]).valueOf());
            middlePoint = new Vector2(new Number(paras[3]).valueOf(), new Number(paras[4]).valueOf());
            endPoint = new Vector2(new Number(paras[5]).valueOf(), new Number(paras[6]).valueOf());
        } else {
            this.bind(window);
            let context: ActionContext3D = new ActionContext3D(Global.scene, Global.camera, Global.renderer, Global.select);

            let act_pick_data = new ActPickObject();
            await act_pick_data.execute(context);
            if (this._isCancel) { this.cancel(); return; }
            while (!act_pick_data.result.userData
                || act_pick_data.result.userData.type != Curve2Type.C3
            ) {
                await act_pick_data.execute(context);
                if (this._isCancel) { this.cancel(); return; }
            }
            this.old = act_pick_data.result;

            Global.select.isEditor = true;

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


            beginPoint = new Vector2(this.old.children[0].position.x, this.old.children[0].position.y);
            middlePoint = new Vector2(this.old.children[1].position.x, this.old.children[1].position.y);
            endPoint = new Vector2(this.old.children[2].position.x, this.old.children[2].position.y);


            if (this.assistIndex == 0) {
                beginPoint.x = act_pick_new_pos.result.x;
                beginPoint.y = act_pick_new_pos.result.y;
            }
            if (this.assistIndex == 1) {
                middlePoint.x = act_pick_new_pos.result.x;
                middlePoint.y = act_pick_new_pos.result.y;
            }
            if (this.assistIndex == 2) {
                endPoint.x = act_pick_new_pos.result.x;
                endPoint.y = act_pick_new_pos.result.y;
            }

            this.assists[0] = this.createAssistPoint(beginPoint);
            this.assists[1] = this.createAssistPoint(middlePoint);
            this.assists[2] = this.createAssistPoint(endPoint);

            this._text = 'C3' + ' ' + beginPoint.x + ' ' + beginPoint.y + ' ' + endPoint.x + ' ' + endPoint.y;
        }
        // 创建一个曲线段
        let edge = this.data = Brep2Builder.BuildCircleFromBeginMiddleEndPoint(beginPoint, middlePoint, endPoint);
        let geo = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.red);
        geo.userData.type = Curve2Type.C3;
        this.result = geo;
        this.done();
    }
    onMouseMove = (event: MouseEvent) => {
        if (this._isCancel) { this.cancel(); return; }
        if (this.assistIndex > -1) {
            if (this.tempResult) {
                Global.scene.remove(this.tempResult);
            }

            let beginPoint = new Vector2(this.old.children[0].position.x, this.old.children[0].position.y);
            let middlePoint = new Vector2(this.old.children[1].position.x, this.old.children[1].position.y);
            let endPoint = new Vector2(this.old.children[2].position.x, this.old.children[2].position.y);

            if (this.assistIndex == 0) {
                beginPoint = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
            }
            if (this.assistIndex == 1) {
                middlePoint = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
            }
            if (this.assistIndex == 2) {
                endPoint = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
            }
            // 创建一个临时曲线段
            let edge = Brep2Builder.BuildCircleFromBeginMiddleEndPoint(beginPoint, middlePoint, endPoint);
            let t = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray);
            t.name = "temp";
            t.frustumCulled = false;
            this.tempResult = t;
            Global.scene.add(this.tempResult);
        }
    };
}
export { ModifyCircle2ThreePointCom };