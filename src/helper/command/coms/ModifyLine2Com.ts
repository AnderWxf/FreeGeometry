import * as THREE from "three";
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
import { ActPickAssist } from "../acts/ActPickAssist";
import { Edge2 } from "../../../geometry/data/brep/Brep2";
import { Line2Data } from "../../../geometry/data/base/curve2/Line2Data";

/**
 * Create command class.
 * 
 */
class ModifyLine2Com extends ComModify {
    private assistIndex = -1;
    constructor(executer: CommandExecuter, text: string) {
        super(executer, text);
    }

    async exec(): Promise<void> {
        Global.select.isEditor = false;
        let str = this._text;
        let paras = str.split(' ');
        let beginPoint: Vector2;
        let endPoint: Vector2;
        if (paras.length == 5) {
            // 创建一个直线段
            beginPoint = new Vector2(new Number(paras[1]).valueOf(), new Number(paras[2]).valueOf());
            endPoint = new Vector2(new Number(paras[3]).valueOf(), new Number(paras[4]).valueOf());
        } else {
            this.bind(window);
            let context: ActionContext3D = new ActionContext3D(Global.scene, Global.camera, Global.renderer, Global.select);

            let act_pick_data = new ActPickObject();
            await act_pick_data.execute(context);
            if (this._isCancel) { this.cancel(); return; }
            while (!act_pick_data.result.userData
                || !act_pick_data.result.userData.original
                || !(act_pick_data.result.userData.original instanceof Edge2)
                || !(act_pick_data.result.userData.original.curve instanceof Line2Data)
            ) {
                await act_pick_data.execute(context);
                if (this._isCancel) { this.cancel(); return; }
            }
            this.old = act_pick_data.result;

            Global.select.isEditor = true;
            let getIndex = (pick: THREE.Object3D): number => {
                for (let i = 0; i < this.old.children.length; i++) {
                    if (pick.position.equals(this.old.children[i].position)) {
                        return i;
                    }
                }
                return -1;
            }
            let act_pick_assist = new ActPickAssist();
            await act_pick_assist.execute(context);
            this.assistIndex = getIndex(act_pick_assist.result);
            while (!act_pick_assist.result.userData.isAssist || this.assistIndex < 0) {
                await act_pick_assist.execute(context);
                this.assistIndex = getIndex(act_pick_assist.result);
                if (this._isCancel) { this.cancel(); return; }
            }

            let act_pick_new_pos = new ActPickPoint2();
            await act_pick_new_pos.execute(context);
            if (this._isCancel) { this.cancel(); return; }

            beginPoint = new Vector2(this.old.children[0].position.x, this.old.children[0].position.y);
            endPoint = new Vector2(this.old.children[1].position.x, this.old.children[1].position.y);

            if (this.assistIndex == 0) {
                beginPoint.x = act_pick_new_pos.result.x;
                beginPoint.y = act_pick_new_pos.result.y;
            }
            if (this.assistIndex == 1) {
                endPoint.x = act_pick_new_pos.result.x;
                endPoint.y = act_pick_new_pos.result.y;
            }
            this.assists[0] = this.createAssistPoint(beginPoint);
            this.assists[1] = this.createAssistPoint(endPoint);

            this._text = 'L' + ' ' + beginPoint.x + ' ' + beginPoint.y + ' ' + endPoint.x + ' ' + endPoint.y;
        }
        // 创建一个直线段
        let edge = this.data = Brep2Builder.BuildLineEdge2FromBeginEndPoint(beginPoint, endPoint);
        let geo = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.red);
        geo.name = "Line2";
        geo.frustumCulled = false;
        this.result = geo;
        Global.scene.add(this.result);
        Global.scene.remove(this.old);
        this.done();
    }
    onMouseMove = (event: MouseEvent) => {
        if (this._isCancel) { this.cancel(); return; }
        if (this.assistIndex > -1) {
            if (this.tempResult) {
                Global.scene.remove(this.tempResult);
            }

            let beginPoint = new Vector2(this.old.children[0].position.x, this.old.children[0].position.y);
            let endPoint = new Vector2(this.old.children[1].position.x, this.old.children[1].position.y);

            if (this.assistIndex == 0) {
                beginPoint = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
            }
            if (this.assistIndex == 1) {
                endPoint = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
            }

            // 创建一个临时直线段
            let edge = Brep2Builder.BuildLineEdge2FromBeginEndPoint(beginPoint, endPoint);
            let t = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray);
            t.name = "temp";
            t.frustumCulled = false;
            this.tempResult = t;
            Global.scene.add(this.tempResult);
        }
    };

}
export { ModifyLine2Com };