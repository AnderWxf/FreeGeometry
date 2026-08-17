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
import { CurveBuilder } from "../../../../geometry/algorithm/builder/CurveBuilder";
import { CreateGeomUserData, type UserData } from "../../../UserData";


/**
 * Create command class.
 * 格式：命令类型 center.x center.y focus.x focus.y begin.x begin.y uuid
 */
class CreateParabola2Com extends ComCreate {
  center: Vector2;
  focus: Vector2;
  begin: Vector2;
  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
    this.type = GeomType.DRAW_CURVE2_PA;
  }
  async exec(): Promise<void> {
    let str = this._text;
    let paras = str.split(' ');
    let userData = CreateGeomUserData(this.type);
    if (paras.length >= 7) {
      // 创建一个线段
      this.center = new Vector2(new Number(paras[1]).valueOf(), new Number(paras[2]).valueOf());
      this.focus = new Vector2(new Number(paras[3]).valueOf(), new Number(paras[4]).valueOf());
      this.begin = new Vector2(new Number(paras[5]).valueOf(), new Number(paras[6]).valueOf());
    } else {
      this.bind(window);
      let context: ActionContext3D = new ActionContext3D(Global.scene.scene, Global.camera, Global.renderer, Global.select);

      let act_pick_center = new ActPickPoint2();
      await act_pick_center.execute(context);
      if (this._isCancel || act_pick_center.isCancel) { this.cancel(); return; }
      this.center = new Vector2(act_pick_center.result.x, act_pick_center.result.y);
      userData.assistPoints.push({ p: this.center, c: THREE.Color.NAMES.greenyellow });
      this.assists.push(this.createAssistPoint(userData.assistPoints[userData.assistPoints.length - 1]));
      Global.scene.add(this.assists[this.assists.length - 1]);

      let act_pick_begin = new ActPickPoint2();
      await act_pick_begin.execute(context);
      if (this._isCancel || act_pick_begin.isCancel) { this.cancel(); return; }
      this.focus = new Vector2(act_pick_begin.result.x, act_pick_begin.result.y);
      userData.assistPoints.push({ p: this.focus, c: THREE.Color.NAMES.limegreen });
      this.assists.push(this.createAssistPoint(userData.assistPoints[userData.assistPoints.length - 1]));
      Global.scene.add(this.assists[this.assists.length - 1]);

      let act_pick_end = new ActPickPoint2();
      await act_pick_end.execute(context);
      if (this._isCancel || act_pick_end.isCancel) { this.cancel(); return; }
      this.begin = new Vector2(act_pick_end.result.x, act_pick_end.result.y);
    }
    // 创建一个曲线段
    let edge = Brep2Builder.BuildParabolaEdge2FromCenterABPoint(this.center, this.focus, this.begin);
    if (paras.length >= 8) { edge.uuid = paras[7]; }
    let alg = CurveBuilder.Algorithm2ByData(edge.curve);
    this.begin = alg.p(edge.u.x);
    let geo = BrepMeshBuilder.BuildEdge2Mesh(edge, userData.color);
    userData.original = edge;
    geo.userData = userData;
    this.results = geo;

    userData.assistPoints.push({ p: this.begin, c: THREE.Color.NAMES.greenyellow });
    this.assists.push(this.createAssistPoint(userData.assistPoints[userData.assistPoints.length - 1]));
    Global.scene.add(this.assists[this.assists.length - 1]);

    this._text = paras[0]
      + ' ' + this.center.x + ' ' + this.center.y
      + ' ' + this.focus.x + ' ' + this.focus.y
      + ' ' + this.begin.x + ' ' + this.begin.y
      + ' ' + edge.uuid;

    this.done();
  }
  onMouseMoveExec(event: MouseEvent) {
    if (this._isCancel) { this.cancel(); return; }
    if (this.center && !this.focus) {
      if (this.tempResult) {
        Global.scene.remove(this.tempResult);
      }
      let beginPoint: Vector2 = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
      let f = beginPoint.distanceTo(this.center);
      if (f == 0) return;
      let u0 = 2 * f;
      let u1 = -u0;
      // 创建一个临时曲线段
      let edge = Brep2Builder.BuildParabolaEdge2FromCenterAPoint(this.center, beginPoint, u0, u1);
      let t = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray, undefined, 0);
      t.name = "temp";
      this.tempResult = t;
      Global.scene.add(this.tempResult);
    }
    if (this.center && this.focus && !this.begin) {
      if (this.tempResult) {
        Global.scene.remove(this.tempResult);
      }
      let endPoint: Vector2 = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
      // 创建一个临时曲线段
      let edge = Brep2Builder.BuildParabolaEdge2FromCenterABPoint(this.center, this.focus, endPoint);
      let t = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray, undefined, 0);
      t.name = "temp";
      this.tempResult = t;
      Global.scene.add(this.tempResult);
    }
  };
}
export { CreateParabola2Com };