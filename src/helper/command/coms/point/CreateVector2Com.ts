import * as THREE from "three";
import { ComCreate } from "../ComCreate";
import { ActionContext3D } from "../../Active";
import { Global } from "../../../../core/Global";
import { ActPickPoint2 } from "../../acts/ActPickPoint2";
import { Vector2 } from "../../../../math/Math";
import type { CommandExecuter } from "../../CommandExecuter";
import { GeomType } from "../../../../core/Constents";
import { CreateGeomUserData } from "../../../UserData";


/**
 * Create command class.
 * 
 */
class CreateVector2Com extends ComCreate {
  point: Vector2;
  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
    this.type = GeomType.MATH_VECTOR2;
  }
  async exec(): Promise<void> {
    let str = this._text;
    let paras = str.split(' ');
    let userData = CreateGeomUserData(this.type);
    if (paras.length == 7) {
      // 创建一个点
      this.point = new Vector2(new Number(paras[1]).valueOf(), new Number(paras[2]).valueOf());
    } else {
      this.bind(window);
      let context: ActionContext3D = new ActionContext3D(Global.scene.scene, Global.camera, Global.renderer, Global.select);

      let act_pick_point = new ActPickPoint2();
      await act_pick_point.execute(context);
      if (this._isCancel || act_pick_point.isCancel) { this.cancel(); return; }
      this.point = new Vector2(act_pick_point.result.x, act_pick_point.result.y);

    }
    // 创建一个点
    userData.color = THREE.Color.NAMES.greenyellow;
    userData.original = this.point;
    let geo = this.createAssistPoint({ p: this.point, c: userData.color });
    geo.userData = userData;
    this.results = geo;
    this.done();
  }

}
export { CreateVector2Com };