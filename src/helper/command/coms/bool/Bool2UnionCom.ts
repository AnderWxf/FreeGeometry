import { GeomType } from "../../../../core/Constents";
import { Global } from "../../../../core/Global";
import { Bool2 } from "../../../../geometry/algorithm/relation/bool/Bool2";
import type { Face2 } from "../../../../geometry/data/brep/Brep2";
import { BrepMeshBuilder } from "../../../BrepMeshBuilder";
import { CreateGeomUserData, type UserData } from "../../../UserData";
import { ActionContext3D } from "../../Active";
import { ActPickObject } from "../../acts/ActPickObject";
import type { CommandExecuter } from "../../CommandExecuter";
import * as THREE from "three";
import { BoolCom } from "./BoolCom";
import { ActPickObjects } from "../../acts/ActPickObjects";

/**
 * Bool 2 union command class.
 * 
 */
class Bool2UnionCom extends BoolCom {
  private src: Face2;
  private des: Face2;

  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
  }

  async exec(): Promise<void> {
    let str = this._text;
    let paras = str.split(' ');

    this.bind(window);
    let context: ActionContext3D = new ActionContext3D(Global.scene, Global.camera, Global.renderer, Global.select);
    let act_pick_objs = new ActPickObjects();
    await act_pick_objs.execute(context);
    if (this._isCancel || act_pick_objs.isCancel) { this.cancel(); return; }

    // 只能选择二维平面类型
    for (let i = 0; i < act_pick_objs.results.length; i++) {
      let geo = act_pick_objs.results[i];
      let userData = geo.userData as UserData;
      if (userData.type >= GeomType.CI && userData.type < GeomType.PLA) {
        let original = userData.original as Face2;
        // 选择第一个Face
        if (!this.src) {
          this.src = original;
          this.olds.push(geo);
        }
        // 选择第二个Face
        else if (!this.des) {
          this.des = original;
          this.olds.push(geo);
        }
        if (this.src && this.des) {
          break;
        }
      }
    }

    if (this.src && this.des) {
      let rets = Bool2.Union(this.src, this.des, 1e-4, 1e-10);
      for (let i = 0; i < rets.length; i++) {
        let face = rets[i];
        let geo = BrepMeshBuilder.BuildFace2Mesh(face, THREE.Color.NAMES.blue);
        let userData = CreateGeomUserData(GeomType.SEC);
        userData.original = face;
        geo.userData = userData;
        this.results.push(geo);
      }
      this.done();
    } else {
      this.cancel();
    }
  }

}
export { Bool2UnionCom };