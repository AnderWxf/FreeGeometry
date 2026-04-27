import * as THREE from "three";
import { ComCreate } from "../ComCreate";
import { ActionContext3D } from "../../Active";
import { Global } from "../../../../core/Global";
import { ActPickPoint2 } from "../../acts/ActPickPoint2";
import { Brep2Builder } from "../../../../geometry/algorithm/builder/Brep2Builder";
import { Vector2, Vector3 } from "../../../../math/Math";
import { BrepMeshBuilder } from "../../../MeshBuilder";
import type { CommandExecuter } from "../../CommandExecuter";
import { Curve2Type } from "../../../../core/Constents";
import type { Edge2 } from "../../../../geometry/data/brep/Brep2";
import { Nurbs2Data } from "../../../../geometry/data/base/curve2/Nurbs2Data";
import { Transform2 } from "../../../../geometry/data/base/Transform2";


/**
 * Create command class.
 * 
 */
class CreateNurbs2CtrlCom extends ComCreate {
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

        // 创建一个曲线段
        if (this.points.length > 2) {
            let controls = new Array<Vector3>();
            let knots = new Array<number>();
            for (let i = 0; i < this.points.length; i++) {
                controls.push(new Vector3(this.points[i].x, this.points[i].y, 1));
            }
            let degree = this.points.length == 3 ? 2 : 3;
            for (let i = 0; i < degree + 1; i++) {
                knots.push(0);
            }
            for (let i = 1; i < this.points.length - degree; i++) {
                knots.push(i / (this.points.length - degree));
            }
            for (let i = 0; i < degree + 1; i++) {
                knots.push(1);
            }

            let nurbsData = new Nurbs2Data(new Transform2(), controls, knots, degree);
            let edge = Brep2Builder.BuildEdge2FromCurve2(nurbsData, 0, 1);
            let geo = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.red);
            geo.userData.type = Curve2Type.NUC;
            this.result = geo;
            this.done();
        } else {
            this.cancel();
        }
    }
    onMouseMoveExec(event: MouseEvent) {
        if (this._isCancel) { this.cancel(); return; }
        if (this.points.length >= 1) {
            if (this.tempResult) {
                Global.scene.remove(this.tempResult);
            }
            this.tempResult = new THREE.Object3D();
            // 创建一个临时多段线
            let edges: Edge2[] = [];
            for (let i = 1; i < this.points.length; i++) {
                let beginPoint = this.points[i - 1];
                let endPoint = this.points[i];
                let edge = Brep2Builder.BuildLineEdge2FromBeginEndPoint(beginPoint, endPoint);
                edges.push(edge);
            }
            let beginPoint = this.points[this.points.length - 1];
            let endPoint: Vector2 = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
            // 创建一个临时直线段
            let edge = Brep2Builder.BuildLineEdge2FromBeginEndPoint(beginPoint, endPoint);
            edges.push(edge);
            let geo = BrepMeshBuilder.BuildEdge2sMesh(edges, THREE.Color.NAMES.gray, undefined, 0, false);
            this.tempResult.children.push(geo);
            // 创建一个临时曲线段
            let points: Vector2[] = [];
            points.push(...this.points);
            points.push(endPoint);
            if (points.length > 2) {
                let controls = new Array<Vector3>();
                let knots = new Array<number>();
                for (let i = 0; i < points.length; i++) {
                    controls.push(new Vector3(points[i].x, points[i].y, 1));
                }
                let degree = points.length == 3 ? 2 : 3;
                for (let i = 0; i < degree + 1; i++) {
                    knots.push(0);
                }
                for (let i = 1; i < points.length - degree; i++) {
                    knots.push(i / (points.length - degree));
                }
                for (let i = 0; i < degree + 1; i++) {
                    knots.push(1);
                }

                let nurbsData = new Nurbs2Data(new Transform2(), controls, knots, degree);
                let edge_ctrl = Brep2Builder.BuildEdge2FromCurve2(nurbsData, 0, 1);
                let geo_ctrl = BrepMeshBuilder.BuildEdge2Mesh(edge_ctrl, THREE.Color.NAMES.gray, undefined, 0, false);
                this.tempResult.children.push(geo_ctrl);
            }
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
export { CreateNurbs2CtrlCom };