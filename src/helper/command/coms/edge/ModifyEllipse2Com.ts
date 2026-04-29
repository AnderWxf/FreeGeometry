import * as THREE from "three";
import { Command } from "../../Command";
import { ComCreate } from "../ComCreate";
import { ActionContext3D } from "../../Active";
import { Global } from "../../../../core/Global";
import { ActPickPoint2 } from "../../acts/ActPickPoint2";
import { Brep2Builder } from "../../../../geometry/algorithm/builder/Brep2Builder";
import { Vector2 } from "../../../../math/Math";
import { BrepMeshBuilder } from "../../../BrepMeshBuilder";
import type { CommandExecuter } from "../../CommandExecuter";
import { ComModify } from "../ComModify";
import { ActPickObject } from "../../acts/ActPickObject";
import { Edge2 } from "../../../../geometry/data/brep/Brep2";
import { Arc2Data } from "../../../../geometry/data/base/curve2/Arc2Data";
import { GeomType } from "../../../../core/Constents";
import { ActPickAssist } from "../../acts/ActPickAssist";
import { CloneUserData, CopyUserData, CreateGeomUserData, type UserData } from "../../../UserData";


/**
 * Modify command class.
 * 
 */
class ModifyEllipse2Com extends ComModify {
    constructor(executer: CommandExecuter, text: string) {
        super(executer, text);
        this.type = GeomType.E;
    }
    async exec(): Promise<void> {
        let str = this._text;
        let paras = str.split(' ');
        let userData = CreateGeomUserData(this.type);

        let centerPoint: Vector2;
        let majorPoint: Vector2;
        let minorPoint: Vector2;
        if (paras.length == 7) {
            // 创建一个线段
            centerPoint = new Vector2(new Number(paras[1]).valueOf(), new Number(paras[2]).valueOf());
            majorPoint = new Vector2(new Number(paras[3]).valueOf(), new Number(paras[4]).valueOf());
            minorPoint = new Vector2(new Number(paras[5]).valueOf(), new Number(paras[6]).valueOf());
        } else {
            this.bind(window);
            let context: ActionContext3D = new ActionContext3D(Global.scene, Global.camera, Global.renderer, Global.select);

            let act_pick_data = new ActPickObject();
            await act_pick_data.execute(context);
            if (this._isCancel) { this.cancel(); return; }
            while (!act_pick_data.result.userData
                || act_pick_data.result.userData.type != this.type
            ) {
                await act_pick_data.execute(context);
                if (this._isCancel) { this.cancel(); return; }
            }
            this.old = act_pick_data.result;
            CopyUserData(this.old.userData as UserData, userData);

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

            centerPoint = userData.assistPoints[0].p as Vector2;
            majorPoint = userData.assistPoints[1].p as Vector2;
            minorPoint = userData.assistPoints[2].p as Vector2;

            userData.assistPoints[this.assistIndex].p.set(act_pick_new_pos.result.x, act_pick_new_pos.result.y);
        }
        // 创建一个曲线段
        let edge = Brep2Builder.BuildEllipseEdge2FromCenterBeginEndPoint(centerPoint, majorPoint, minorPoint);
        let geo = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.red);
        userData.original = edge;
        geo.userData = userData;
        this.result = geo;

        this._text = paras[0] + ' ' + centerPoint.x + ' ' + centerPoint.y + ' ' + majorPoint.x + ' ' + majorPoint.y + ' ' + minorPoint.x + ' ' + minorPoint.y;

        this.done();
    }
    onMouseMoveExec(event: MouseEvent) {
        if (this._isCancel) { this.cancel(); return; }
        if (this.assistIndex > -1) {
            if (this.tempResult) {
                Global.scene.remove(this.tempResult);
            }
            let userData = CloneUserData(this.old.userData as UserData);

            let centerPoint = userData.assistPoints[0].p as Vector2;
            let majorPoint = userData.assistPoints[1].p as Vector2;
            let minorPoint = userData.assistPoints[2].p as Vector2;

            userData.assistPoints[this.assistIndex].p = Global.select.overedPoint
                ? userData.assistPoints[this.assistIndex].p.set(Global.select.overedPoint.x, Global.select.overedPoint.y)
                : userData.assistPoints[this.assistIndex].p.set(0, 0);

            // 创建一个临时曲线段
            let edge = Brep2Builder.BuildEllipseEdge2FromCenterBeginEndPoint(centerPoint, majorPoint, minorPoint);
            let t = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray, undefined, 0, false);
            t.name = "temp";
            this.tempResult = t;
            Global.scene.add(this.tempResult);
        }
    };
}
export { ModifyEllipse2Com };