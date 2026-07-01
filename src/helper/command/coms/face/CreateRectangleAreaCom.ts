import * as THREE from "three";
import { ComCreate } from "../ComCreate";
import { ActionContext3D } from "../../Active";
import { Global } from "../../../../core/Global";
import { ActPickPoint2 } from "../../acts/ActPickPoint2";
import { Brep2Builder } from "../../../../geometry/algorithm/builder/Brep2Builder";
import { Vector2 } from "../../../../math/Math";
import { BrepMeshBuilder } from "../../../BrepMeshBuilder";
import type { CommandExecuter } from "../../CommandExecuter";
import { GeomType } from "../../../../core/Constents";
import { Coedge2, Face2, Vertice2, type Edge2 } from "../../../../geometry/data/brep/Brep2";
import { CreateGeomUserData, type UserData } from "../../../UserData";
import { CreateFaceCom } from "./CreateFaceCom";


/**
 * Create command class.
 * 
 */
class CreateRectangleAreaCom extends CreateFaceCom {
  beginPoint: Vector2;
  endPoint: Vector2;
  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
    this.type = GeomType.DRAW_SURFACE_RCT;
  }
  async exec(): Promise<void> {
    let str = this._text;
    let paras = str.split(' ');
    let userData = CreateGeomUserData(this.type);
    if (paras.length == 5) {
      // 创建一个多段线
      this.beginPoint = new Vector2(new Number(paras[1]).valueOf(), new Number(paras[2]).valueOf());
      this.endPoint = new Vector2(new Number(paras[3]).valueOf(), new Number(paras[4]).valueOf());
    } else {
      this.bind(window);
      let context: ActionContext3D = new ActionContext3D(Global.scene.scene, Global.camera, Global.renderer, Global.select);

      let act_pick_begin = new ActPickPoint2();
      await act_pick_begin.execute(context);
      if (this._isCancel || act_pick_begin.isCancel) { this.cancel(); return; }
      this.beginPoint = new Vector2(act_pick_begin.result.x, act_pick_begin.result.y);
      userData.assistPoints.push({ p: this.beginPoint, c: THREE.Color.NAMES.greenyellow });
      this.assists.push(this.createAssistPoint(userData.assistPoints[userData.assistPoints.length - 1]));
      Global.scene.add(this.assists[this.assists.length - 1]);

      let act_pick_end = new ActPickPoint2();
      await act_pick_end.execute(context);
      if (this._isCancel || act_pick_end.isCancel) { this.cancel(); return; }
      this.endPoint = new Vector2(act_pick_end.result.x, act_pick_end.result.y);
      userData.assistPoints.push({ p: this.endPoint, c: THREE.Color.NAMES.darkblue });
      this.assists.push(this.createAssistPoint(userData.assistPoints[userData.assistPoints.length - 1]));
      Global.scene.add(this.assists[this.assists.length - 1]);

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

    // 创建一个面
    let face = Brep2Builder.BuildFaceByEdges(edges);
    userData.color = THREE.Color.NAMES.blue;
    let geo = BrepMeshBuilder.BuildFace2Mesh(face, userData.color);
    userData.original = face;
    geo.userData = userData;
    this.results = geo;
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

      let geo = BrepMeshBuilder.BuildEdge2sMesh(edges, THREE.Color.NAMES.gray, undefined, 0);
      this.tempResult.children.push(geo);
      Global.scene.add(this.tempResult);
    }
  };
}
export { CreateRectangleAreaCom };