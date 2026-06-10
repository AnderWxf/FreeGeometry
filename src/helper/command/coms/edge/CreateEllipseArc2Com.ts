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
import { CurveBuilder } from "../../../../geometry/algorithm/builder/CurveBuilder";
import { PI2, PI_2 } from "../../../../math/MathUtils";
import { CreateGeomUserData, type UserData } from "../../../UserData";


/**
 * Create command class.
 * 
 */
class CreateEllipseArc2Com extends ComCreate {
  centerPoint: Vector2;
  majorPoint: Vector2;
  minorPoint: Vector2;
  u0Point: Vector2;
  u1Point: Vector2;
  private isForward: boolean = true;   // 默认正向弧(按下左shift表示画反向弧-正时针旋转)
  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
    this.type = GeomType.EA;
  }
  async exec(): Promise<void> {
    let str = this._text;
    let paras = str.split(' ');
    let userData = CreateGeomUserData(this.type);
    if (paras.length == 12) {
      // 创建一个线段
      this.centerPoint = new Vector2(new Number(paras[1]).valueOf(), new Number(paras[2]).valueOf());
      this.majorPoint = new Vector2(new Number(paras[3]).valueOf(), new Number(paras[4]).valueOf());
      this.minorPoint = new Vector2(new Number(paras[5]).valueOf(), new Number(paras[6]).valueOf());
      this.u0Point = new Vector2(new Number(paras[7]).valueOf(), new Number(paras[8]).valueOf());
      this.u1Point = new Vector2(new Number(paras[9]).valueOf(), new Number(paras[10]).valueOf());
      this.isForward = new Boolean(paras[11]).valueOf();
    } else {
      this.bind(window);
      let context: ActionContext3D = new ActionContext3D(Global.scene, Global.camera, Global.renderer, Global.select);

      let act_pick_center = new ActPickPoint2();
      await act_pick_center.execute(context);
      if (this._isCancel || act_pick_center.isCancel) { this.cancel(); return; }
      this.centerPoint = new Vector2(act_pick_center.result.x, act_pick_center.result.y);
      userData.assistPoints.push({ p: this.centerPoint, c: THREE.Color.NAMES.greenyellow });
      this.assists.push(this.createAssistPoint(userData.assistPoints[userData.assistPoints.length - 1]));
      Global.scene.add(this.assists[this.assists.length - 1]);

      let act_pick_major = new ActPickPoint2();
      await act_pick_major.execute(context);
      if (this._isCancel || act_pick_major.isCancel) { this.cancel(); return; }
      this.majorPoint = new Vector2(act_pick_major.result.x, act_pick_major.result.y);
      userData.assistPoints.push({ p: this.majorPoint, c: THREE.Color.NAMES.limegreen });
      this.assists.push(this.createAssistPoint(userData.assistPoints[userData.assistPoints.length - 1]));
      Global.scene.add(this.assists[this.assists.length - 1]);

      let act_pick_minor = new ActPickPoint2();
      await act_pick_minor.execute(context);
      if (this._isCancel || act_pick_minor.isCancel) { this.cancel(); return; }
      this.minorPoint = new Vector2(act_pick_minor.result.x, act_pick_minor.result.y);

      let act_pick_u0 = new ActPickPoint2();
      await act_pick_u0.execute(context);
      if (this._isCancel || act_pick_u0.isCancel) { this.cancel(); return; }
      this.u0Point = new Vector2(act_pick_u0.result.x, act_pick_u0.result.y);

      let act_pick_u1 = new ActPickPoint2();
      await act_pick_u1.execute(context);
      if (this._isCancel || act_pick_u1.isCancel) { this.cancel(); return; }
      this.u1Point = new Vector2(act_pick_u1.result.x, act_pick_u1.result.y);

      this._text = paras[0] + ' ' + this.centerPoint.x + ' ' + this.centerPoint.y
        + ' ' + this.majorPoint.x + ' ' + this.majorPoint.y
        + ' ' + this.minorPoint.x + ' ' + this.minorPoint.y
        + ' ' + this.u0Point.x + ' ' + this.u0Point.y
        + ' ' + this.u1Point.x + ' ' + this.u1Point.y
        + ' ' + this.isForward;
    }
    // 创建一个曲线段
    let edge = Brep2Builder.BuildEllipseArcEdge2FromCenterBeginEndPoint(this.centerPoint, this.majorPoint, this.minorPoint);

    let alg = CurveBuilder.Algorithm2ByData(edge.curve);
    let minorPoint = alg.p(PI_2);
    this.minorPoint.set(minorPoint.x, minorPoint.y);
    userData.assistPoints.push({ p: this.minorPoint, c: THREE.Color.NAMES.green });
    this.assists.push(this.createAssistPoint(userData.assistPoints[userData.assistPoints.length - 1]));
    Global.scene.add(this.assists[this.assists.length - 1]);

    let u0 = alg.u(this.u0Point);
    let u0p = alg.p(u0);
    this.u0Point.set(u0p.x, u0p.y);
    userData.assistPoints.push({ p: this.u0Point, c: THREE.Color.NAMES.deepskyblue });
    this.assists.push(this.createAssistPoint(userData.assistPoints[userData.assistPoints.length - 1]));
    Global.scene.add(this.assists[this.assists.length - 1]);

    let u1 = alg.u(this.u1Point);
    let u1p = alg.p(u1);
    this.u1Point.set(u1p.x, u1p.y);
    userData.assistPoints.push({ p: this.u1Point, c: THREE.Color.NAMES.darkblue });
    this.assists.push(this.createAssistPoint(userData.assistPoints[userData.assistPoints.length - 1]));
    Global.scene.add(this.assists[this.assists.length - 1]);

    edge.u.set(u0, u1);
    if (this.isForward) {
      if (u1 < u0) {
        edge.u.set(u0, u1 + PI2);
      }
    } else {
      if (u0 < u1) {
        edge.u.set(u0, u1 - PI2);
      }
    }
    let geo = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.red);
    userData.original = edge;
    geo.userData = userData;
    this.result = geo;
    this.done();
  }
  onMouseMoveExec(event: MouseEvent) {
    if (this._isCancel) { this.cancel(); return; }
    if (this.centerPoint && !this.majorPoint) {
      if (this.tempResult) {
        Global.scene.remove(this.tempResult);
      }
      let majorPoint: Vector2 = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
      // 创建一个临时曲线段
      let edge = Brep2Builder.BuildCircleEdge2FromCenterRadius(this.centerPoint, majorPoint.distanceTo(this.centerPoint));
      let t = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray, undefined, 0, false);
      t.name = "temp";
      this.tempResult = t;
      Global.scene.add(this.tempResult);
    }

    if (this.centerPoint && this.majorPoint && !this.minorPoint) {
      if (this.tempResult) {
        Global.scene.remove(this.tempResult);
      }
      let minorPoint: Vector2 = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
      // 创建一个临时曲线段
      let edge = Brep2Builder.BuildEllipseEdge2FromCenterBeginEndPoint(this.centerPoint, this.majorPoint, minorPoint);
      let t = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray, undefined, 0, false);
      t.name = "temp";
      this.tempResult = t;
      Global.scene.add(this.tempResult);
    }

    if (this.centerPoint && this.majorPoint && this.minorPoint && !this.u0Point) {
      if (this.tempResult) {
        Global.scene.remove(this.tempResult);
      }
      let u0Point: Vector2 = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
      // 创建一个临时曲线段
      let edge = Brep2Builder.BuildEllipseEdge2FromCenterBeginEndPoint(this.centerPoint, this.majorPoint, this.minorPoint);
      let alg = CurveBuilder.Algorithm2ByData(edge.curve);
      let u0 = alg.u(u0Point);
      edge.u.x = u0;
      let t = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray, undefined, 0, false);
      t.name = "temp";
      this.tempResult = t;
      Global.scene.add(this.tempResult);
    }

    if (this.centerPoint && this.majorPoint && this.minorPoint && this.u0Point && !this.u1Point) {
      if (this.tempResult) {
        Global.scene.remove(this.tempResult);
      }
      let u1Point: Vector2 = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
      // 创建一个临时曲线段
      let edge = Brep2Builder.BuildEllipseEdge2FromCenterBeginEndPoint(this.centerPoint, this.majorPoint, this.minorPoint);
      let alg = CurveBuilder.Algorithm2ByData(edge.curve);
      let u0 = alg.u(this.u0Point);
      let u1 = alg.u(u1Point);
      edge.u.set(u0, u1);
      if (this.isForward) {
        if (u1 < u0) {
          edge.u.set(u0, u1 + PI2);
        }
      } else {
        if (u0 < u1) {
          edge.u.set(u0, u1 - PI2);
        }
      }

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
export { CreateEllipseArc2Com };