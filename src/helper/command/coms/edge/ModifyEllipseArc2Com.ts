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
import { ComModify } from "../ComModify";
import { ActPickObject } from "../../acts/ActPickObject";
import { Edge2 } from "../../../../geometry/data/brep/Brep2";
import { Arc2Data } from "../../../../geometry/data/base/curve2/Arc2Data";
import { GeomType } from "../../../../core/Constents";
import { ActPickAssist } from "../../acts/ActPickAssist";
import { CurveBuilder } from "../../../../geometry/algorithm/builder/CurveBuilder";
import { PI2, PI_2 } from "../../../../math/MathUtils";
import { CloneUserData, CopyUserData, CreateGeomUserData, type UserData } from "../../../UserData";


/**
 * Modify command class.
 * 格式：命令类型 UUID 控制点索引 p.x p.y isForward
 */
class ModifyEllipseArc2Com extends ComModify {
  private isForward: boolean = true;   // 默认正向弧(按下左shift表示画反向弧-正时针旋转)
  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
    this.type = GeomType.DRAW_CURVE2_EA;
  }
  async exec(): Promise<void> {
    let str = this._text;
    let paras = str.split(' ');
    let userData = CreateGeomUserData(this.type);

    // 指定了对象
    if (paras.length >= 2) {
      let objs = Global.scene.getObjectsByUUIDs([paras[1]]);
      if (objs.length > 0 && objs[0].userData.type == this.type) {
        this.old = objs[0];
      }
    } else {
      this.getSelected();
    }
    this.bind(window);
    let context: ActionContext3D = new ActionContext3D(Global.scene.scene, Global.camera, Global.renderer, Global.select);
    if (!this.old) {
      let act_pick_data = new ActPickObject();
      await act_pick_data.execute(context);
      if (this._isCancel || act_pick_data.isCancel) { this.cancel(); return; }
      while (!act_pick_data.result.userData
        || act_pick_data.result.userData.type != this.type
      ) {
        await act_pick_data.execute(context);
        if (this._isCancel || act_pick_data.isCancel) { this.cancel(); return; }
      }
      this.old = act_pick_data.result;
    }
    CopyUserData(this.old.userData as UserData, userData);

    if (paras.length >= 5) {
      this.assistIndex = new Number(paras[2]).valueOf();
      let px = new Number(paras[3]).valueOf();
      let py = new Number(paras[4]).valueOf();
      userData.assistPoints[this.assistIndex].p.set(px, py);
    } else {
      let act_pick_assist = new ActPickAssist();
      await act_pick_assist.execute(context);
      this.assistIndex = this.getIndex(act_pick_assist.result);
      while (!act_pick_assist.result.userData.isAssist || this.assistIndex < 0) {
        await act_pick_assist.execute(context);
        this.assistIndex = this.getIndex(act_pick_assist.result);
        if (this._isCancel || act_pick_assist.isCancel) { this.cancel(); return; }
      }

      let act_pick_new_pos = new ActPickPoint2();
      await act_pick_new_pos.execute(context);
      if (this._isCancel || act_pick_new_pos.isCancel) { this.cancel(); return; }
      userData.assistPoints[this.assistIndex].p.set(act_pick_new_pos.result.x, act_pick_new_pos.result.y);
    }

    if (paras.length >= 6) {
      this.isForward = new Boolean(paras[5]).valueOf();
    }
    
    let centerPoint = userData.assistPoints[0].p as Vector2;
    let majorPoint = userData.assistPoints[1].p as Vector2;
    let minorPoint = userData.assistPoints[2].p as Vector2;
    let u0Point = userData.assistPoints[3].p as Vector2;
    let u1Point = userData.assistPoints[4].p as Vector2;

    // 创建一个曲线段
    let edge = Brep2Builder.BuildEllipseEdge2FromCenterBeginEndPoint(centerPoint, majorPoint, minorPoint);
    edge.uuid = this.old.userData.original.uuid;
    let alg = CurveBuilder.Algorithm2ByData(edge.curve);
    let minorP = alg.p(PI_2);
    minorPoint.set(minorP.x, minorP.y);

    let u0 = alg.u(u0Point);
    let u0p = alg.p(u0);
    u0Point.set(u0p.x, u0p.y);

    let u1 = alg.u(u1Point);
    let u1p = alg.p(u1);
    u1Point.set(u1p.x, u1p.y);

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

    let geo = BrepMeshBuilder.BuildEdge2Mesh(edge, userData.color);
    userData.original = edge;
    geo.userData = userData;
    this.results = geo;

    this._text = paras[0]
      + ' ' + edge.uuid
      + ' ' + this.assistIndex
      + ' ' + userData.assistPoints[this.assistIndex].p.x + ' ' + userData.assistPoints[this.assistIndex].p.y
      + ' ' + this.isForward;

    this.done();
  }
  onMouseMoveExec(event: MouseEvent) {
    if (this._isCancel) { this.cancel(); return; }
    if (this.assistIndex > -1) {
      if (this.tempResult) {
        Global.scene.remove(this.tempResult);
      }

      let userData = CloneUserData(this.old.userData as UserData);

      let centerPoint = userData.assistPoints[0].p as Vector2;
      let majorPoint = userData.assistPoints[1].p as Vector2;
      let minorPoint = userData.assistPoints[2].p as Vector2;
      let u0Point = userData.assistPoints[3].p as Vector2;
      let u1Point = userData.assistPoints[4].p as Vector2;

      userData.assistPoints[this.assistIndex].p = Global.select.overedPoint
        ? userData.assistPoints[this.assistIndex].p.set(Global.select.overedPoint.x, Global.select.overedPoint.y)
        : userData.assistPoints[this.assistIndex].p.set(0, 0);

      // 创建一个临时曲线段
      let edge = Brep2Builder.BuildEllipseEdge2FromCenterBeginEndPoint(centerPoint, majorPoint, minorPoint);
      let alg = CurveBuilder.Algorithm2ByData(edge.curve);

      let minorP = alg.p(PI_2);
      minorPoint.set(minorP.x, minorP.y);


      let u0 = alg.u(u0Point);
      let u0p = alg.p(u0);
      u0Point.set(u0p.x, u0p.y);

      let u1 = alg.u(u1Point);
      let u1p = alg.p(u1);
      u1Point.set(u1p.x, u1p.y);

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

      let t = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray, undefined, 0);
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
export { ModifyEllipseArc2Com };