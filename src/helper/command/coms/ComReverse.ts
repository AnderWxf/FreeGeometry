import { GeomType } from "../../../core/Constents";
import { Global } from "../../../core/Global";
import { Edge2, Face2 } from "../../../geometry/data/brep/Brep2";
import { BrepMeshBuilder } from "../../BrepMeshBuilder";
import { CloneUserData, type UserData } from "../../UserData";
import { ActionContext3D } from "../Active";
import { ActPickObject } from "../acts/ActPickObject";
import * as THREE from "three";
import { ComBatch } from "./ComBatch";
import { DataBase } from "../../../geometry/data/DataBase";

/**
 * Reverse command class.
 * 格式：命令类型 uuid0 uuid1...
 */
class ComReverse extends ComBatch {
  override async exec(): Promise<void> {

    let str = this._text;
    let paras = str.split(' ');

    if (paras.length >= 2) {
      let objs = Global.scene.getObjectsByUUIDs(paras.slice(1));
      this.olds.push(...objs);

    } else {
      this.bind(window);
      if (Global.select.selectedObjects.length > 0) {
        let objs = Global.select.selectedObjects;
        for (let i = 0; i < objs.length; i++) {
          let userData = objs[i].userData as UserData;
          if (userData.original instanceof Edge2
            || userData.original instanceof Face2) {
            this.olds.push(objs[i]);
          }
          else if (userData.original instanceof Array) {
            if (userData.original[0] instanceof Edge2
              || userData.original[0] instanceof Face2) {
              this.olds.push(objs[i]);
            }
          }
        }
      }
      if (this.olds.length == 0) {
        let context: ActionContext3D = new ActionContext3D(Global.scene.scene, Global.camera, Global.renderer, Global.select);
        if (context.select.selectedObjects.length == 0) {
          let act_pick_data = new ActPickObject();
          await act_pick_data.execute(context);
          if (this._isCancel || act_pick_data.isCancel) { this.cancel(); return; }
          while (!act_pick_data.result.userData) {
            await act_pick_data.execute(context);
            if (this._isCancel || act_pick_data.isCancel) { this.cancel(); return; }
          }
          this.olds.push(act_pick_data.result);
        } else {
          this.olds.push(...context.select.selectedObjects);
        }
      }
    }

    // 翻转
    for (let i = 0; i < this.olds.length; i++) {
      let old = this.olds[i];
      let userData = CloneUserData(old.userData as UserData);
      // 线
      if (old.userData.type < GeomType.DRAW_SURFACE_CI) {
        // 数组
        if (old.userData.original instanceof Array) {
          let array = old.userData.original as Array<any>;
          let edges: Edge2[] = [];
          for (let i = 0; i < array.length; i++) {
            if (array[i] instanceof Edge2) {
              let edge = (array[i] as Edge2).clone();
              let t = edge.u.x; edge.u.x = edge.u.y; edge.u.y = t;
              edges.push(edge);
            }
          }
          userData.original = edges;
          let geo = BrepMeshBuilder.BuildEdge2sMesh(edges, userData.color);
          if (userData.assistPoints) {
            userData.assistPoints.forEach((ap) => {
              geo.children.push(this.createAssistPoint(ap));
            });
          }
          geo.userData = userData;
          this.results.push(geo);
        }
        // 单例
        if (old.userData.original instanceof Edge2) {
          let edge = (old.userData.original as Edge2).clone();
          let t = edge.u.x; edge.u.x = edge.u.y; edge.u.y = t;
          userData.original = edge;
          let geo = BrepMeshBuilder.BuildEdge2Mesh(edge, userData.color);
          if (userData.assistPoints) {
            userData.assistPoints.forEach((ap) => {
              geo.children.push(this.createAssistPoint(ap));
            });
          }
          geo.userData = userData;
          this.results.push(geo);
        }
      }
      // 面
      else if (old.userData.type < GeomType.DRAW_SURFACE_PLA) {
        // 数组
        if (old.userData.original instanceof Array) {
          let array = old.userData.original as Array<any>;
          let faces: Face2[] = [];
          for (let i = 0; i < array.length; i++) {
            if (array[i] instanceof Face2) {
              let face = (array[i] as Face2).clone();
              face.edges.forEach((edge) => {
                let t = edge.u.x; edge.u.x = edge.u.y; edge.u.y = t;
              });
              face.border.coedges = face.border.coedges.reverse();
              face.holes.forEach((hole) => {
                hole.coedges = hole.coedges.reverse();
              });
              faces.push(face);
            }
          }
          userData.original = faces;
          let geo = BrepMeshBuilder.BuildFace2sMesh(faces, userData.color);
          if (userData.assistPoints) {
            userData.assistPoints.forEach((ap) => {
              geo.children.push(this.createAssistPoint(ap));
            });
          }
          geo.userData = userData;
          this.results.push(geo);
        }
        // 单例
        if (old.userData.original instanceof Face2) {
          let face = (old.userData.original as Face2).clone() as Face2;
          face.edges.forEach((edge) => {
            let t = edge.u.x; edge.u.x = edge.u.y; edge.u.y = t;
          });
          face.border.coedges = face.border.coedges.reverse();
          face.holes.forEach((hole) => {
            hole.coedges = hole.coedges.reverse();
          });
          userData.original = face;
          userData.color = THREE.Color.NAMES.blue;
          let geo = BrepMeshBuilder.BuildFace2Mesh(face, userData.color, undefined, true);
          if (userData.assistPoints) {
            userData.assistPoints.forEach((ap) => {
              geo.children.push(this.createAssistPoint(ap));
            });
          }
          geo.userData = userData;
          this.results.push(geo);
        }
      }
    }

    this._text = paras[0];
    for (let i = 0; i < this.olds.length; i++) {
      let userData = CloneUserData(this.olds[i].userData as UserData);
      if (userData.original instanceof DataBase) {
        this._text += ' ' + userData.original.uuid;
      }
      if (userData.original instanceof Array) {
        for (let j = 0; j < userData.original.length; j++) {
          this._text += ' ' + userData.original[i].uuid;
        }
      }
    }

    this.done();
  }
}
export { ComReverse };