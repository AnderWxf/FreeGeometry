import { GeomType } from "../../../../core/Constents";
import { Global } from "../../../../core/Global";
import { Brep2Inter, type InterOfFace2 } from "../../../../geometry/algorithm/relation/intersection/Brep2Inter";
import type { InterOfCurve2 } from "../../../../geometry/algorithm/relation/intersection/Curve2Inter";
import type { Edge2 } from "../../../../geometry/data/brep/Brep2";
import { ActionContext3D } from "../../Active";
import { ActPickObjects } from "../../acts/ActPickObjects";
import { Command } from "../../Command";
import type { CommandExecuter } from "../../CommandExecuter";
import * as THREE from "three";

/**
 * Edge intersection computing command class.
 * 
 */
class EdgeIntersectionCom extends Command {
  public src: Array<Edge2>;
  public des: Array<Edge2>;
  protected results: InterOfFace2[];
  protected assists: THREE.Object3D[];

  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
    this.results = [];
    this.assists = [];
    this.src = [];
    this.des = [];
  }

  async exec(): Promise<void> {
    let str = this._text;



    this.bind(window);
    let context: ActionContext3D = new ActionContext3D(Global.scene, Global.camera, Global.renderer, Global.select);

    let act_pick_objs = new ActPickObjects();
    await act_pick_objs.execute(context);
    if (this._isCancel || act_pick_objs.isCancel) { this.cancel(); return; }

    // 只能选择二维曲线类型
    for (let i = 0; i < act_pick_objs.results.length; i++) {
      let geo = act_pick_objs.results[i];
      if (geo.userData.type < GeomType.RC) {
        if (geo.userData.type == GeomType.PO || geo.userData.type == GeomType.RC) {
          let original = geo.userData.original as Array<Edge2>;
          if (this.src.length == 0) {
            this.src.push(...original);
          } else {
            this.des.push(...original);
          }

        } else {
          let original = geo.userData.original as Edge2;
          if (this.src.length == 0) {
            this.src.push(original);
          } else {
            this.des.push(original);
          }
        }
      }
    }
    if (this.src.length > 0 && this.des.length > 0) {
      for (let i = 0; i < this.src.length; i++) {
        let src = this.src[i];
        for (let j = 0; j < this.des.length; j++) {
          let des = this.des[j];
          let inter = Brep2Inter.EdgeXEdge(src, des, 1e-4, 1e-10);
          this.results.push({ is: inter, c0: src.curve, c1: des.curve });
        }
      }
      for (let i = 0; i < this.results.length; i++) {
        for (let j = 0; j < this.results[i].is.length; j++) {
          this.assists.push(this.createAssistPoint({ p: this.results[i].is[j].p, c: THREE.Color.NAMES.blue }));
        }
      }
      this.done();
    } else {
      this.cancel();
    }
  }

  onMouseMoveExec(event: MouseEvent) {
  };

  override cancel() {
    super.cancel();
    this.unbind(window);

    this.results = null;
  }

  override done() {
    super.done();
    this.unbind(window);
    Global.scene.add(...this.assists);
    Global.select.clear();
  }
  override bind(window: Window) {
    super.bind(window);
    window.addEventListener("mousemove", this.onMouseMove);
  }
  override unbind(window: Window) {
    super.unbind(window);
    window.removeEventListener("mousemove", this.onMouseMove);
  }
  override undo() {
    if (this._isDone) {
      Global.scene.remove(...this.assists);
    }
  }
  override redo() {
    if (this._isDone) {
      Global.scene.add(...this.assists);
    }
  }
}
export { EdgeIntersectionCom };