import { ActionContext3D } from "../../Active";
import { Global } from "../../../../core/Global";
import type { CommandExecuter } from "../../CommandExecuter";
import { GeomType } from "../../../../core/Constents";
import { Edge2, Face2 } from "../../../../geometry/data/brep/Brep2";
import { ActPickObjects } from "../../acts/ActPickObjects";
import { Command } from "../../Command";
import { Edge2Algo, Face2Algo } from "../../../../geometry/algorithm/brep/Brep2Algo";
import { ActPickObject } from "../../acts/ActPickObject";
import { ActPickPoint2 } from "../../acts/ActPickPoint2";
import { Vector2 } from "../../../../math/Math";


/**
 * Calculate curv2 g command class.
 * 
 */
class CalculateCurve2GCom extends Command {
  public results: number = 0;
  edge: Edge2;
  algo: Edge2Algo;
  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
  }
  async exec(): Promise<void> {

    this.bind(window);
    let context: ActionContext3D = new ActionContext3D(Global.scene.scene, Global.camera, Global.renderer, Global.select);

    while (!this.edge) {
      let act_pick_obj = new ActPickObject();
      await act_pick_obj.execute(context);
      if (this._isCancel || act_pick_obj.isCancel) { this.cancel(); return; }

      // 只能选择二维边类型
      if (act_pick_obj.result) {
        let geo = act_pick_obj.result;
        if (geo.userData.type >= GeomType.DRAW_CURVE2_L && geo.userData.type < GeomType.DRAW_SURFACE_CI) {
          if (geo.userData.type != GeomType.DRAW_CURVE2_PO
            && geo.userData.type != GeomType.DRAW_CURVE2_RC
          ) {
            if (geo.userData.original instanceof Edge2) {
              let original = geo.userData.original as Edge2;
              this.edge = original;
            }
          }
        }
      }
    }
    this.algo = new Edge2Algo(this.edge);
    let act_pick_point = new ActPickPoint2();
    await act_pick_point.execute(context);
    if (this._isCancel || act_pick_point.isCancel) { this.cancel(); return; }
    let point = new Vector2(act_pick_point.result.x, act_pick_point.result.y);
    this.results = this.algo.gf(point)
    console.log('u: ', this.results);
    this.done();
  }

  override onMouseMoveExec(event: MouseEvent) {
    if (this._isCancel) { this.cancel(); return; }
    if (this.algo) {
      let point: Vector2 = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
      let g = this.algo.gf(point);
      const states = document.getElementById('states');
      if (states) {
        states.textContent += ' g: ' + g;
      }
    }
  };
}
export { CalculateCurve2GCom };