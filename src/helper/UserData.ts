import type { GeomType } from "../core/Constents";
import type { Vector2, Vector3 } from "../math/Math";
import * as THREE from "three";
import { Command } from "./command/Command";
import { Global } from "../core/Global";

// 用户数据类型，挂在显示对象的userData属性上。
type AssisPoint = {
  p: Vector2;
  c: number;
};

type UserData = {
  type: GeomType;   // 几何类型
  canPick: boolean; // 是否可拾取
  isAssist: boolean;// 是否是辅助物体
  assistPoints: AssisPoint[];// 辅助点数组
  color: number;    // 颜色
  original: any;    // 原始数据对象
  detail: number;   // 造型的精细等级
};

function CreateGeomUserData(type: GeomType): UserData {
  return {
    type: type,
    canPick: true,
    isAssist: false,
    assistPoints: [],
    color: THREE.Color.NAMES.red,
    original: null,
    detail: Global.scene.detail
  } as UserData;
};

function CloneUserData(src: UserData): UserData {
  return {
    type: src.type,
    canPick: src.canPick,
    isAssist: src.isAssist,
    assistPoints: src.assistPoints?.map(ap => ({ p: ap.p.clone(), c: ap.c })),
    color: src.color,
    original: src.original.clone ? src.original.clone() : src.original,
    detail: Global.scene.detail // 以事件发生时的场景精细度为准
  } as UserData;
}

function CopyUserData(src: UserData, des: UserData): void {
  des.type = src.type;
  des.canPick = src.canPick;
  des.isAssist = src.isAssist;
  des.assistPoints = src.assistPoints?.map(ap => ({ p: ap.p.clone(), c: ap.c }));
  des.color = src.color;
  des.original = src.original;
  des.detail = Global.scene.detail;// 以事件发生时的场景精细度为准
}

// 创建一个辅助点
function CreateAssistPoint(a: AssisPoint, isAssist: boolean = true): THREE.Mesh {
  const material = new THREE.MeshBasicMaterial({ color: a.c });
  const mesh = new THREE.Mesh(Command.geometry, material);
  mesh.position.x = a.p.x;
  mesh.position.y = a.p.y;
  mesh.name = "assist";
  mesh.userData.canPick = true;
  mesh.userData.isAssist = isAssist;
  mesh.userData.color = a.c;
  mesh.userData.original = a.p;
  mesh.userData.detail = 1;
  if (isAssist) {
    mesh.visible = Global.isShowAssists;
  } else {
    mesh.visible = true;
  }
  return mesh;
}

export {
  type UserData,
  type AssisPoint,
  CreateGeomUserData,
  CopyUserData,
  CloneUserData,
  CreateAssistPoint
};