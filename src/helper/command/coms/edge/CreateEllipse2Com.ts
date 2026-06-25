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
import { PI_2 } from "../../../../math/MathUtils";
import { CreateGeomUserData, type UserData } from "../../../UserData";


/**
 * Create command class.
 * 
 */
class CreateEllipse2Com extends ComCreate {
  centerPoint: Vector2;
  majorPoint: Vector2;
  minorPoint: Vector2;
  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
    this.type = GeomType.DRAW_CURVE2_E;
  }
  async exec(): Promise<void> {
    let str = this._text;
    let paras = str.split(' ');
    let userData = CreateGeomUserData(this.type);
    if (paras.length == 7) {
      // 创建一个线段
      this.centerPoint = new Vector2(new Number(paras[1]).valueOf(), new Number(paras[2]).valueOf());
      this.majorPoint = new Vector2(new Number(paras[3]).valueOf(), new Number(paras[4]).valueOf());
      this.minorPoint = new Vector2(new Number(paras[5]).valueOf(), new Number(paras[6]).valueOf());
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

    }
    // 创建一个曲线段
    let edge = Brep2Builder.BuildEllipseEdge2FromCenterBeginEndPoint(this.centerPoint, this.majorPoint, this.minorPoint);
    let geo = BrepMeshBuilder.BuildEdge2Mesh(edge, userData.color);
    userData.original = edge;
    geo.userData = userData;
    this.results = geo;

    let alg = CurveBuilder.Algorithm2ByData(edge.curve);
    let minorPoint = alg.p(PI_2);
    this.minorPoint.set(minorPoint.x, minorPoint.y);
    this._text = paras[0] + ' ' + this.centerPoint.x + ' ' + this.centerPoint.y + ' ' + this.majorPoint.x + ' ' + this.majorPoint.y + ' ' + this.minorPoint.x + ' ' + this.minorPoint.y;

    userData.assistPoints.push({ p: this.minorPoint, c: THREE.Color.NAMES.darkblue });
    this.assists.push(this.createAssistPoint(userData.assistPoints[userData.assistPoints.length - 1]));
    Global.scene.add(this.assists[this.assists.length - 1]);

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
      let t = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray, undefined, 0);
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
      let t = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray, undefined, 0);
      t.name = "temp";
      this.tempResult = t;
      Global.scene.add(this.tempResult);
    }

  };
}
export { CreateEllipse2Com };