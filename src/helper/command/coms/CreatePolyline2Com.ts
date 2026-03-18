import * as THREE from "three";
import { ComCreate } from "./ComCreate";
import { ActionContext3D } from "../Active";
import { Global } from "../../../core/Global";
import { ActPickPoint2 } from "../acts/ActPickPoint2";
import { Brep2Builder } from "../../../geometry/algorithm/builder/Brep2Builder";
import { Vector2 } from "../../../math/Math";
import { BrepMeshBuilder } from "../../MeshBuilder";
import type { CommandExecuter } from "../CommandExecuter";
import { Curve2Type } from "../../../core/Constents";
import type { Edge2 } from "../../../geometry/data/brep/Brep2";


/**
 * Create command class.
 * 
 */
class CreatePolyline2Com extends ComCreate {
    points: Vector2[];
    constructor(executer: CommandExecuter, text: string) {
        super(executer, text);
        this.points = [];
    }
    async exec(): Promise<void> {
        let str = this._text;
        let paras = str.split(' ');
        if (paras.length > 5) {
            // 创建一个多段线
            for (let i = 1; i < paras.length; i++) {
                let point = new Vector2(new Number(paras[i]).valueOf(), new Number(paras[i + 1]).valueOf());
                this.points.push(point);
            }
        } else {
            this.bind(window);
            let context: ActionContext3D = new ActionContext3D(Global.scene, Global.camera, Global.renderer, Global.select);

            while (!this.isDone && !this.isCancel) {
                let act_pick_begin = new ActPickPoint2();
                await act_pick_begin.execute(context);
                if (this._isCancel) { this.cancel(); return; }
                if (this.isDone) { break; }
                let point = new Vector2(act_pick_begin.result.x, act_pick_begin.result.y);
                this.points.push(point);
                this.assists.push(this.createAssistPoint(point, THREE.Color.NAMES.greenyellow));
                Global.scene.add(this.assists[this.assists.length - 1]);
            }
            this._text = paras[0];
            for (let i = 1; i < this.points.length; i++) {
                let point = this.points[i];
                this._text += ' ' + point.x + ' ' + point.y;
            }
        }
        // 创建一个多段线
        let edges: Edge2[] = [];
        for (let i = 1; i < this.points.length; i++) {
            let beginPoint = this.points[i - 1];
            let endPoint = this.points[i];
            let edge = Brep2Builder.BuildLineEdge2FromBeginEndPoint(beginPoint, endPoint);
            edges.push(edge);
        }
        let geo = BrepMeshBuilder.BuildEdge2sMesh(edges, THREE.Color.NAMES.red);
        geo.userData.type = Curve2Type.PL;
        this.result = geo;
        this.done();
    }
    onMouseMoveExec(event: MouseEvent) {
        if (this._isCancel) { this.cancel(); return; }
        if (this.points.length >= 1) {
            if (this.tempResult) {
                Global.scene.remove(this.tempResult);
            }
            this.tempResult = new THREE.Object3D();
            // 创建一个临时多段线
            for (let i = 1; i < this.points.length; i++) {
                let beginPoint = this.points[i - 1];
                let endPoint = this.points[i];
                let edge = Brep2Builder.BuildLineEdge2FromBeginEndPoint(beginPoint, endPoint);
                let geo = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray, undefined, 0, false);
                this.tempResult.children.push(geo);
            }
            let beginPoint = this.points[this.points.length - 1];
            let endPoint: Vector2 = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
            // 创建一个临时直线段
            let edge = Brep2Builder.BuildLineEdge2FromBeginEndPoint(beginPoint, endPoint);
            let geo = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray, undefined, 0, false);
            this.tempResult.children.push(geo);
            Global.scene.add(this.tempResult);
        }
    };

    override onKeyDownExec(event: KeyboardEvent) {
        super.onKeyDownExec(event);
        switch (event.code) {
            case "Enter":
                this._isDone = true;
                break;
        }
    }
}
export { CreatePolyline2Com };