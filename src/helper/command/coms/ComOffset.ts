import { Global } from "../../../core/Global";
import { Brep2Builder } from "../../../geometry/algorithm/builder/Brep2Builder";
import { Edge2 } from "../../../geometry/data/brep/Brep2";
import type { DataBase } from "../../../geometry/data/DataBase";
import { Matrix3, Vector2 } from "../../../math/Math";
import { BrepMeshBuilder } from "../../MeshBuilder";
import { ActionContext3D } from "../Active";
import { ActPickObject } from "../acts/ActPickObject";
import { ActPickPoint2 } from "../acts/ActPickPoint2";
import { Command } from "../Command";
import type { CommandExecuter } from "../CommandExecuter";
import * as THREE from "three";

/**
 * Offset command class.
 * 
 */
class ComOffset extends Command {
    protected old: THREE.Object3D;
    protected data: DataBase;
    protected result: THREE.Object3D;
    protected tempResult: THREE.Object3D;
    beginPoint: Vector2;
    endPoint: Vector2;
    constructor(executer: CommandExecuter, text: string) {
        super(executer, text);
    }

    async exec(): Promise<void> {
        Global.select.isEditor = false;
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
                this.old = act_pick_data.result;
            } else {
                this.old = context.select.selectedObjects[0];
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
        let offset = new Vector2().subVectors(this.endPoint, this.beginPoint);
        // 创建一个线段
        if (this.old.userData.original instanceof Edge2) {
            let edge = this.data = (this.old.userData.original as Edge2).clone();
            edge.curve.trans.pos.add(offset);
            let geo = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.red);
            geo.userData.type = this.old.userData.type;
            for (let i = 0; i < this.old.children.length; i++) {
                let child = this.old.children[i];
                let p = new Vector2(child.position.x, child.position.y);
                p.add(offset);
                geo.children.push(this.createAssistPoint(p));
            }
            this.result = geo;
        }

        this.done();
    }
    onMouseMove = (event: MouseEvent) => {
        if (this._isCancel) { this.cancel(); return; }
        if (this.beginPoint && !this.endPoint) {
            if (this.tempResult) {
                Global.scene.remove(this.tempResult);
            }
            let endPoint: Vector2 = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);

            let offset = new Vector2().subVectors(endPoint, this.beginPoint);
            // 创建一个线段
            if (this.old.userData.original instanceof Edge2) {
                let edge = this.data = (this.old.userData.original as Edge2).clone();
                edge.curve.trans.pos.add(offset);
                let t = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray);
                t.name = "temp";
                t.frustumCulled = false;
                this.tempResult = t;
            }
            // 创建一个临时直线段
            let edge2 = Brep2Builder.BuildLineEdge2FromBeginEndPoint(this.beginPoint, endPoint);
            let t2 = BrepMeshBuilder.BuildEdge2Mesh(edge2, THREE.Color.NAMES.gray);

            this.tempResult.children.push(t2);
            Global.scene.add(this.tempResult);

        }
    };

    protected cancel() {
        this.unbind(window);
        if (this.tempResult) {
            Global.scene.remove(this.tempResult);
        }
        Global.select.isEditor = false;
    }

    override done() {
        super.done();
        this.unbind(window);
        Global.scene.add(this.result);
        // Global.scene.remove(this.old);
        if (this.tempResult) {
            Global.scene.remove(this.tempResult);
        }
        Global.select.isEditor = false;
    }
    override bind(window: Window) {
        super.bind(window);
        window.addEventListener("mousemove", this.onMouseMove);
    }
    override unbind(window: Window) {
        super.unbind(window);
        window.removeEventListener("mousemove", this.onMouseMove);
    }
    override undo() {
        if (this._isDone) {
            Global.scene.remove(this.result);
            // Global.scene.add(this.old);
        }
    }
    override redo() {
        if (this._isDone) {
            Global.scene.add(this.result);
            // Global.scene.remove(this.old);
        }
    }
}
export { ComOffset };