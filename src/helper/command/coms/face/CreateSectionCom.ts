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
import { CreateGeomUserData, type UserData } from "../../../UserData";
import { CreateFaceCom } from "./CreateFaceCom";


/**
 * Create command class.
 * 格式：命令类型 n0 n1 uuide0 uuide1 uuide2 uuide3... uuidf0 uuidf1...
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
    let n0 = 0;
    let n1 = 0;
    if (paras.length >= 3) {
      n0 = new Number(paras[1]).valueOf();
      n1 = new Number(paras[2]).valueOf();
    }
    // 指定了对象
    if (n0 > 0) {
      let objs = Global.scene.getObjectsByUUIDs(paras.slice(3, 3 + n0));
      if (objs.length > 0) {
        for (let i = 0; i < objs.length; i++) {
          let userData = objs[i].userData as UserData;
          if (userData.original instanceof Edge2) {
            edges.push(userData.original);
          }
          if (userData.original instanceof Array
            && userData.original[0] instanceof Edge2
          ) {
            edges.push(...(userData.original as Edge2[]));
          }
        }
      }
    }
    // 寻找已经选好的目标
    else if (Global.select.selectedObjects.length > 0) {
      for (let i = 0; i < Global.select.selectedObjects.length; i++) {
        let select = Global.select.selectedObjects[i];
        let userData = select.userData as UserData;
        if (userData.original instanceof Edge2) {
          edges.push(userData.original);
        }
        if (userData.original instanceof Array
          && userData.original[0] instanceof Edge2) {
          edges.push(...(userData.original as Edge2[]));
        }
      }
    }

    this.bind(window);
    let context: ActionContext3D = new ActionContext3D(Global.scene.scene, Global.camera, Global.renderer, Global.select);
    if (edges.length == 0) {
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
    }
    if (edges.length) {
      for (let i = 0; i < edges.length; i++) {
        edges[i] = edges[i].clone();
      }
      n0 = edges.length;
      userData.color = THREE.Color.NAMES.blue;
      let faces = Brep2Builder.BuildFacesByEdges(edges, 1e-4, 1e-10);
      if (n1 > 0) {
        for (let i = 0; i < n1; i++) {
          faces[i].uuid = paras[3 + n0 + i];
        }
      }
      n1 = faces.length;
      let geo = BrepMeshBuilder.BuildFace2sMesh(faces, userData.color);
      userData.original = faces;
      geo.userData = userData;
      this.results = geo;

      this._text = paras[0] + ' ' + n0 + ' ' + n1;
      for (let i = 0; i < edges.length; i++) {
        this._text += ' ' + edges[i].uuid;
      }
      for (let i = 0; i < faces.length; i++) {
        this._text += ' ' + faces[i].uuid
      }

      this.done();
    } else {
      this.cancel();
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