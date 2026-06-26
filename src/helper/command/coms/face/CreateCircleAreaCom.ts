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
import { CreateGeomUserData, type UserData } from "../../../UserData";
import { Coedge2, Face2, Vertice2 } from "../../../../geometry/data/brep/Brep2";
import { CreateFaceCom } from "./CreateFaceCom";


/**
 * Create command class.
 * 
 */
class CreateCircleAreaCom extends CreateFaceCom {
  centerPoint: Vector2;
  beginPoint: Vector2;
  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
    this.type = GeomType.DRAW_SURFACE_CI;
  }
  async exec(): Promise<void> {
    let str = this._text;
    let paras = str.split(' ');
    let userData = CreateGeomUserData(this.type);
    if (paras.length == 5) {
      // 创建一个线段
      this.centerPoint = new Vector2(new Number(paras[1]).valueOf(), new Number(paras[2]).valueOf());
      this.beginPoint = new Vector2(new Number(paras[3]).valueOf(), new Number(paras[4]).valueOf());
    } else {
      this.bind(window);
      let context: ActionContext3D = new ActionContext3D(Global.scene.scene, Global.camera, Global.renderer, Global.select);
      let act_pick_begin = new ActPickPoint2();
      await act_pick_begin.execute(context);
      if (this._isCancel || act_pick_begin.isCancel) { this.cancel(); return; }
      this.centerPoint = new Vector2(act_pick_begin.result.x, act_pick_begin.result.y);
      userData.assistPoints.push({ p: this.centerPoint, c: THREE.Color.NAMES.greenyellow });
      this.assists.push(this.createAssistPoint(userData.assistPoints[userData.assistPoints.length - 1]));
      Global.scene.add(this.assists[this.assists.length - 1]);

      let act_pick_end = new ActPickPoint2();
      await act_pick_end.execute(context);
      if (this._isCancel || act_pick_end.isCancel) { this.cancel(); return; }
      this.beginPoint = new Vector2(act_pick_end.result.x, act_pick_end.result.y);
      userData.assistPoints.push({ p: this.beginPoint, c: THREE.Color.NAMES.limegreen });
      this.assists.push(this.createAssistPoint(userData.assistPoints[userData.assistPoints.length - 1]));
      Global.scene.add(this.assists[this.assists.length - 1]);

      this._text = paras[0] + ' ' + this.centerPoint.x + ' ' + this.centerPoint.y + ' ' + this.beginPoint.x + ' ' + this.beginPoint.y;
    }

    // 创建一个曲线段
    let edge = Brep2Builder.BuildCircleEdge2FromCenterRadius(this.centerPoint, this.beginPoint.distanceTo(this.centerPoint));

    // 创建一个面
    let face = this.createFace([edge]);
    userData.color = THREE.Color.NAMES.blue;
    let geo = BrepMeshBuilder.BuildFace2Mesh(face, userData.color);
    userData.original = face;
    geo.userData = userData;
    this.results = geo;
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
      let t = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray, undefined, 0);
      t.name = "temp";
      this.tempResult = t;
      Global.scene.add(this.tempResult);
    }
  };
}
export { CreateCircleAreaCom };