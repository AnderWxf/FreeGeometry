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
import { GeomType } from "../../../../core/Constents";
import { ComModify } from "../ComModify";
import { ActPickAssist } from "../../acts/ActPickAssist";
import { ActPickObject } from "../../acts/ActPickObject";
import { CloneUserData, CopyUserData, CreateGeomUserData, type UserData } from "../../../UserData";
import { PI2 } from "../../../../math/MathUtils";


/**
 * Modify command class.
 * 
 */
class ModifyArc2Com extends ComModify {
    private isForward: boolean = true;
    constructor(executer: CommandExecuter, text: string) {
        super(executer, text);
        this.type = GeomType.A;
    }
    async exec(): Promise<void> {
        let str = this._text;
        let paras = str.split(' ');
        let userData = CreateGeomUserData(this.type);

        let centerPoint: Vector2;
        let beginPoint: Vector2;
        let endPoint: Vector2;
        if (paras.length == 7) {
            // 创建一个线段
            centerPoint = new Vector2(new Number(paras[1]).valueOf(), new Number(paras[2]).valueOf());
            beginPoint = new Vector2(new Number(paras[3]).valueOf(), new Number(paras[4]).valueOf());
            endPoint = new Vector2(new Number(paras[5]).valueOf(), new Number(paras[6]).valueOf());
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
            beginPoint = userData.assistPoints[1].p as Vector2;
            endPoint = userData.assistPoints[2].p as Vector2;

            userData.assistPoints[this.assistIndex].p.set(act_pick_new_pos.result.x, act_pick_new_pos.result.y);
        }
        // 创建一个曲线段
        let edge = Brep2Builder.BuildCircleArcEdge2FromCenterBeginEndPoin(centerPoint, beginPoint, endPoint);
        edge.u.y = this.isForward ? edge.u.y : edge.u.y - PI2;
        let geo = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.red);
        userData.original = edge;
        geo.userData = userData;
        this.result = geo;

        this._text = paras[0] + ' ' + centerPoint.x + ' ' + centerPoint.y + ' ' + beginPoint.x + ' ' + beginPoint.y + ' ' + endPoint.x + ' ' + endPoint.y;
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
            let beginPoint = userData.assistPoints[1].p as Vector2;
            let endPoint = userData.assistPoints[2].p as Vector2;

            userData.assistPoints[this.assistIndex].p = Global.select.overedPoint
                ? userData.assistPoints[this.assistIndex].p.set(Global.select.overedPoint.x, Global.select.overedPoint.y)
                : userData.assistPoints[this.assistIndex].p.set(0, 0);

            // 创建一个临时曲线段
            let edge = Brep2Builder.BuildCircleArcEdge2FromCenterBeginEndPoin(centerPoint, beginPoint, endPoint);
            edge.u.y = this.isForward ? edge.u.y : edge.u.y - PI2;
            let t = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray);
            t.name = "temp";
            this.tempResult = t;
            Global.scene.add(this.tempResult);
        }
    };

    onKeyDown = (event: KeyboardEvent) => {
        super.onKeyDownExec(event);
        switch (event.code) {
            case "ShiftLeft":
                this.isForward = false;
                break;
        }
    }
    onKeyUp = (event: KeyboardEvent) => {
        super.onKeyUpExec(event);
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
export { ModifyArc2Com };