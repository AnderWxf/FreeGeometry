import * as THREE from "three";
import { ComCreate } from "../ComCreate";
import { ActionContext3D } from "../../Active";
import { Global } from "../../../../core/Global";
import { Brep2Builder } from "../../../../geometry/algorithm/builder/Brep2Builder";
import { Vector2 } from "../../../../math/Math";
import { BrepMeshBuilder } from "../../../BrepMeshBuilder";
import type { CommandExecuter } from "../../CommandExecuter";
import { GeomType } from "../../../../core/Constents";
import { Coedge2, Edge2, Face2, Vertice2 } from "../../../../geometry/data/brep/Brep2";
import { ActPickObjects } from "../../acts/ActPickObjects";
import { CreateGeomUserData } from "../../../UserData";


/**
 * Calculate body volume command class. TODO
 * 
 */
class CalculateBody3VolumeCom extends ComCreate {
  edges: Edge2[];
  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
    this.edges = [];
    this.type = GeomType.SEC;
  }
  async exec(): Promise<void> {
    let str = this._text;
    let paras = str.split(' ');
    let userData = CreateGeomUserData(this.type);

    if (paras.length > 5) {
      // 创建一个面
      let points: Vector2[] = [];
      for (let i = 1; i < paras.length; i++) {
        let point = new Vector2(new Number(paras[i]).valueOf(), new Number(paras[i + 1]).valueOf());
        points.push(point);
      }

      this._text = paras[0];
      // 创建一个面
      if (points.length > 3) {
        let face = new Face2();
        for (let i = 0; i < points.length; i++) {
          face.vertice2s.push(new Vertice2());
        }
        for (let i = 0; i < points.length; i++) {
          let b = points[i];
          let e = points[(i + 1) % points.length];
          let edge = Brep2Builder.BuildLineEdge2FromBeginEndPoint(b, e);
          edge.v0 = face.vertice2s[i];
          edge.v1 = face.vertice2s[(i + 1) % points.length];
          let coedge = new Coedge2();
          coedge.e = edge;
          face.border.coedges.push(coedge);
          face.curves.push(edge.curve);
        }

        let geo = BrepMeshBuilder.BuildFace2Mesh(face, THREE.Color.NAMES.blue);
        userData.original = face;
        geo.userData = userData;
        this.results = geo;
        this.done();
      } else {
        this.cancel();
      }
    } else {
      this.bind(window);
      let context: ActionContext3D = new ActionContext3D(Global.scene.scene, Global.camera, Global.renderer, Global.select);

      let act_pick_objs = new ActPickObjects();
      await act_pick_objs.execute(context);
      if (this._isCancel || act_pick_objs.isCancel) { this.cancel(); return; }

      // 只能选择二维曲线类型
      for (let i = 0; i < act_pick_objs.results.length; i++) {
        let geo = act_pick_objs.results[i];
        if (geo.userData.type < GeomType.CI) {
          if (geo.userData.type == GeomType.PO || geo.userData.type == GeomType.RC) {
            let original = geo.userData.original as Array<Edge2>;
            this.edges.push(...original);
          } else {
            this.edges.push(geo.userData.original as Edge2);
          }
        }
      }

      if (this.edges.length) {
        let face = new Face2();
        for (let i = 0; i < this.edges.length; i++) {
          face.vertice2s.push(new Vertice2());
        }
        for (let i = 0; i < this.edges.length; i++) {
          let edge = this.edges[i].clone();
          edge.v0 = face.vertice2s[i];
          edge.v1 = face.vertice2s[(i + 1) % this.edges.length];
          let coedge = new Coedge2();
          coedge.e = edge;
          face.border.coedges.push(coedge);
          face.curves.push(edge.curve);
          edge.curve = null;
          edge.curveIndex = i;
        }
        let geo = BrepMeshBuilder.BuildFace2Mesh(face, THREE.Color.NAMES.blue);
        userData.original = face;
        geo.userData = userData;
        this.results = geo;
        this.done();
      } else {
        this.cancel();
      }
    }
  }

  // override onKeyDownExec(event: KeyboardEvent) {
  //     super.onKeyDownExec(event);
  //     switch (event.code) {
  //         case "Enter":
  //             this._isDone = true;
  //             break;
  //     }
  // }
}
export { CalculateBody3VolumeCom };