import * as THREE from "three";
import { ActionContext3D } from "../../Active";
import { Global } from "../../../../core/Global";
import { ActPickPoint2 } from "../../acts/ActPickPoint2";
import { Brep2Builder } from "../../../../geometry/algorithm/builder/Brep2Builder";
import { Vector2 } from "../../../../math/Math";
import { BrepMeshBuilder } from "../../../BrepMeshBuilder";
import type { CommandExecuter } from "../../CommandExecuter";
import { ActPickObject } from "../../acts/ActPickObject";
import { GeomType } from "../../../../core/Constents";
import { ActPickAssist } from "../../acts/ActPickAssist";
import { CloneUserData, CopyUserData, CreateGeomUserData, type UserData } from "../../../UserData";
import { PI_2 } from "../../../../math/MathUtils";
import { CurveBuilder } from "../../../../geometry/algorithm/builder/CurveBuilder";
import { ModifyFaceCom } from "./ModifyFaceCom";


/**
 * Modify command class.
 * 格式：命令类型 UUID 控制点索引 p.x p.y
 */
class ModifyEllipseAreaCom extends ModifyFaceCom {
  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
    this.type = GeomType.DRAW_SURFACE_EL;
  }
  async exec(): Promise<void> {
    let str = this._text;
    let paras = str.split(' ');
    let userData = CreateGeomUserData(this.type);

    // 指定了对象
    if (paras.length >= 1) {
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
    if (paras.length >= 6) {
      this.assistIndex = new Number(paras[3]).valueOf();
      let px = new Number(paras[4]).valueOf();
      let py = new Number(paras[5]).valueOf();
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

    let center = userData.assistPoints[0].p as Vector2;
    let major = userData.assistPoints[1].p as Vector2;
    let minor = userData.assistPoints[2].p as Vector2;

    // 创建一个曲线段
    let edge = Brep2Builder.BuildEllipseEdge2FromCenterBeginEndPoint(center, major, minor);

    // 创建一个面
    let face = Brep2Builder.BuildFaceByEdges([edge]);
    face.uuid = this.old.userData.original.uuid;
    userData.color = THREE.Color.NAMES.blue;
    let geo = BrepMeshBuilder.BuildFace2Mesh(face, userData.color);
    userData.original = face;
    geo.userData = userData;
    this.results = geo;
    let alg = CurveBuilder.Algorithm2ByData(edge.curve);
    let minorP = alg.p(PI_2);
    minor.set(minorP.x, minorP.y);

    this._text = paras[0]
      + ' ' + face.uuid
      + ' ' + this.assistIndex
      + ' ' + userData.assistPoints[this.assistIndex].p.x + ' ' + userData.assistPoints[this.assistIndex].p.y;

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

      userData.assistPoints[this.assistIndex].p = Global.select.overedPoint
        ? userData.assistPoints[this.assistIndex].p.set(Global.select.overedPoint.x, Global.select.overedPoint.y)
        : userData.assistPoints[this.assistIndex].p.set(0, 0);

      // 创建一个临时曲线段
      let edge = Brep2Builder.BuildEllipseEdge2FromCenterBeginEndPoint(centerPoint, majorPoint, minorPoint);
      let t = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray, undefined, 0);
      t.name = "temp";
      this.tempResult = t;
      Global.scene.add(this.tempResult);
    }
  };
}
export { ModifyEllipseAreaCom };