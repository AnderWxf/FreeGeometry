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
import type { Edge2 } from "../../../../geometry/data/brep/Brep2";
import { CreateGeomUserData, type UserData } from "../../../UserData";


/**
 * Create command class.
 * 命令类型 n p[0].x p[0].y p[1].x p[1].y p[2].x p[2].y ... uuid0 uuid1 uuid2...
 */
class CreatePolyline2Com extends ComCreate {
  points: Vector2[];
  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
    this.points = [];
    this.type = GeomType.DRAW_CURVE2_PO;
  }
  async exec(): Promise<void> {
    let str = this._text;
    let paras = str.split(' ');
    let userData = CreateGeomUserData(this.type);

    if (paras.length >= 6) {
      // 获取n个点
      let n = new Number(paras[1]).valueOf();
      for (let i = 1; i < (n + 1) * 2; i++) {
        let point = new Vector2(new Number(paras[i]).valueOf(), new Number(paras[i++]).valueOf());
        this.points.push(point);
        userData.assistPoints.push({ p: point, c: THREE.Color.NAMES.greenyellow });
        this.assists.push(this.createAssistPoint(userData.assistPoints[userData.assistPoints.length - 1]));
        Global.scene.add(this.assists[this.assists.length - 1]);        
      }
    } else {
      this.bind(window);
      let context: ActionContext3D = new ActionContext3D(Global.scene.scene, Global.camera, Global.renderer, Global.select);

      while (!this.isDone && !this.isCancel) {
        let act_pick_begin = new ActPickPoint2();
        await act_pick_begin.execute(context);
        if (this._isCancel) { this.cancel(); return; }
        if (this.isDone) { break; }
        let point = new Vector2(act_pick_begin.result.x, act_pick_begin.result.y);
        this.points.push(point);
        userData.assistPoints.push({ p: point, c: THREE.Color.NAMES.greenyellow });
        this.assists.push(this.createAssistPoint(userData.assistPoints[userData.assistPoints.length - 1]));
        Global.scene.add(this.assists[this.assists.length - 1]);
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
    if (paras.length > 6) {
      let n = new Number(paras[1]).valueOf();
      for (let i = 0; i < n - 1; i++) {
        let uuid = paras[2 + n * 2 + i];
        edges[i].uuid = uuid;
      }
    }
    userData.original = edges;
    geo.userData = userData;
    this.results = geo;
    let n = this.points.length
    this._text = paras[0] + ' ' + n;
    for (let i = 1; i < this.points.length; i++) {
      let point = this.points[i];
      this._text += ' ' + point.x + ' ' + point.y;
    }
    for (let i = 0; i < edges.length; i++) {
      this._text += ' ' + edges[i].uuid
    }

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
        let geo = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray, undefined, 0);
        this.tempResult.children.push(geo);
      }
      let beginPoint = this.points[this.points.length - 1];
      let endPoint: Vector2 = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
      // 创建一个临时直线段
      let edge = Brep2Builder.BuildLineEdge2FromBeginEndPoint(beginPoint, endPoint);
      let geo = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray, undefined, 0);
      this.tempResult.children.push(geo);
      Global.scene.add(this.tempResult);
    }
  };

  override onKeyDownExec(event: KeyboardEvent) {
    super.onKeyDownExec(event);
    switch (event.code) {
      case "Enter":
      case "NumpadEnter":
        this._isDone = true;
        break;
    }
  }

}
export { CreatePolyline2Com };