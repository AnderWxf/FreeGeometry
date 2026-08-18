import * as THREE from "three";
import { ActionContext3D } from "../../Active";
import { Global } from "../../../../core/Global";
import { ActPickPoint2 } from "../../acts/ActPickPoint2";
import { Brep2Builder } from "../../../../geometry/algorithm/builder/Brep2Builder";
import { Vector2 } from "../../../../math/Math";
import { BrepMeshBuilder } from "../../../BrepMeshBuilder";
import type { CommandExecuter } from "../../CommandExecuter";
import { ActPickObject } from "../../acts/ActPickObject";
import { Edge2 } from "../../../../geometry/data/brep/Brep2";
import { GeomType } from "../../../../core/Constents";
import { ActPickAssist } from "../../acts/ActPickAssist";
import { CloneUserData, CopyUserData, CreateGeomUserData, type UserData } from "../../../UserData";
import { ModifyFaceCom } from "./ModifyFaceCom";


/**
 * Modify command class.
 * 命令类型 UUID 控制点索引 p.x p.y
 */
class ModifyPolylineAreaCom extends ModifyFaceCom {
  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
    this.type = GeomType.DRAW_SURFACE_POL;
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
    let points: Vector2[] = [];
    for (let i = 0; i < userData.assistPoints.length; i++) {
      let point = userData.assistPoints[i].p;
      points.push(point);
    }

    // 创建一个多段线
    let edges: Edge2[] = [];
    for (let i = 1; i < points.length; i++) {
      let beginPoint = points[i - 1];
      let endPoint = points[i];
      let edge = Brep2Builder.BuildLineEdge2FromBeginEndPoint(beginPoint, endPoint);
      edges.push(edge);
    }
    let beginPoint = points[points.length - 1];
    let endPoint = points[0];
    let edge = Brep2Builder.BuildLineEdge2FromBeginEndPoint(beginPoint, endPoint);
    edges.push(edge);

    // 创建一个面
    let face = Brep2Builder.BuildFaceByEdges(edges);
    face.uuid = this.old.userData.original.uuid;
    userData.color = THREE.Color.NAMES.blue;
    let geo = BrepMeshBuilder.BuildFace2Mesh(face, userData.color);
    userData.original = face;
    geo.userData = userData;
    this.results = geo;

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

      userData.assistPoints[this.assistIndex].p = Global.select.overedPoint
        ? userData.assistPoints[this.assistIndex].p.set(Global.select.overedPoint.x, Global.select.overedPoint.y)
        : userData.assistPoints[this.assistIndex].p.set(0, 0);

      let points: Vector2[] = [];
      for (let i = 0; i < userData.assistPoints.length; i++) {
        points.push(userData.assistPoints[i].p as Vector2);
      }
      // 创建一个闭合多段线
      let edges: Edge2[] = [];
      for (let i = 1; i < points.length; i++) {
        let beginPoint = points[i - 1];
        let endPoint = points[i];
        let edge = Brep2Builder.BuildLineEdge2FromBeginEndPoint(beginPoint, endPoint);
        edges.push(edge);
      }
      let beginPoint = points[points.length - 1];
      let endPoint = points[0];
      let edge = Brep2Builder.BuildLineEdge2FromBeginEndPoint(beginPoint, endPoint);
      edges.push(edge);

      let t = BrepMeshBuilder.BuildEdge2sMesh(edges, THREE.Color.NAMES.gray, undefined, 0);
      t.name = "temp";
      this.tempResult = t;
      Global.scene.add(this.tempResult);
    }
  };
}
export { ModifyPolylineAreaCom };