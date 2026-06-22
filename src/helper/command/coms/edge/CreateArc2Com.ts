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
import { CreateGeomUserData, type UserData } from "../../../UserData";
import { CurveBuilder } from "../../../../geometry/algorithm/builder/CurveBuilder";
import { PI2 } from "../../../../math/MathUtils";
import { e } from "../../../../mathjs/lib/cjs/entry/pureFunctionsAny.generated";


/**
 * Create command class.
 * 
 */
class CreateArc2Com extends ComCreate {
  centerPoint: Vector2;
  beginPoint: Vector2;
  endPoint: Vector2;
  private isForward: boolean = true;
  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
    this.type = GeomType.A;
  }
  async exec(): Promise<void> {
    let str = this._text;
    let paras = str.split(' ');
    let userData = CreateGeomUserData(this.type);
    if (paras.length == 7) {
      // 创建一个线段
      this.centerPoint = new Vector2(new Number(paras[1]).valueOf(), new Number(paras[2]).valueOf());
      this.beginPoint = new Vector2(new Number(paras[3]).valueOf(), new Number(paras[4]).valueOf());
      this.endPoint = new Vector2(new Number(paras[5]).valueOf(), new Number(paras[6]).valueOf());
      this.isForward = new Boolean(paras[7]).valueOf();
    } else {
      this.bind(window);
      let context: ActionContext3D = new ActionContext3D(Global.scene.scene, Global.camera, Global.renderer, Global.select);

      let act_pick_center = new ActPickPoint2();
      await act_pick_center.execute(context);
      if (this._isCancel || act_pick_center.isCancel) { this.cancel(); return; }
      this.centerPoint = new Vector2(act_pick_center.result.x, act_pick_center.result.y);
      userData.assistPoints.push({ p: this.centerPoint, c: THREE.Color.NAMES.greenyellow });
      this.assists.push(this.createAssistPoint(userData.assistPoints[userData.assistPoints.length - 1]));
      Global.scene.add(this.assists[this.assists.length - 1]);

      let act_pick_begin = new ActPickPoint2();
      await act_pick_begin.execute(context);
      if (this._isCancel || act_pick_begin.isCancel) { this.cancel(); return; }
      this.beginPoint = new Vector2(act_pick_begin.result.x, act_pick_begin.result.y);
      userData.assistPoints.push({ p: this.beginPoint, c: THREE.Color.NAMES.limegreen });
      this.assists.push(this.createAssistPoint(userData.assistPoints[userData.assistPoints.length - 1]));
      Global.scene.add(this.assists[this.assists.length - 1]);

      let act_pick_end = new ActPickPoint2();
      await act_pick_end.execute(context);
      if (this._isCancel || act_pick_end.isCancel) { this.cancel(); return; }
      this.endPoint = new Vector2(act_pick_end.result.x, act_pick_end.result.y);

    }
    // 创建一个曲线段
    let edge = Brep2Builder.BuildCircleArcEdge2FromCenterBeginEndPoin(this.centerPoint, this.beginPoint, this.endPoint);
    edge.u.y = this.isForward ? edge.u.y : edge.u.y - PI2;
    let geo = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.red);
    userData.original = edge;
    geo.userData = userData;
    this.results = geo;
    this._text = paras[0] + ' ' + this.centerPoint.x + ' ' + this.centerPoint.y
      + ' ' + this.beginPoint.x + ' ' + this.beginPoint.y
      + ' ' + this.endPoint.x + ' ' + this.endPoint.y
      + ' ' + this.isForward;

    let alg = CurveBuilder.Algorithm2ByData(edge.curve);
    let endPoint = alg.p(edge.u.y);
    this.endPoint.set(endPoint.x, endPoint.y);
    userData.assistPoints.push({ p: this.endPoint, c: THREE.Color.NAMES.darkblue });
    this.assists.push(this.createAssistPoint(userData.assistPoints[userData.assistPoints.length - 1]));
    Global.scene.add(this.assists[this.assists.length - 1]);

    this.done();
  }
  onMouseMoveExec(event: MouseEvent) {
    if (this._isCancel) { this.cancel(); return; }
    if (this.centerPoint && !this.beginPoint) {
      if (this.tempResult) {
        Global.scene.remove(this.tempResult);
      }
      let beginPoint: Vector2 = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
      // 创建一个临时曲线段
      let edge = Brep2Builder.BuildCircleEdge2FromCenterRadius(this.centerPoint, beginPoint.distanceTo(this.centerPoint));

      let t = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray, undefined, 0, false);
      t.name = "temp";
      this.tempResult = t;
      Global.scene.add(this.tempResult);
    }
    if (this.centerPoint && this.beginPoint && !this.endPoint) {
      if (this.tempResult) {
        Global.scene.remove(this.tempResult);
      }
      let endPoint: Vector2 = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
      // 创建一个临时曲线段
      let edge = Brep2Builder.BuildCircleArcEdge2FromCenterBeginEndPoin(this.centerPoint, this.beginPoint, endPoint);
      edge.u.y = this.isForward ? edge.u.y : edge.u.y - PI2;
      let t = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray, undefined, 0, false);
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
export { CreateArc2Com };