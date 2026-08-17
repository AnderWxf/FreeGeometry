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
import { PI, PI2, PI_2 } from "../../../../math/MathUtils";
import { CreateGeomUserData, type UserData } from "../../../UserData";


/**
 * Create command class.
 * 格式：命令类型 center.x center.y major.x major.y minor.x minor.y u0p.x u0p.y u1p.x u1p.y isRight uuid
 */
class CreateHyperbola2Com extends ComCreate {
  center: Vector2;
  major: Vector2;
  minor: Vector2;
  u0p: Vector2;
  u1p: Vector2;
  private isRight: boolean = true;   // 默认右侧弧(按下左shift表示画左侧弧)
  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
    this.type = GeomType.DRAW_CURVE2_HY;
  }
  async exec(): Promise<void> {
    let str = this._text;
    let paras = str.split(' ');
    let userData = CreateGeomUserData(this.type);
    if (paras.length >= 12) {
      // 创建一个线段
      this.center = new Vector2(new Number(paras[1]).valueOf(), new Number(paras[2]).valueOf());
      this.major = new Vector2(new Number(paras[3]).valueOf(), new Number(paras[4]).valueOf());
      this.minor = new Vector2(new Number(paras[5]).valueOf(), new Number(paras[6]).valueOf());
      this.u0p = new Vector2(new Number(paras[7]).valueOf(), new Number(paras[8]).valueOf());
      this.u1p = new Vector2(new Number(paras[9]).valueOf(), new Number(paras[10]).valueOf());
      this.isRight = new Boolean(paras[11]).valueOf();
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

      let act_pick_major = new ActPickPoint2();
      await act_pick_major.execute(context);
      if (this._isCancel || act_pick_major.isCancel) { this.cancel(); return; }
      this.major = new Vector2(act_pick_major.result.x, act_pick_major.result.y);
      userData.assistPoints.push({ p: this.major, c: THREE.Color.NAMES.limegreen });
      this.assists.push(this.createAssistPoint(userData.assistPoints[userData.assistPoints.length - 1]));
      Global.scene.add(this.assists[this.assists.length - 1]);

      let act_pick_minor = new ActPickPoint2();
      await act_pick_minor.execute(context);
      if (this._isCancel || act_pick_minor.isCancel) { this.cancel(); return; }
      this.minor = new Vector2(act_pick_minor.result.x, act_pick_minor.result.y);

      let act_pick_u0 = new ActPickPoint2();
      await act_pick_u0.execute(context);
      if (this._isCancel || act_pick_u0.isCancel) { this.cancel(); return; }
      this.u0p = new Vector2(act_pick_u0.result.x, act_pick_u0.result.y);

      let act_pick_u1 = new ActPickPoint2();
      await act_pick_u1.execute(context);
      if (this._isCancel || act_pick_u1.isCancel) { this.cancel(); return; }
      this.u1p = new Vector2(act_pick_u1.result.x, act_pick_u1.result.y);

    }
    // 创建一个曲线段
    let edge = Brep2Builder.BuildHyperbolaEdge2FromCenterABPoint(this.center, this.major, this.minor);
    if (paras.length >= 13) { edge.uuid = paras[12]; }
    let alg = CurveBuilder.Algorithm2ByData(edge.curve);

    userData.assistPoints.push({ p: this.minor, c: THREE.Color.NAMES.green });
    this.assists.push(this.createAssistPoint(userData.assistPoints[userData.assistPoints.length - 1]));
    Global.scene.add(this.assists[this.assists.length - 1]);

    let u0 = alg.u(this.u0p);
    this.u0p = alg.p(u0);
    userData.assistPoints.push({ p: this.u0p, c: THREE.Color.NAMES.deepskyblue });
    this.assists.push(this.createAssistPoint(userData.assistPoints[userData.assistPoints.length - 1]));
    Global.scene.add(this.assists[this.assists.length - 1]);

    let u1 = alg.u(this.u1p);
    this.u1p = alg.p(u1);
    userData.assistPoints.push({ p: this.u1p, c: THREE.Color.NAMES.darkblue });
    this.assists.push(this.createAssistPoint(userData.assistPoints[userData.assistPoints.length - 1]));
    Global.scene.add(this.assists[this.assists.length - 1]);

    edge.u.set(u0, u1);
    let geo = BrepMeshBuilder.BuildEdge2Mesh(edge, userData.color);
    userData.original = edge;
    geo.userData = userData;
    this.results = geo;
    this._text = paras[0] + ' ' + this.center.x + ' ' + this.center.y
      + ' ' + this.major.x + ' ' + this.major.y
      + ' ' + this.minor.x + ' ' + this.minor.y
      + ' ' + this.u0p.x + ' ' + this.u0p.y
      + ' ' + this.u1p.x + ' ' + this.u1p.y
      + ' ' + this.isRight
      + ' ' + edge.uuid;
    this.done();
  }
  onMouseMoveExec(event: MouseEvent) {
    if (this._isCancel) { this.cancel(); return; }
    if (this.center && !this.major) {
      if (this.tempResult) {
        Global.scene.remove(this.tempResult);
      }
      let majorPoint: Vector2 = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
      // 创建一个临时曲线段
      let edge = Brep2Builder.BuildLineEdge2FromBeginEndPoint(this.center, majorPoint);
      let t = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray, undefined, 0);
      t.name = "temp";
      this.tempResult = t;
      Global.scene.add(this.tempResult);
    }

    if (this.center && this.major && !this.minor) {
      if (this.tempResult) {
        Global.scene.remove(this.tempResult);
      }
      let minorPoint: Vector2 = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
      // 创建一个临时曲线段
      let edge = Brep2Builder.BuildHyperbolaEdge2FromCenterABPoint(this.center, this.major, minorPoint);
      if (this.isRight) {
        edge.u.set(-PI_2 + 1e-4, PI_2 - 1e-4);
      } else {
        edge.u.set(PI_2 + 1e-4, PI_2 + PI - 1e-4);
      }
      let t = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray, undefined, 0);
      t.name = "temp";
      this.tempResult = t;
      Global.scene.add(this.tempResult);
    }

    if (this.center && this.major && this.minor && !this.u0p) {
      if (this.tempResult) {
        Global.scene.remove(this.tempResult);
      }
      let u0Point: Vector2 = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
      // 创建一个临时曲线段
      let edge = Brep2Builder.BuildHyperbolaEdge2FromCenterABPoint(this.center, this.major, this.minor);
      let alg = CurveBuilder.Algorithm2ByData(edge.curve);
      let u0 = alg.u(u0Point);
      if (this.isRight) {
        edge.u.set(u0, PI_2 - 1e-4);
      } else {
        edge.u.set(u0, PI_2 + PI - 1e-4);
      }
      let t = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray, undefined, 0);
      t.name = "temp";
      this.tempResult = t;
      Global.scene.add(this.tempResult);
    }

    if (this.center && this.major && this.minor && this.u0p && !this.u1p) {
      if (this.tempResult) {
        Global.scene.remove(this.tempResult);
      }
      let u1Point: Vector2 = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
      // 创建一个临时曲线段
      let edge = Brep2Builder.BuildHyperbolaEdge2FromCenterABPoint(this.center, this.major, this.minor);
      let alg = CurveBuilder.Algorithm2ByData(edge.curve);
      let u0 = alg.u(this.u0p);
      let u1 = alg.u(u1Point);
      edge.u.set(u0, u1);
      let t = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray, undefined, 0);
      t.name = "temp";
      this.tempResult = t;
      Global.scene.add(this.tempResult);
    }
  };

  override onKeyDownExec(event: KeyboardEvent) {
    super.onKeyDownExec(event);
    switch (event.code) {
      case "ShiftLeft":
        this.isRight = false;
        break;
    }
  }
  override onKeyUpExec(event: KeyboardEvent) {
    super.onKeyUpExec(event);
    switch (event.code) {
      case "ShiftLeft":
        this.isRight = true;
        break;
    }
  }

}
export { CreateHyperbola2Com };