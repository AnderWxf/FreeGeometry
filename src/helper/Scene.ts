import * as THREE from 'three';
import type { UserData } from './UserData';
import { Edge2 } from '../geometry/data/brep/Brep2';
import { BrepMeshBuilder } from './BrepMeshBuilder';
import * as MATHJS from '../mathjs';
import { DataBase } from '../geometry/data/DataBase';

class Scene {
  private _objects: Map<number, THREE.Object3D>;
  private _scene: THREE.Scene;
  private _detail: number = 1;// 造型的精细等级
  constructor(secne: THREE.Scene) {
    this._scene = secne;
    this._objects = new Map<number, THREE.Object3D>();
    const ScreenZoom = (e: CustomEvent) => {
      let zoom = e.detail;
      // let detail = MATHJS.round(MATHJS.log(zoom, 4));
      let detail = MATHJS.round(zoom / 10);
      if (detail > 0) {
        detail += 1;
      }
      else if (detail < 0) {
        detail -= 1;
      } else {
        return;
      }
      this._detail = detail;
      for (const value of this._objects.values()) {
        let userData = value.userData as UserData;
        if ((value instanceof THREE.Mesh || value instanceof THREE.Line)
          && (userData.detail == undefined || userData.detail < detail)) {
          BrepMeshBuilder.ReDetialBuildEdge2sMesh(userData, value);
          userData.detail = detail;
        }
      }
    };
    window.addEventListener('ScreenZoom' as any, ScreenZoom);
  }
  add(...object: THREE.Object3D[]) {
    if (object.length == 0) return;
    object.forEach((o) => {
      this._objects.set(o.id, o);
    });
    this._scene.add(...object);
  }
  remove(...object: THREE.Object3D[]) {
    if (object.length == 0) return;
    object.forEach((o) => {
      this._objects.delete(o.id);
    });
    this._scene.remove(...object);
  }
  clear() {
    if (this._objects.size == 0) return;
    this._scene.remove(...this._objects.values());
    this._objects.clear();
  }
  get children(): THREE.Object3D[] {
    return this._scene.children;
  }
  get scene(): THREE.Scene {
    return this._scene;
  }
  get detail(): number {
    return this._detail;
  }
  get objects(): THREE.Object3D[] {
    const result: THREE.Object3D[] = [];
    for (const value of this._objects.values()) {
      result.push(value);
    }
    return result;
  }
  get allObjects(): THREE.Object3D[] {
    const result: THREE.Object3D[] = [];
    for (const value of this._objects.values()) {
      result.push(value);
      if (value.children.length) {
        result.push(...value.children);
      }
    }
    return result;
  }

  getObjectsByUUIDs(paras: string[]): THREE.Object3D[] {
    const result: THREE.Object3D[] = [];
    // 从场景中选择需要的目标
    for (const value of this._objects.values()) {
      let userData = value.userData as UserData;
      if (userData.original instanceof DataBase) {
        let uuid = userData.original.uuid;
        if (paras.includes(uuid)) {
          result.push(value);
        }
      }
      else if (userData.original instanceof Array
        && userData.original[0] instanceof DataBase) {
        let uuid = userData.original[0].uuid;
        if (paras.includes(uuid)) {
          result.push(value);
        }
      }
    }
    return result;
  }
}
export {
  Scene,
};