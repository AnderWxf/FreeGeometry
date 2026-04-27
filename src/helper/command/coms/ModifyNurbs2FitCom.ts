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
class ModifyNurbs2FitCom extends ComModify {
    constructor(executer: CommandExecuter, text: string) {
        super(executer, text);
    }
    async exec(): Promise<void> {
        let str = this._text;
        let paras = str.split(' ');
        let points: Vector2[] = [];
        if (paras.length > 5) {
            // 创建一个多段线
            for (let i = 1; i < paras.length; i++) {
                let point = new Vector2(new Number(paras[i]).valueOf(), new Number(paras[i + 1]).valueOf());
                points.push(point);
            }
        } else {
            this.bind(window);
            let context: ActionContext3D = new ActionContext3D(Global.scene, Global.camera, Global.renderer, Global.select);

            let act_pick_data = new ActPickObject();
            await act_pick_data.execute(context);
            if (this._isCancel) { this.cancel(); return; }
            while (!act_pick_data.result.userData
                || act_pick_data.result.userData.type != Curve2Type.NUF
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

            for (let i = 0; i < this.old.children.length; i++) {
                let point = new Vector2(this.old.children[i].position.x, this.old.children[i].position.y);
                points.push(point);
            }
            points[this.assistIndex] = act_pick_new_pos.result;
        }

        this._text = paras[0];
        for (let i = 1; i < points.length; i++) {
            let point = points[i];
            this._text += ' ' + point.x + ' ' + point.y;
        }

        // 创建一个曲线段
        if (points.length > 2) {
            for (let i = 0; i < points.length; i++) {
                let point = points[i];
                this.assists.push(this.createAssistPoint(point, THREE.Color.NAMES.greenyellow));
            }

            let edge = Brep2Builder.BuildEdge2FromFittingPoints(points, points.length == 3 ? 2 : 3);
            let geo = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.red);
            geo.userData.type = Curve2Type.NUF;
            this.result = geo;
            this.done();
        } else {
            this.cancel();
        }
    }
    onMouseMoveExec(event: MouseEvent) {
        if (this._isCancel) { this.cancel(); return; }
        if (this.assistIndex > -1) {
            if (this.tempResult) {
                Global.scene.remove(this.tempResult);
            }
            let points: Vector2[] = [];
            for (let i = 0; i < this.old.children.length; i++) {
                let point = new Vector2(this.old.children[i].position.x, this.old.children[i].position.y);
                points.push(point);
            }
            points[this.assistIndex] = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);

            // 创建一个临时曲线段
            if (points.length > 2) {
                let edge_fit = Brep2Builder.BuildEdge2FromFittingPoints(points, points.length == 3 ? 2 : 3);
                let geo_fit = BrepMeshBuilder.BuildEdge2Mesh(edge_fit, THREE.Color.NAMES.gray, undefined, 0, false);
                geo_fit.name = "temp";
                this.tempResult = geo_fit;
                Global.scene.add(this.tempResult);
            }
        }
    };
}
export { ModifyNurbs2FitCom };