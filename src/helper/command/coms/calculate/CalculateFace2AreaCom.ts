import { ActionContext3D } from "../../Active";
import { Global } from "../../../../core/Global";
import type { CommandExecuter } from "../../CommandExecuter";
import { GeomType } from "../../../../core/Constents";
import { Face2 } from "../../../../geometry/data/brep/Brep2";
import { ActPickObjects } from "../../acts/ActPickObjects";
import { Command } from "../../Command";
import { Face2Algo } from "../../../../geometry/algorithm/brep/Brep2Algo";


/**
 * Calculate face area command class.
 * 
 */
class CalculateFace2AreaCom extends Command {
  result: number = 0;
  faces: Face2[];
  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
    this.faces = [];
  }
  async exec(): Promise<void> {

    this.bind(window);
    let context: ActionContext3D = new ActionContext3D(Global.scene, Global.camera, Global.renderer, Global.select);

    let act_pick_objs = new ActPickObjects();
    await act_pick_objs.execute(context);
    if (this._isCancel) { this.cancel(); return; }

    // 只能选择二维平面类型
    for (let i = 0; i < act_pick_objs.results.length; i++) {
      let geo = act_pick_objs.results[i];
      if (geo.userData.type >= GeomType.CI && geo.userData.type < GeomType.PLA) {
        let original = geo.userData.original as Face2;
        this.faces.push(original);
      }
    }

    if (this.faces.length) {
      let area = 0;
      for (let i = 0; i < this.faces.length; i++) {
        let face = this.faces[i];
        let algo = new Face2Algo(face);
        area += algo.area();
      }
      this.result = area;
      console.log('area: ', area);
      this.done();
    } else {
      this.cancel();
    }

  }
}
export { CalculateFace2AreaCom };