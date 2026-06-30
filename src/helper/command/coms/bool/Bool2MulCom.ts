import { GeomType } from "../../../../core/Constents";
import { Global } from "../../../../core/Global";
import { Face2 } from "../../../../geometry/data/brep/Brep2";
import { BrepMeshBuilder } from "../../../BrepMeshBuilder";
import { CreateGeomUserData, type UserData } from "../../../UserData";
import { ActionContext3D } from "../../Active";
import { ActPickObjects } from "../../acts/ActPickObjects";
import type { CommandExecuter } from "../../CommandExecuter";
import * as THREE from "three";
import { BoolCom } from "./BoolCom";

/**
 * Bool command class.
 * 
 */
class Bool2MulCom extends BoolCom {
  protected src: Face2[];
  protected des: Face2[];

  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
    this.src = [];
    this.des = [];
  }

  async exec(): Promise<void> {
    let str = this._text;
    let paras = str.split(' ');

    this.bind(window);
    let context: ActionContext3D = new ActionContext3D(Global.scene.scene, Global.camera, Global.renderer, Global.select);
    // 选择源
    let act_pick_objs_sec = new ActPickObjects();
    await act_pick_objs_sec.execute(context);
    if (this._isCancel || act_pick_objs_sec.isCancel) { this.cancel(); return; }

    // 只能选择二维平面类型
    for (let i = 0; i < act_pick_objs_sec.results.length; i++) {
      let geo = act_pick_objs_sec.results[i];
      let userData = geo.userData as UserData;
      if (userData.type >= GeomType.DRAW_SURFACE_CI && userData.type < GeomType.DRAW_SURFACE_PLA) {
        if (userData.original instanceof Face2) {
          let original = userData.original as Face2;
          this.src.push(original);
          this.olds.push(geo);
        }
        if (userData.original instanceof Array) {
          for (let j = 0; j < userData.original.length; j++) {
            if (userData.original[j] instanceof Face2) {
              let original = userData.original[j] as Face2;
              this.src.push(original);
            }
          }
          this.olds.push(geo);
        }
      }
    }

    // 选择目标
    let act_pick_objs_des = new ActPickObjects();
    await act_pick_objs_des.execute(context);
    if (this._isCancel || act_pick_objs_des.isCancel) { this.cancel(); return; }

    // 只能选择二维平面类型
    for (let i = 0; i < act_pick_objs_des.results.length; i++) {
      let geo = act_pick_objs_des.results[i];
      let userData = geo.userData as UserData;
      if (userData.type >= GeomType.DRAW_SURFACE_CI && userData.type < GeomType.DRAW_SURFACE_PLA) {
        if (userData.original instanceof Face2) {
          let original = userData.original as Face2;
          this.des.push(original);
          this.olds.push(geo);
        }
        if (userData.original instanceof Array) {
          for (let j = 0; j < userData.original.length; j++) {
            if (userData.original[j] instanceof Face2) {
              let original = userData.original[j] as Face2;
              this.des.push(original);
            }
          }
          this.olds.push(geo);
        }
      }
    }

    if (this.src.length && this.des.length) {
      if (this.src.length === 0 || this.des.length === 0) {
        this.cancel();
        return;
      }
      let faces: Face2[] = this.execute();
      let userData = CreateGeomUserData(GeomType.DRAW_SURFACE_SEC);
      userData.color = THREE.Color.NAMES.blue;
      let geo = BrepMeshBuilder.BuildFace2sMesh(faces, userData.color);
      userData.original = faces;
      geo.userData = userData;
      this.results.push(geo);

      this.done();
    } else {
      this.cancel();
    }
  }

  execute(): Face2[] {
    return [];
  }
}
export { Bool2MulCom };