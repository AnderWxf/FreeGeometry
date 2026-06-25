import { Global } from "../../../core/Global";
import { Edge2, Face2 } from "../../../geometry/data/brep/Brep2";
import { Matrix3, Vector2, type Matrix4 } from "../../../math/Math";
import { BrepMeshBuilder } from "../../BrepMeshBuilder";
import { ActionContext3D } from "../Active";
import { ActPickObject } from "../acts/ActPickObject";
import { ActPickPoint2 } from "../acts/ActPickPoint2";
import * as THREE from "three";
import { ComBatch } from "./ComBatch";
import { Brep2Builder } from "../../../geometry/algorithm/builder/Brep2Builder";
import type { Transform2 } from "../../../geometry/data/base/Transform2";
import { GeomType } from "../../../core/Constents";
import { CloneUserData, CopyUserData, type UserData } from "../../UserData";

/**
 * Transform command class.
 * 
 */
class ComTransform extends ComBatch {
  beginPoint: Vector2;
  endPoint: Vector2;
  override async exec(): Promise<void> {

    let str = this._text;
    let paras = str.split(' ');
    if (paras.length == 5) {
      // 创建一个直线段
      this.beginPoint = new Vector2(new Number(paras[1]).valueOf(), new Number(paras[2]).valueOf());
      this.endPoint = new Vector2(new Number(paras[3]).valueOf(), new Number(paras[4]).valueOf());
    } else {
      this.bind(window);
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
      let act_pick_begin = new ActPickPoint2();
      await act_pick_begin.execute(context);
      if (this._isCancel || act_pick_begin.isCancel) { this.cancel(); return; }

      this.beginPoint = new Vector2(act_pick_begin.result.x, act_pick_begin.result.y);


      let act_pick_end = new ActPickPoint2();
      await act_pick_end.execute(context);
      if (this._isCancel || act_pick_end.isCancel) { this.cancel(); return; }
      this.endPoint = new Vector2(act_pick_end.result.x, act_pick_end.result.y);


      this._text = paras[0] + ' ' + this.beginPoint.x + ' ' + this.beginPoint.y + ' ' + this.endPoint.x + ' ' + this.endPoint.y;
    }
    let trans = this.makeTransfrom(this.beginPoint, this.endPoint);
    // 创建n个线段
    for (let i = 0; i < this.olds.length; i++) {
      let old = this.olds[i];
      let userData = CloneUserData(old.userData as UserData);
      // 线
      if (old.userData.type < GeomType.DRAW_SURFACE_CI) {
        if (old.userData.type == GeomType.DRAW_CURVE2_PO || old.userData.type == GeomType.DRAW_CURVE2_RC) {
          // 数组
          if (old.userData.original instanceof Array) {
            let array = old.userData.original as Array<any>;
            let edges: Edge2[] = [];
            for (let i = 0; i < array.length; i++) {
              if (array[i] instanceof Edge2) {
                let edge = (array[i] as Edge2).clone();
                this.appTransfrom(edge.curve.trans, trans);
                edges.push(edge);
              }
            }
            userData.original = edges;
            let geo = BrepMeshBuilder.BuildEdge2sMesh(edges, userData.color);
            if (userData.assistPoints) {
              userData.assistPoints.forEach((ap) => {
                ap.p.applyMatrix3(trans);
                geo.children.push(this.createAssistPoint(ap));
              });
            }
            geo.userData = userData;
            this.results.push(geo);
          }
        }
        // 单例
        else {
          let edge = (old.userData.original as Edge2).clone();
          this.appTransfrom(edge.curve.trans, trans);
          userData.original = edge;
          let geo = BrepMeshBuilder.BuildEdge2Mesh(edge, userData.color);
          if (userData.assistPoints) {
            userData.assistPoints.forEach((ap) => {
              ap.p.applyMatrix3(trans);
              geo.children.push(this.createAssistPoint(ap));
            });
          }
          geo.userData = userData;
          this.results.push(geo);
        }
      }
      // 面
      else if (old.userData.type < GeomType.DRAW_SURFACE_PLA) {
        let face = (old.userData.original as Face2).clone() as Face2;
        for (let i = 0; i < face.curves.length; i++) {
          this.appTransfrom(face.curves[i].trans, trans);
        }
        userData.original = face;
        userData.canPick = false;
        userData.color = THREE.Color.NAMES.blue;
        let geo = BrepMeshBuilder.BuildFace2Mesh(face, userData.color, undefined, true);
        if (userData.assistPoints) {
          userData.assistPoints.forEach((ap) => {
            ap.p.applyMatrix3(trans);
            geo.children.push(this.createAssistPoint(ap));
          });
        }
        geo.userData = userData;
        this.results.push(geo);
      }
    }
    this.done();
  }
  // 计算变换矩阵
  makeTransfrom(a: Vector2, b: Vector2): Matrix3 {
    debugger;
    return new Matrix3();
  }
  // 应用变换矩阵
  appTransfrom(trans: Transform2, m: Matrix3): Matrix3 {
    let lm = trans.makeLocalMatrix();
    lm.premultiply(m);
    trans.fromLocalMatrix(lm);
    return m;
  }
  override onMouseMoveExec(event: MouseEvent) {
    if (this._isCancel) { this.cancel(); return; }
    if (this.beginPoint && !this.endPoint) {
      if (this.tempResults) {
        Global.scene.remove(...this.tempResults);
        this.tempResults = [];
      }


      let endPoint: Vector2 = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);

      let trans = this.makeTransfrom(this.beginPoint, endPoint);
      for (let i = 0; i < this.olds.length; i++) {
        let old = this.olds[i];
        let userData = CloneUserData(old.userData as UserData);
        // 线
        if (old.userData.type < GeomType.DRAW_SURFACE_CI) {
          // 创建一个线段
          if (old.userData.original instanceof Edge2) {
            let edge = (old.userData.original as Edge2).clone();
            this.appTransfrom(edge.curve.trans, trans);
            let t = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray, undefined, 0);
            t.name = "temp";
            userData.assistPoints.forEach((ap) => {
              ap.p.applyMatrix3(trans);
              t.children.push(this.createAssistPoint(ap));
            });
            this.tempResults.push(t);
          }
          // 创建多个线段
          if (old.userData.original instanceof Array) {
            let array = old.userData.original as Array<any>;
            let edges: Edge2[] = [];
            for (let i = 0; i < array.length; i++) {
              if (array[i] instanceof Edge2) {
                let edge = (array[i] as Edge2).clone();
                this.appTransfrom(edge.curve.trans, trans);
                edges.push(edge);
              }
            }
            let t = BrepMeshBuilder.BuildEdge2sMesh(edges, THREE.Color.NAMES.gray, undefined, 0);
            t.userData.type = old.userData.type;
            t.name = "temp";
            userData.assistPoints.forEach((ap) => {
              ap.p.applyMatrix3(trans);
              t.children.push(this.createAssistPoint(ap));
            });
            this.tempResults.push(t);
          }
        }
        // 面
        else if (old.userData.type < GeomType.DRAW_SURFACE_PLA) {
          let face = (old.userData.original as Face2).clone() as Face2;
          for (let i = 0; i < face.curves.length; i++) {
            this.appTransfrom(face.curves[i].trans, trans);
          }

          let t = BrepMeshBuilder.BuildFace2Mesh(face, THREE.Color.NAMES.gray, undefined, false);
          t.name = "temp";
          userData.assistPoints.forEach((ap) => {
            ap.p.applyMatrix3(trans);
            t.children.push(this.createAssistPoint(ap));
          });
          this.tempResults.push(t);
        }
      }

      // 创建一个临时直线段
      let edge = Brep2Builder.BuildLineEdge2FromBeginEndPoint(this.beginPoint, endPoint);
      let t = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray, undefined, 0,);
      t.name = "temp";
      this.tempResults.push(t);
      Global.scene.add(...this.tempResults);
    }
  };
}
export { ComTransform };