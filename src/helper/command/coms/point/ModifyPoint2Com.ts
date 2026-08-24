import * as THREE from "three";
import { ActionContext3D } from "../../Active";
import { Global } from "../../../../core/Global";
import { ActPickPoint2 } from "../../acts/ActPickPoint2";
import { Vector2 } from "../../../../math/Math";
import type { CommandExecuter } from "../../CommandExecuter";
import { GeomType } from "../../../../core/Constents";
import { ComModify } from "../ComModify";
import { ActPickObject } from "../../acts/ActPickObject";
import { CopyUserData, CreateGeomUserData, type UserData } from "../../../UserData";
import { Point2Data } from "../../../../geometry/data/base/Point2Data";


/**
 * Modify command class.
 * 格式：命令类型 uuid point.x point.y 
 */
class ModifyPoint2Com extends ComModify {
  point: Vector2;
  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
    this.type = GeomType.DATA_TYPE_POINT2;
  }
  async exec(): Promise<void> {
    let str = this._text;
    let paras = str.split(' ');
    let userData = CreateGeomUserData(this.type);

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

    if (paras.length >= 4) {
      this.point = new Vector2(new Number(paras[2]).valueOf(), new Number(paras[3]).valueOf());
    } else {
      let act_pick_point = new ActPickPoint2();
      await act_pick_point.execute(context);
      if (this._isCancel || act_pick_point.isCancel) { this.cancel(); return; }
      this.point = new Vector2(act_pick_point.result.x, act_pick_point.result.y);
    }

    // 创建一个点
    let p = new Point2Data(this.point.clone());
    userData.color = THREE.Color.NAMES.greenyellow;
    userData.original = p;
    let geo = this.createAssistPoint({ p: this.point, c: userData.color }, false);
    geo.userData = userData;
    geo.visible = true;
    this.results = geo;

    this._text = paras[0]
      + ' ' + p.uuid
      + ' ' + p.pos.x + ' ' + p.pos.y;

    this.done();
  }
  onMouseMoveExec(event: MouseEvent) {
    if (this._isCancel) { this.cancel(); return; }

    if (this.old) {
      if (this.tempResult) {
        Global.scene.remove(this.tempResult);
      }
      let point = new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y);
      let t = this.createAssistPoint({ p: point, c: THREE.Color.NAMES.gray }, false);
      // 创建一个临时点
      t.name = "temp";
      this.tempResult = t;
      Global.scene.add(this.tempResult);
    }
  };



}
export { ModifyPoint2Com };