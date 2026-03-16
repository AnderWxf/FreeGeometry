import { Global } from "../../../core/Global";
import { Edge2 } from "../../../geometry/data/brep/Brep2";
import { Matrix3, Vector2, type Matrix4 } from "../../../math/Math";
import { BrepMeshBuilder } from "../../MeshBuilder";
import { ActionContext3D } from "../Active";
import { ActPickObject } from "../acts/ActPickObject";
import { ActPickPoint2 } from "../acts/ActPickPoint2";
import * as THREE from "three";
import { ComBatch } from "./ComBatch";
import { Brep2Builder } from "../../../geometry/algorithm/builder/Brep2Builder";
import type { Transform2 } from "../../../geometry/data/base/Transform2";

/**
 * Transform command class.
 * 
 */
class ComTransform extends ComBatch {
    beginPoint: Vector2;
    endPoint: Vector2;
    override async exec(): Promise<void> {

        let str = this._text;
        let paras = str.split(' ');
        if (paras.length == 5) {
            // 创建一个直线段
            this.beginPoint = new Vector2(new Number(paras[1]).valueOf(), new Number(paras[2]).valueOf());
            this.endPoint = new Vector2(new Number(paras[3]).valueOf(), new Number(paras[4]).valueOf());
        } else {
            this.bind(window);
            let context: ActionContext3D = new ActionContext3D(Global.scene, Global.camera, Global.renderer, Global.select);

            if (context.select.selectedObjects.length == 0) {
                let act_pick_data = new ActPickObject();
                await act_pick_data.execute(context);
                if (this._isCancel) { this.cancel(); return; }
                while (!act_pick_data.result.userData) {
                    await act_pick_data.execute(context);
                    if (this._isCancel) { this.cancel(); return; }
                }
                this.olds.push(act_pick_data.result);
            } else {
                this.olds.push(...context.select.selectedObjects);
            }
            let act_pick_begin = new ActPickPoint2();
            await act_pick_begin.execute(context);
            if (this._isCancel) { this.cancel(); return; }

            this.beginPoint = new Vector2(act_pick_begin.result.x, act_pick_begin.result.y);


            let act_pick_end = new ActPickPoint2();
            await act_pick_end.execute(context);
            if (this._isCancel) { this.cancel(); return; }
            this.endPoint = new Vector2(act_pick_end.result.x, act_pick_end.result.y);


            this._text = paras[0] + ' ' + this.beginPoint.x + ' ' + this.beginPoint.y + ' ' + this.endPoint.x + ' ' + this.endPoint.y;
        }
        let trans = this.makeTransfrom(this.beginPoint, this.endPoint);
        // 创建n个线段
        for (let i = 0; i < this.olds.length; i++) {
            let old = this.olds[i];
            // 创建一个线段
            if (old.userData.original instanceof Edge2) {
                let edge = (old.userData.original as Edge2).clone();
                this.appTransfrom(edge.curve.trans, trans);
                let geo = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.red);
                geo.userData.type = old.userData.type;
                for (let i = 0; i < old.children.length; i++) {
                    let child = old.children[i];
                    let p = new Vector2(child.position.x, child.position.y);
                    p.applyMatrix3(trans);
                    geo.children.push(this.createAssistPoint(p, child.userData.color));
                }
                this.results.push(geo);
            }
        }
        this.done();
    }
    // 计算变换矩阵
    makeTransfrom(a: Vector2, b: Vector2): Matrix3 {
        debugger;
        return new Matrix3();
    }
    // 应用变换矩阵
    appTransfrom(trans: Transform2, m: Matrix3): Matrix3 {
        let lm = trans.makeLocalMatrix();
        lm.premultiply(m);
        trans.fromLocalMatrix(lm);
        return m;
    }
    override onMouseMoveExec(event: MouseEvent) {
        if (this._isCancel) { this.cancel(); return; }
        if (this.beginPoint && !this.endPoint) {
            if (this.tempResults) {
                Global.scene.remove(...this.tempResults);
                this.tempResults = [];
            }
            let endPoint: Vector2 = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);

            let trans = this.makeTransfrom(this.beginPoint, endPoint);
            for (let i = 0; i < this.olds.length; i++) {
                let old = this.olds[i];
                // 创建一个线段
                if (old.userData.original instanceof Edge2) {
                    let edge = (old.userData.original as Edge2).clone();
                    this.appTransfrom(edge.curve.trans, trans);
                    let t = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray, undefined, 0, false);
                    t.name = "temp";
                    this.tempResults.push(t);
                }
            }

            // 创建一个临时直线段
            let edge = Brep2Builder.BuildLineEdge2FromBeginEndPoint(this.beginPoint, endPoint);
            let t = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray, undefined, 0, false);
            t.name = "temp";
            this.tempResults.push(t);
            Global.scene.add(...this.tempResults);
        }
    };
}
export { ComTransform };