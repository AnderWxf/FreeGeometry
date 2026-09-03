import { Global } from "../../../../core/Global";
import { Edge2, Face2 } from "../../../../geometry/data/brep/Brep2";
import { Matrix3, Vector2, type Matrix4 } from "../../../../math/Math";
import { BrepMeshBuilder } from "../../../BrepMeshBuilder";
import { ActionContext3D } from "../../Active";
import { ActPickObject } from "../../acts/ActPickObject";
import { ActPickPoint2 } from "../../acts/ActPickPoint2";
import * as THREE from "three";
import { ComBatch } from "../ComBatch";
import { Brep2Builder } from "../../../../geometry/algorithm/builder/Brep2Builder";
import type { Transform2 } from "../../../../geometry/data/base/Transform2";
import { GeomType } from "../../../../core/Constents";
import { CloneUserData, type UserData } from "../../../UserData";
import { Point2Data } from "../../../../geometry/data/base/Point2Data";
import { DataBase } from "../../../../geometry/data/DataBase";
import type { CommandExecuter } from "../../CommandExecuter";
import { v4 as uuidv4 } from 'uuid';

/**
 * Transform command class.
 * 格式：命令类型 begin.x begin.y end.x end.y n uuid0 uuid1...
 */
class ComTransform extends ComBatch {
  begin: Vector2;
  end: Vector2;
  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
  }
  override async exec(): Promise<void> {
    let str = this._text;
    let paras = str.split(' ');
    let n = 0;

    if (paras.length >= 5) {
      // 创建一个直线段
      this.begin = new Vector2(new Number(paras[1]).valueOf(), new Number(paras[2]).valueOf());
      this.end = new Vector2(new Number(paras[3]).valueOf(), new Number(paras[4]).valueOf());

      if (paras.length >= 6) {
        n = new Number(paras[5]).valueOf();
      }

      if (paras.length >= 7) {
        let objs = Global.scene.getObjectsByUUIDs(paras.slice(6, 6 + n));
        this.olds.push(...objs);
      } else {
        if (Global.select.selectedObjects.length > 0) {
          this.olds.push(...Global.select.selectedObjects);
        }
      }
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
      this.begin = new Vector2(act_pick_begin.result.x, act_pick_begin.result.y);

      let act_pick_end = new ActPickPoint2();
      await act_pick_end.execute(context);
      if (this._isCancel || act_pick_end.isCancel) { this.cancel(); return; }
      this.end = new Vector2(act_pick_end.result.x, act_pick_end.result.y);
    }
    n = 0;
    let trans = this.makeTransfrom(this.begin, this.end);
    // 创建n个对象
    for (let i = 0; i < this.olds.length; i++) {
      let old = this.olds[i];
      let userData = CloneUserData(old.userData as UserData);
      // 点向量
      if (old.userData.type == GeomType.MATH_VECTOR2) {
        let point = (old.userData.original as Vector2).clone();
        point.applyMatrix3(trans);
        userData.original = point;
        let geo = this.createAssistPoint({ p: point, c: userData.color }, false);
        geo.userData = userData;
        geo.visible = true;
        this.results.push(geo);
      }
      // 几何点
      else if (old.userData.type == GeomType.DATA_TYPE_POINT2) {
        n++;
        let point: Point2Data;
        if (!this.isDeleteOld) {
          point = (old.userData.original as Point2Data).copy();
          // 以指定新的uuid
          if (paras.length >= 6 + n) {
            point.uuid = paras[6 + n];
          }
        } else {
          point = (old.userData.original as Point2Data).clone();
        }
        point.pos.applyMatrix3(trans);
        userData.original = point;
        let geo = this.createAssistPoint({ p: point.pos, c: userData.color }, false);
        geo.userData = userData;
        geo.visible = true;
        this.results.push(geo);
      }
      // 线
      else if (old.userData.type < GeomType.DRAW_SURFACE_CI) {
        // 数组
        if (old.userData.original instanceof Array) {
          let array = old.userData.original as Array<any>;
          let edges: Edge2[] = [];
          for (let i = 0; i < array.length; i++) {
            n++;
            if (array[i] instanceof Edge2) {
              let edge: Edge2;
              if (!this.isDeleteOld) {
                edge = (array[i] as Edge2).copy();
                // 以指定新的uuid
                if (paras.length >= 6 + n) {
                  edge.uuid = paras[6 + n];
                }
              } else {
                edge = (array[i] as Edge2).clone();
              }
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
        // 单例
        if (old.userData.original instanceof Edge2) {
          n++;
          let edge: Edge2;
          if (!this.isDeleteOld) {
            edge = old.userData.original.copy();
            // 以指定新的uuid
            if (paras.length >= 6 + n) {
              edge.uuid = paras[6 + n];
            }
          } else {
            edge = old.userData.original.clone();
          }
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
        // 数组
        if (old.userData.original instanceof Array) {
          let array = old.userData.original as Array<any>;
          let faces: Face2[] = [];
          for (let i = 0; i < array.length; i++) {
            n++;
            if (array[i] instanceof Face2) {
              let face: Face2;
              if (!this.isDeleteOld) {
                face = (array[i] as Face2).copy();
                // 以指定新的uuid
                if (paras.length >= 6 + n) {
                  face.uuid = paras[6 + n];
                }
              } else {
                face = (array[i] as Face2).clone();
              }
              face.curves.forEach((curve) => {
                this.appTransfrom(curve.trans, trans);
              });
              faces.push(face);
            }
          }
          userData.original = faces;
          let geo = BrepMeshBuilder.BuildFace2sMesh(faces, userData.color);
          if (userData.assistPoints) {
            userData.assistPoints.forEach((ap) => {
              ap.p.applyMatrix3(trans);
              geo.children.push(this.createAssistPoint(ap));
            });
          }
          geo.userData = userData;
          this.results.push(geo);
        }
        // 单例
        if (old.userData.original instanceof Face2) {
          n++;
          let face: Face2;
          if (!this.isDeleteOld) {
            face = old.userData.original.copy();
            // 以指定新的uuid
            if (paras.length >= 6 + n) {
              face.uuid = paras[6 + n];
            }
          } else {
            face = old.userData.original.clone();
          }
          for (let i = 0; i < face.curves.length; i++) {
            this.appTransfrom(face.curves[i].trans, trans);
          }
          userData.original = face;
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
    }

    this._text = paras[0]
      + ' ' + this.begin.x + ' ' + this.begin.y
      + ' ' + this.end.x + ' ' + this.end.y
      + ' ' + n;
    for (let i = 0; i < this.olds.length; i++) {
      let userData = this.olds[i].userData as UserData;
      if (userData.original instanceof DataBase) {
        this._text += ' ' + userData.original.uuid;
      }
      if (userData.original instanceof Array) {
        for (let j = 0; j < userData.original.length; j++) {
          this._text += ' ' + userData.original[i].uuid;
        }
      }
    }

    for (let i = 0; i < this.results.length; i++) {
      let userData = this.results[i].userData as UserData;
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
    if (this.begin && !this.end) {
      if (this.tempResults) {
        Global.scene.remove(...this.tempResults);
        this.tempResults = [];
      }
      let endPoint: Vector2 = Global.select.overedPoint ? new Vector2(Global.select.overedPoint.x, Global.select.overedPoint.y) : new Vector2(0, 0);
      let trans = this.makeTransfrom(this.begin, endPoint);
      for (let i = 0; i < this.olds.length; i++) {
        let old = this.olds[i];
        let userData = CloneUserData(old.userData as UserData);
        // 点
        if (old.userData.type == GeomType.MATH_VECTOR2) {
          // 单例
          if (old.userData.original instanceof Vector2) {
            let point = (old.userData.original as Vector2).clone();
            point.applyMatrix3(trans);
            let t = this.createAssistPoint({ p: point, c: THREE.Color.NAMES.gray }, false);
            t.name = "temp";
            this.tempResults.push(t);
          }
          // 数组
          if (old.userData.original instanceof Array) {
            let array = old.userData.original as Array<any>;
            for (let i = 0; i < array.length; i++) {
              if (array[i] instanceof Vector2) {
                let point = (array[i] as Vector2).clone();
                point.applyMatrix3(trans);
                let t = this.createAssistPoint({ p: point, c: THREE.Color.NAMES.gray }, false);
                t.userData.type = old.userData.type;
                t.name = "temp";
                this.tempResults.push(t);
              }
            }
          }
        }
        // 点
        if (old.userData.type == GeomType.DATA_TYPE_POINT2) {
          // 单例
          if (old.userData.original instanceof Point2Data) {
            let point = (old.userData.original.pos as Vector2).clone();
            point.applyMatrix3(trans);
            let t = this.createAssistPoint({ p: point, c: THREE.Color.NAMES.gray }, false);
            t.name = "temp";
            this.tempResults.push(t);
          }
          // 数组
          if (old.userData.original instanceof Array) {
            let array = old.userData.original as Array<any>;
            for (let i = 0; i < array.length; i++) {
              if (array[i] instanceof Point2Data) {
                let point = (array[i] as Point2Data).pos.clone();
                point.applyMatrix3(trans);
                let t = this.createAssistPoint({ p: point, c: THREE.Color.NAMES.gray }, false);
                t.userData.type = old.userData.type;
                t.name = "temp";
                this.tempResults.push(t);
              }
            }
          }
        }
        // 线
        if (old.userData.type < GeomType.DRAW_SURFACE_CI) {
          // 单例
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
        if (old.userData.type >= GeomType.DRAW_SURFACE_CI
          && old.userData.type < GeomType.DRAW_SURFACE_PLA
        ) {
          // 单例
          if (old.userData.original instanceof Face2) {
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
          // 数组
          if (old.userData.original instanceof Array) {
            let array = old.userData.original as Array<any>;
            let faces: Face2[] = [];
            for (let i = 0; i < array.length; i++) {
              if (array[i] instanceof Face2) {
                let face = (array[i] as Face2).clone();
                face.curves.forEach((curve) => {
                  this.appTransfrom(curve.trans, trans);
                });
                faces.push(face);
              }
            }
            let t = BrepMeshBuilder.BuildFace2sMesh(faces, THREE.Color.NAMES.gray, undefined, false);
            t.userData.type = old.userData.type;
            t.name = "temp";
            userData.assistPoints.forEach((ap) => {
              ap.p.applyMatrix3(trans);
              t.children.push(this.createAssistPoint(ap));
            });
            this.tempResults.push(t);
          }
        }
      }

      // 创建一个临时直线段
      let edge = Brep2Builder.BuildLineEdge2FromBeginEndPoint(this.begin, endPoint);
      let t = BrepMeshBuilder.BuildEdge2Mesh(edge, THREE.Color.NAMES.gray, undefined, 0,);
      t.name = "temp";
      this.tempResults.push(t);
      Global.scene.add(...this.tempResults);
    }
  };
}
export { ComTransform };