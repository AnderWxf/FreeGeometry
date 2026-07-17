import { GeomType } from "../../../../core/Constents";
import { Global } from "../../../../core/Global";
import { Brep2Algo, Edge2Algo } from "../../../../geometry/algorithm/brep/Brep2Algo";
import { Brep2Inter, type InterOfFace2 } from "../../../../geometry/algorithm/relation/intersection/Brep2Inter";
import type { InterOfCurve2 } from "../../../../geometry/algorithm/relation/intersection/Curve2Inter";
import type { Edge2 } from "../../../../geometry/data/brep/Brep2";
import { BrepMeshBuilder } from "../../../BrepMeshBuilder";
import { CloneUserData, type AssisPoint, type UserData } from "../../../UserData";
import { ActionContext3D } from "../../Active";
import { ActPickObjects } from "../../acts/ActPickObjects";
import { Command } from "../../Command";
import type { CommandExecuter } from "../../CommandExecuter";
import * as THREE from "three";

/**
 * Edge cutting command class.
 * 
 */
class EdgeCuttingCom extends Command {
  public src: Array<Edge2>;
  public des: Array<{ e: Edge2, u: UserData }>;
  public olds: THREE.Object3D[];
  public results: THREE.Object3D[];


  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
    this.results = [];

    this.src = [];
    this.des = [];
    this.olds = [];
  }

  async exec(): Promise<void> {
    let str = this._text;
    let paras = str.split(' ');



    this.bind(window);
    let context: ActionContext3D = new ActionContext3D(Global.scene.scene, Global.camera, Global.renderer, Global.select);

    let act_pick_objs = new ActPickObjects();
    await act_pick_objs.execute(context);
    if (this._isCancel || act_pick_objs.isCancel) { this.cancel(); return; }

    // 只能选择二维曲线类型
    for (let i = 0; i < act_pick_objs.results.length; i++) {
      let geo = act_pick_objs.results[i];
      let userData = geo.userData as UserData;
      if (userData.type < GeomType.DRAW_CURVE2_RC) {
        if (userData.type == GeomType.DRAW_CURVE2_PO || userData.type == GeomType.DRAW_CURVE2_RC) {
          let original = userData.original as Array<Edge2>;
          if (this.src.length == 0) {
            this.src.push(...original);
          } else {
            original.forEach((e: Edge2) => {
              let u: UserData = CloneUserData(userData);
              u.assistPoints = null;
              u.original = e.clone();
              this.des.push({ e: u.original, u: u });
            });

            this.olds.push(geo);
          }

        } else {
          let original = userData.original as Edge2;
          if (this.src.length == 0) {
            this.src.push(original);
          } else {
            let u: UserData = CloneUserData(userData);
            u.assistPoints = null;
            u.original = original.clone();
            this.des.push({ e: u.original, u: u });
            this.olds.push(geo);
          }
        }
      }
    }
    if (this.src.length > 0 && this.des.length > 0) {

      let edges: Array<{ e: Edge2, u: UserData }> = [];
      let sort = (a: InterOfCurve2, b: InterOfCurve2): number => {
        if (a.u1 < b.u1) {
          return -1;
        }
        if (a.u1 > b.u1) {
          return 1;
        }
        return 0;
      }
      // 每一个目标被所有的源边分割
      for (let i = 0; i < this.des.length; i++) {
        let des = this.des[i];
        let inters: Array<InterOfCurve2> = [];
        for (let j = 0; j < this.src.length; j++) {
          let src = this.src[j];
          let inter = Brep2Inter.EdgeXEdge(src, des.e, 1e-4, 1e-10);
          inters.push(...inter);
        }
        // 按照交点的U参数值，由低到高排序。
        inters.sort(sort);
        // 将目标用交点分割成若干段
        for (let j = 0; j < inters.length; j++) {
          let inter = inters[j];
          if (inter.u1 == des.e.u.x) {
            continue;
          }
          if (inter.u1 == des.e.u.y) {
            edges.push(des);
            break;
          }
          let e = des.e.clone();
          e.u.y = inter.u1;
          des.e.u.x = inter.u1;
          let u = CloneUserData(des.u);
          u.original = e;
          edges.push({ e: e, u: u });
          // 最后一个交点时补充最后一段
          if (j == inters.length - 1) {
            edges.push(des);
          }
        }
      }
      for (let i = 0; i < edges.length; i++) {
        let algo = new Edge2Algo(edges[i].e);
        let geo = BrepMeshBuilder.BuildEdge2Mesh(edges[i].e, THREE.Color.NAMES.red);
        let begin = algo.getBeginPoint();
        let end = algo.getEndPoint();
        edges[i].u.assistPoints = [];
        edges[i].u.assistPoints.push({ p: begin, c: THREE.Color.NAMES.blue });
        edges[i].u.assistPoints.push({ p: end, c: THREE.Color.NAMES.blue });
        geo.userData = edges[i].u as UserData;
        edges[i].u.assistPoints.forEach((a: AssisPoint) => {
          geo.children.push(this.createAssistPoint(a));
        });
        this.results.push(geo);
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
    Global.scene.remove(...this.olds);
    Global.scene.add(...this.results);
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
      if (this.olds.length > 0) Global.scene.add(...this.olds);
      if (this.results.length > 0) Global.scene.remove(...this.results);
    }
  }
  override redo() {
    if (this._isDone) {
      if (this.olds.length > 0) Global.scene.remove(...this.olds);
      if (this.results.length > 0) Global.scene.add(...this.results);
    }
  }
}
export { EdgeCuttingCom };