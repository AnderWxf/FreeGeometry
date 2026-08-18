import { ActionContext3D } from "../../Active";
import { Global } from "../../../../core/Global";
import type { CommandExecuter } from "../../CommandExecuter";
import { GeomType } from "../../../../core/Constents";
import { Edge2, Face2 } from "../../../../geometry/data/brep/Brep2";
import { ActPickObjects } from "../../acts/ActPickObjects";
import { Command } from "../../Command";
import { Face2Algo } from "../../../../geometry/algorithm/brep/Brep2Algo";
import type { UserData } from "../../../UserData";


/**
 * Measure face area command class.
 * 命令类型 uuid0 uuid1 uuid2...
 */
class MeasureFace2AreaCom extends Command {
  public results: number = 0;
  faces: Face2[];
  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
    this.faces = [];
  }
  async exec(): Promise<void> {
    let str = this._text;
    let paras = str.split(' ');
    if (paras.length >= 2) {
      let objs = Global.scene.getObjectsByUUIDs(paras.slice(1));
      if (objs.length > 0) {
        for (let i = 0; i < objs.length; i++) {
          let userData = objs[i].userData as UserData;
          if (userData.original instanceof Face2) {
            this.faces.push(userData.original);
          }
          if (userData.original instanceof Array
            && userData.original[0] instanceof Face2
          ) {
            this.faces.push(...(userData.original as Face2[]));
          }
        }
      }
    }
    // 寻找已经选好的目标
    else if (Global.select.selectedObjects.length > 0) {
      for (let i = 0; i < Global.select.selectedObjects.length; i++) {
        let select = Global.select.selectedObjects[i];
        let userData = select.userData as UserData;
        if (userData.original instanceof Face2) {
          this.faces.push(userData.original);
        }
        if (userData.original instanceof Array
          && userData.original[0] instanceof Face2) {
          this.faces.push(...(userData.original as Face2[]));
        }
      }
    }

    this.bind(window);
    let context: ActionContext3D = new ActionContext3D(Global.scene.scene, Global.camera, Global.renderer, Global.select);
    if (this.faces.length == 0) {
      let act_pick_objs = new ActPickObjects();
      await act_pick_objs.execute(context);
      if (this._isCancel || act_pick_objs.isCancel) { this.cancel(); return; }

      // 只能选择二维平面类型
      for (let i = 0; i < act_pick_objs.results.length; i++) {
        let geo = act_pick_objs.results[i];
        if (geo.userData.type >= GeomType.DRAW_SURFACE_CI && geo.userData.type < GeomType.DRAW_SURFACE_PLA) {
          if (geo.userData.original instanceof Face2) {
            let original = geo.userData.original as Face2;
            this.faces.push(original);
          }
          if (geo.userData.original instanceof Array) {
            let originals = geo.userData.original as Face2[];
            this.faces.push(...originals);
          }
        }
      }
    }

    if (this.faces.length) {
      let area = 0;
      for (let i = 0; i < this.faces.length; i++) {
        let face = this.faces[i];
        let algo = new Face2Algo(face);
        area += algo.area();
      }
      this.results = area;
      console.log('area: ', area);

      this._text = paras[0];
      for (let i = 0; i < this.faces.length; i++) {
        this._text += ' ' + this.faces[i].uuid;
      }

      this.done();
    } else {
      this.cancel();
    }

  }
}
export { MeasureFace2AreaCom };