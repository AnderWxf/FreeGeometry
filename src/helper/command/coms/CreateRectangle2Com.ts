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
class CreateRectangle2Com extends ComCreate {
    beginPoint: Vector2;
    endPoint: Vector2;
    constructor(executer: CommandExecuter, text: string) {
        super(executer, text);
    }
    async exec(): Promise<void> {
        let str = this._text;
        let paras = str.split(' ');
        if (paras.length == 5) {
            // 创建一个多段线
            this.beginPoint = new Vector2(new Number(paras[1]).valueOf(), new Number(paras[2]).valueOf());
            this.endPoint = new Vector2(new Number(paras[3]).valueOf(), new Number(paras[4]).valueOf());
        } else {
            this.bind(window);
            let context: ActionContext3D = new ActionContext3D(Global.scene, Global.camera, Global.renderer, Global.select);

            let act_pick_begin = new ActPickPoint2();
            await act_pick_begin.execute(context);
            if (this._isCancel) { this.cancel(); return; }
            this.beginPoint = new Vector2(act_pick_begin.result.x, act_pick_begin.result.y);
            this.assists.push(this.createAssistPoint(this.beginPoint, THREE.Color.NAMES.greenyellow));
            Global.scene.add(this.assists[this.assists.length - 1]);

            let act_pick_end = new ActPickPoint2();
            await act_pick_end.execute(context);
            if (this._isCancel) { this.cancel(); return; }
            this.endPoint = new Vector2(act_pick_end.result.x, act_pick_end.result.y);
            this.assists.push(this.createAssistPoint(this.endPoint));
            this._text = paras[0] + ' ' + this.beginPoint.x + ' ' + this.beginPoint.y + ' ' + this.endPoint.x + ' ' + this.endPoint.y;
        }
        // 创建一个多段线
        let points: Vector2[] = [];
        let edges: Edge2[] = [];
        let p0 = this.beginPoint.clone();
        let p1 = this.beginPoint.clone().add(new Vector2(this.endPoint.x - this.beginPoint.x, 0));
        let p2 = this.endPoint.clone();
        let p3 = this.endPoint.clone().add(new Vector2(this.beginPoint.x - this.endPoint.x, 0));
        points.push(p0);
        points.push(p1);
        points.push(p2);
        points.push(p3);

        for (let i = 1; i < points.length; i++) {
            let beginPoint = points[i - 1];
            let endPoint = points[i];
            let edge = Brep2Builder.BuildLineEdge2FromBeginEndPoint(beginPoint, endPoint);
            edges.push(edge);
        }
        let edge = Brep2Builder.BuildLineEdge2FromBeginEndPoint(points[points.length - 1], points[0]);
        edges.push(edge);

        let geo = BrepMeshBuilder.BuildEdge2sMesh(edges, THREE.Color.NAMES.red);
        geo.userData.type = Curve2Type.REC;
        this.result = geo;
        this.done();
    }
    onMouseMoveExec(event: MouseEvent) {
        if (this._isCancel) { this.cancel(); return; }
        if (this.beginPoint && !this.endPoint) {
            if (this.tempResult) {
                Global.scene.remove(this.tempResult);
            }
            this.tempResult = new THREE.Object3D();
            // 创建一个临时多段线
            let endPoint: Vector2 = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);

            let points: Vector2[] = [];
            let edges: Edge2[] = [];
            let p0 = this.beginPoint.clone();
            let p1 = this.beginPoint.clone().add(new Vector2(endPoint.x - this.beginPoint.x, 0));
            let p2 = endPoint.clone();
            let p3 = endPoint.clone().add(new Vector2(this.beginPoint.x - endPoint.x, 0));
            points.push(p0);
            points.push(p1);
            points.push(p2);
            points.push(p3);

            for (let i = 1; i < points.length; i++) {
                let beginPoint = points[i - 1];
                let endPoint = points[i];
                let edge = Brep2Builder.BuildLineEdge2FromBeginEndPoint(beginPoint, endPoint);
                edges.push(edge);
            }
            let edge = Brep2Builder.BuildLineEdge2FromBeginEndPoint(points[points.length - 1], points[0]);
            edges.push(edge);

            let geo = BrepMeshBuilder.BuildEdge2sMesh(edges, THREE.Color.NAMES.gray, undefined, 0, false);
            this.tempResult.children.push(geo);
            Global.scene.add(this.tempResult);
        }
    };
}
export { CreateRectangle2Com };