import { ActionContext3D } from "../../Active";
import { Global } from "../../../../core/Global";
import type { CommandExecuter } from "../../CommandExecuter";
import { GeomType } from "../../../../core/Constents";
import { Face2 } from "../../../../geometry/data/brep/Brep2";
import { Command } from "../../Command";
import { Face2Algo } from "../../../../geometry/algorithm/brep/Brep2Algo";
import { ActPickObject } from "../../acts/ActPickObject";
import { ActPickPoint2 } from "../../acts/ActPickPoint2";
import { Vector2 } from "../../../../math/Math";


/**
 * Calculate point face2 relation command class.
 * 
 */
class CalculatePointFace2Com extends Command {
  public results: string;
  face: Face2;
  algo: Face2Algo;
  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
  }
  async exec(): Promise<void> {

    this.bind(window);
    let context: ActionContext3D = new ActionContext3D(Global.scene.scene, Global.camera, Global.renderer, Global.select);

    while (!this.face) {
      let act_pick_obj = new ActPickObject();
      await act_pick_obj.execute(context);
      if (this._isCancel || act_pick_obj.isCancel) { this.cancel(); return; }

      // 只能选择二维面类型
      if (act_pick_obj.result) {
        let geo = act_pick_obj.result;
        if (geo.userData.type >= GeomType.DRAW_SURFACE_CI && geo.userData.type < GeomType.DRAW_SURFACE_PLA) {
          if (geo.userData.original instanceof Face2) {
            let original = geo.userData.original as Face2;
            this.face = original;
          }
          if (geo.userData.original instanceof Array) {
            let original = geo.userData.original[0] as Face2;
            this.face = original;
          }
        }
      }
    }
    this.algo = new Face2Algo(this.face);
    let act_pick_point = new ActPickPoint2();
    await act_pick_point.execute(context);
    if (this._isCancel || act_pick_point.isCancel) { this.cancel(); return; }
    let point = new Vector2(act_pick_point.result.x, act_pick_point.result.y);


    let isAtInner = this.algo.isPointAtInner(point, 1e-4, 1e-10);
    let isAtBoder = this.algo.isPointAtBoder(point, 1e-4, 1e-10);
    let isAtOn = this.algo.isPointOn(point, 1e-4, 1e-10);

    this.results = '';
    this.results += ' ' + (isAtInner ? 'ai' : '!ai');
    this.results += ' ' + (isAtBoder ? 'ab' : '!ab');
    this.results += ' ' + (isAtOn ? 'ao' : '!ao');

    console.log('p: ', this.results);
    this.done();
  }

  override onMouseMoveExec(event: MouseEvent) {
    if (this._isCancel) { this.cancel(); return; }
    if (this.algo) {
      let point: Vector2 = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);

      let isAtInner = this.algo.isPointAtInner(point, 1e-4, 1e-10);
      let isAtBoder = this.algo.isPointAtBoder(point, 1e-4, 1e-10);
      let isAtOn = this.algo.isPointOn(point, 1e-4, 1e-10);

      this.results = '';
      this.results += ' ' + (isAtInner ? 'ai' : '!ai');
      this.results += ' ' + (isAtBoder ? 'ab' : '!ab');
      this.results += ' ' + (isAtOn ? 'ao' : '!ao');

      const states = document.getElementById('states');
      if (states) {
        states.textContent += ' p: ' + this.results;
      }
    }
  };
}
export { CalculatePointFace2Com };