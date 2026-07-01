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
import { CreateFaceCom } from "./CreateFaceCom";


/**
 * Create command class.
 * 
 */
class CreateSectionCom extends CreateFaceCom {

  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
    this.type = GeomType.DRAW_SURFACE_SEC;
  }
  async exec(): Promise<void> {
    let str = this._text;
    let paras = str.split(' ');
    let userData = CreateGeomUserData(this.type);
    let edges: Edge2[] = [];
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
          face.vertices.push(new Vertice2());
        }
        for (let i = 0; i < points.length; i++) {
          let b = points[i];
          let e = points[(i + 1) % points.length];
          let edge = Brep2Builder.BuildLineEdge2FromBeginEndPoint(b, e);
          edge.v0 = face.vertices[i];
          edge.v1 = face.vertices[(i + 1) % points.length];
          edges.push(edge);
          let coedge = new Coedge2();
          coedge.e = edge;
          face.border.coedges.push(coedge);
          face.curves.push(edge.curve);
        }

        userData.color = THREE.Color.NAMES.blue;
        let geo = BrepMeshBuilder.BuildFace2Mesh(face, userData.color);
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
        if (geo.userData.type < GeomType.DRAW_SURFACE_CI) {
          if (geo.userData.type == GeomType.DRAW_CURVE2_PO || geo.userData.type == GeomType.DRAW_CURVE2_RC) {
            let original = geo.userData.original as Array<Edge2>;
            edges.push(...original);
          } else {
            edges.push(geo.userData.original as Edge2);
          }
        }
      }

      if (edges.length) {
        for (let i = 0; i < edges.length; i++) {
          edges[i] = edges[i].clone();
        }
        userData.color = THREE.Color.NAMES.blue;
        if (act_pick_objs.results.length == 1) {
            let face = this.createFace(edges);
          let geo = BrepMeshBuilder.BuildFace2Mesh(face, userData.color);
          userData.original = face;
          geo.userData = userData;
          this.results = geo;
        }
        if (act_pick_objs.results.length > 1) {
          let faces = this.createFaces(edges, 1e-4, 1e-10);
          let geo = BrepMeshBuilder.BuildFace2sMesh(faces, userData.color);
          userData.original = faces;
          geo.userData = userData;
          this.results = geo;
        }
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
export { CreateSectionCom };