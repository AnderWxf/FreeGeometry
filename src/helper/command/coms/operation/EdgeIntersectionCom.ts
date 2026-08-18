import { GeomType } from "../../../../core/Constents";
import { Global } from "../../../../core/Global";
import { Brep2Inter, type InterOfFace2 } from "../../../../geometry/algorithm/relation/intersection/Brep2Inter";
import type { InterOfCurve2 } from "../../../../geometry/algorithm/relation/intersection/Curve2Inter";
import { Point2Data } from "../../../../geometry/data/base/Point2Data";
import type { Edge2 } from "../../../../geometry/data/brep/Brep2";
import { DataBase } from "../../../../geometry/data/DataBase";
import type { UserData } from "../../../UserData";
import { ActionContext3D } from "../../Active";
import { ActPickObjects } from "../../acts/ActPickObjects";
import { Command } from "../../Command";
import type { CommandExecuter } from "../../CommandExecuter";
import * as THREE from "three";

/**
 * Edge intersection computing command class.
 * 命令类型 n0 n1 uuide0 uuide1 ... uuidp0 uuidp1 ...
 */
class EdgeIntersectionCom extends Command {
  public src: Array<Edge2>;
  public des: Array<Edge2>;
  public results: InterOfFace2[];
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
    let paras = str.split(' ');
    this.bind(window);
    let selects: Array<THREE.Object3D> = [];
    let n0 = 0;
    let n1 = 0;
    if (paras.length > 3) {
      n0 = new Number(paras[1]).valueOf();
      n1 = new Number(paras[2]).valueOf();
      selects = Global.scene.getObjectsByUUIDs(paras.slice(3, 3 + n0));
    } else {
      let context: ActionContext3D = new ActionContext3D(Global.scene.scene, Global.camera, Global.renderer, Global.select);

      if (context.select.selectedObjects.length) {
        selects = context.select.selectedObjects;
      } else {
        let act_pick_objs = new ActPickObjects();
        await act_pick_objs.execute(context);
        if (this._isCancel || act_pick_objs.isCancel) { this.cancel(); return; }
        selects = act_pick_objs.results;
      }
    }

    // 只能选择二维曲线类型
    for (let i = 0; i < selects.length; i++) {
      let geo = selects[i];
      if (geo.userData.type < GeomType.DRAW_CURVE2_RC) {
        if (geo.userData.type == GeomType.DRAW_CURVE2_PO || geo.userData.type == GeomType.DRAW_CURVE2_RC) {
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
          let point = this.results[i].is[j].p;
          let geo = this.createAssistPoint({ p: point, c: THREE.Color.NAMES.blue }, false)
          geo.userData.type = GeomType.DATA_TYPE_POINT2;
          geo.userData.original = new Point2Data(point.clone());
          if (n1 > 0) { 
            geo.userData.original.uuid = paras[3 + n0 + this.assists.length];
          }
          this.assists.push(geo);
        }
      }
      for (let i = 0; i < this.assists.length; i++) {
        this.assists[i].visible = true;
      }

      n0 = this.src.length + this.des.length;
      n1 = this.assists.length;
      this._text = paras[0] + ' ' + n0 + ' ' + n1;

      for (let i = 0; i < this.src.length; i++) {
        this._text += ' ' + this.src[i].uuid;
      }
      for (let i = 0; i < this.des.length; i++) {
        this._text += ' ' + this.des[i].uuid;
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