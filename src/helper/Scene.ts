import * as THREE from 'three';

class Scene {

  private _objects: Map<number, THREE.Object3D>;
  private _scene: THREE.Scene;
  constructor(secne: THREE.Scene) {
    this._scene = secne;
    this._objects = new Map<number, THREE.Object3D>();
  }
  add(...object: THREE.Object3D[]) {
    object.forEach((o) => {
      this._objects.set(o.id, o);
    });
    this._scene.add(...object);
  }
  remove(...object: THREE.Object3D[]) {
    object.forEach((o) => {
      this._objects.delete(o.id);
    });
    this._scene.remove(...object);
  }
  clear() {
    this._objects.clear();
    this._scene.clear();
  }

  ;
  get children(): THREE.Object3D[] {
    return this._scene.children;
  }
  get scene(): THREE.Scene {
    return this._scene;
  }
  get objects(): THREE.Object3D[] {
    const result: THREE.Object3D[] = [];
    for (const value of this._objects.values()) {
      result.push(value);
    }
    return result;
  }
}
export {
  Scene,
};