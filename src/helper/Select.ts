import * as THREE from 'three';
import { Vector2, Vector3 } from '../math/Math';
import { Global } from '../core/Global';
import type { UserData } from './UserData';
import { LineBasicMaterial, Material, type LineBasicMaterialProperties } from 'three';

/**
 * Select controller.
 *
 */
class Select {
  private _camera: THREE.Camera;
  private _scene: THREE.Scene;

  private _raycasterForSelect: THREE.Raycaster;
  private _raycasterForOver: THREE.Raycaster;

  private _isEditor: boolean = false;     // 编辑
  private _isMultiple: boolean = false;   // 多选
  private _isSnap: boolean = false;       // 捕捉
  private _isSnapInter: boolean = false;  // 捕捉交点

  selectedAssist: THREE.Object3D;         // 拾取辅助物体
  selectedObjects: THREE.Object3D[] = []; // 拾取结果
  overObjects: THREE.Object3D[] = [];     // 滑过结果
  pickedPoint: THREE.Vector3;             // 拾取的坐标
  overedPoint: THREE.Vector3;             // 滑过的坐标
  constructor(scene: THREE.Scene) {
    this._scene = scene;
    this._raycasterForSelect = new THREE.Raycaster();
    this._raycasterForSelect.params.Points.threshold = 0.1;
    this._raycasterForSelect.params.Line.threshold = 0.1;
    this._raycasterForSelect.params.Mesh.threshold = 0.1;
    this._raycasterForSelect.params.Sprite.threshold = 0.1;
    this._raycasterForSelect.params.LOD.threshold = 0.1;

    this._raycasterForOver = new THREE.Raycaster();
    this._raycasterForOver.params.Points.threshold = 0.2;
    this._raycasterForOver.params.Line.threshold = 0.2;
    this._raycasterForOver.params.Mesh.threshold = 0.2;
    this._raycasterForOver.params.Sprite.threshold = 0.2;
    this._raycasterForOver.params.LOD.threshold = 0.2;
  }
  get isMultiple(): boolean {
    return this._isMultiple;
  }
  set isMultiple(value: boolean) {
    this._isMultiple = value;
  }

  get isSnap(): boolean {
    return this._isSnap;
  }
  set isSnap(value: boolean) {
    this._isSnap = value;
  }

  get isSnapInter(): boolean {
    return this._isSnapInter;
  }
  set isSnapInter(value: boolean) {
    this._isSnapInter = value;
  }

  get isEditor(): boolean {
    return this._isEditor;
  }
  set isEditor(value: boolean) {
    this._isEditor = value;
  }

  set camera(camera: THREE.Camera) {
    this._camera = camera;
    this.bind(window);
  }

  clear() {
    for (let i = 0; i < this.selectedObjects.length; i++) {
      let obj = this.selectedObjects[i] as THREE.Object3D;
      let userData = obj.userData as UserData;
      let originalColor = userData.color;
      if (originalColor != undefined) {
        (obj as any).material.color.setHex(userData.color);
      }
    }
    for (let i = 0; i < this.overObjects.length; i++) {
      let obj = this.overObjects[i] as THREE.Object3D;
      let userData = obj.userData as UserData;
      let originalColor = userData.color;
      if (originalColor != undefined) {
        (obj as any).material.color.copy(originalColor);
      }
    }
    this.selectedAssist = null;
    this.selectedObjects = [];
    this.overObjects = [];
    this.pickedPoint = null;
    this.overedPoint = null;
  }

  onKeyDown = (event: KeyboardEvent) => {
    switch (event.code) {
      case "ControlLeft":
        this.isMultiple = true;
        break;
    }
  }
  onKeyUp = (event: KeyboardEvent) => {
    switch (event.code) {
      case "ControlLeft":
        this.isMultiple = false;
        break;
    }
  }
  onMouseClick = (event: MouseEvent) => {
    if (event.target != Global.canvas) {
      return;
    }
    if (!this.isMultiple) {
      let array = Global.comExector.GetExecutingObjs();
      for (let i = this.selectedObjects.length - 1; i >= 0; i--) {
        let obj = this.selectedObjects[i] as THREE.Object3D;
        if (array.includes(obj)) {
          continue;
        }
        let userData = obj.userData as UserData;
        if (userData.color != undefined) {
          let material = (obj as any).material as LineBasicMaterialProperties;
          material.color.setHex(userData.color);
        }
        this.selectedObjects.splice(i, 1);
      }
    }
    // 创建射线投射器
    const raycaster = this._raycasterForSelect;
    const mouse = new THREE.Vector2();
    // 计算鼠标在canvas上的位置
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // 更新射线的起点和方向
    raycaster.setFromCamera(mouse, this._camera);
    let isCanPick = false;
    // 默认的点
    this.pickedPoint = raycaster.ray.origin; // 没有交点时，设置射线源点
    // 计算物体和射线的交点
    const intersects = raycaster.intersectObjects(this._scene.children);
    if (intersects.length > 0) {
      for (let i = 0; i < intersects.length; i++) {
        const obj = intersects[i].object;
        let userData = obj.userData as UserData;
        let material = (obj as any).material as LineBasicMaterialProperties;
        this.pickedPoint = intersects[i].point; // 交点的世界坐标
        // 编辑状态
        if (0) {
          if (userData.canPick && userData.isAssist) {
            isCanPick = true;
            //拾取的是一个存在的点对象
            this.pickedPoint.set(obj.position.x, obj.position.y, 0);
            if (this.selectedAssist != obj) {
              if (this.overObjects.includes(obj)) {
                this.overObjects.splice(this.overObjects.indexOf(obj), 1);
                if (material && material.color) {
                  material.color.setHex(THREE.Color.NAMES.aqua);
                }
              } else {
                if (material && material.color) {
                  userData.color = material.color.getHex();
                  material.color.setHex(THREE.Color.NAMES.aqua);
                }
              }
              this.selectedAssist = obj;
            }
            break;
          }

        } else {
          if (userData.canPick) {
            isCanPick = true;
            //拾取的是一个存在的点对象
            if (userData.original instanceof Vector2) {
              this.pickedPoint.set(userData.original.x, userData.original.y, 0);
            }
            else if (userData.original instanceof Vector3) {
              this.pickedPoint.set(userData.original.x, userData.original.y, userData.original.z);
            }
            else if (userData.original.p instanceof Vector2) {
              this.pickedPoint.set(userData.original.p.x, userData.original.p.y, 0);
            }
            else if (userData.original.p instanceof Vector3) {
              this.pickedPoint.set(userData.original.p.x, userData.original.p.y, userData.original.p.z);
            }
            if (userData.isAssist) {
              //拾取的是一个存在的点对象
              this.pickedPoint.set(obj.position.x, obj.position.y, 0);
              if (this.selectedAssist != obj) {
                if (this.overObjects.includes(obj)) {
                  this.overObjects.splice(this.overObjects.indexOf(obj), 1);
                  if (material && material.color) {
                    material.color.setHex(THREE.Color.NAMES.aqua);
                  }
                } else {
                  if ((obj as any).material && (obj as any).material.color) {
                    userData.color = material.color.getHex();
                    material.color.setHex(THREE.Color.NAMES.aqua);
                  }
                }
                this.selectedAssist = obj;
              }
            }
            if (!this.selectedObjects.includes(obj)) {
              if (this.overObjects.includes(obj)) {
                this.overObjects.splice(this.overObjects.indexOf(obj), 1);
                if (material && material.color) {
                  material.color.setHex(THREE.Color.NAMES.aqua);
                }
              } else {
                if (material && material.color) {
                  userData.color = material.color.getHex();
                  material.color.setHex(THREE.Color.NAMES.aqua);
                }
              }
              this.selectedObjects.push(obj);
              break;
            }
          }
        }

      }
    }
    if (this._isSnap) {
      // 没有得到一个可拾取对象
      if (!isCanPick) {
        this.pickedPoint.x = Math.round(this.pickedPoint.x);
        this.pickedPoint.y = Math.round(this.pickedPoint.y);
      }
    }
    // 编辑模式
    if (this._isEditor && this.selectedObjects.length > 0 && !this.selectedObjects[0].userData.isAssist) {
      if (!Global.comExector.isExecuting()) {
        Global.comExector.onEidtor();
      }
    }
  };

  pushSelectObject(obj: THREE.Object3D) {
    let material = (obj as any).material as LineBasicMaterialProperties;
    let userData = obj.userData as UserData;
    if (material && material.color) {
      userData.color = material.color.getHex();
      material.color.setHex(THREE.Color.NAMES.aqua);
    }
    this.selectedObjects = this.selectedObjects.reverse();
    this.selectedObjects.push(obj);
    this.selectedObjects = this.selectedObjects.reverse();
  }
  onMouseMove = (event: MouseEvent) => {
    // 可以在这里实现鼠标移动时的交互逻辑，例如高亮选中对象等
    for (let i = 0; i < this.overObjects.length; i++) {
      let obj = this.overObjects[i] as THREE.Object3D;
      let material = (obj as any).material as LineBasicMaterialProperties;
      let userData = obj.userData as UserData;
      if (userData.color != undefined) {
        material.color.setHex(userData.color);
      }
    }
    this.overObjects = [];
    // 创建射线投射器
    const raycaster = this._raycasterForOver;
    const mouse = new THREE.Vector2();
    // 计算鼠标在canvas上的位置
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    // 更新射线的起点和方向
    raycaster.setFromCamera(mouse, this._camera);
    let isCanPick = false;
    // 默认的点
    this.overedPoint = raycaster.ray.origin; // 没有交点时，设置射线源点
    // 计算物体和射线的交点
    const intersects = raycaster.intersectObjects(this._scene.children);
    if (intersects.length > 0) {
      for (let i = intersects.length - 1; i >= 0; i--) {
        const obj = intersects[i].object;
        let material = (obj as any).material as LineBasicMaterialProperties;
        let userData = obj.userData as UserData;
        if (userData.canPick) {
          this.overedPoint = intersects[i].point; // 交点的世界坐标                    
          isCanPick = true;
          if (!this.overObjects.includes(obj) && !this.selectedObjects.includes(obj)) {
            if (material && material.color) {
              userData.color = material.color.getHex();
              material.color.setHex(THREE.Color.NAMES.cornflowerblue);
            }
            this.overObjects.push(obj);
          }
        }
      }
    }
    if (this._isSnap) {
      // 没有得到一个可拾取对象
      if (!isCanPick) {
        this.overedPoint.x = Math.round(this.overedPoint.x);
        this.overedPoint.y = Math.round(this.overedPoint.y);
      }
    }
  };

  bind(window: Window) {
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener('click', this.onMouseClick);
    window.addEventListener("mousemove", this.onMouseMove);
  }
  unbind(window: Window) {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener('click', this.onMouseClick);
    window.removeEventListener("mousemove", this.onMouseMove);
  }
}
export { Select };