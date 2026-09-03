import { GeomType } from "../core/Constents";
import type { Vector2, Vector3 } from "../math/Math";
import * as THREE from "three";
import { Command } from "./command/Command";
import { Global } from "../core/Global";
import { DataBase } from "../geometry/data/DataBase";
import { Point2Data } from "../geometry/data/base/Point2Data";

// 用户数据类型，挂在显示对象的userData属性上。
type AssisPoint2 = {
  p: Vector2;
  c: number;
};

type AssisPoint3 = {
  p: Vector3;
  c: number;
};

type UserData = {
  type: GeomType;   // 几何类型
  typename: string; // 几何类型名称
  canPick: boolean; // 是否可拾取
  color: number;    // 颜色
  detail: number;   // 造型的精细等级（此值序列化是应该忽略）
  isAssist: boolean;// 是否是辅助物体
  assistPoints: AssisPoint2[];// 辅助点数组
  original: Vector2 | DataBase | DataBase[]; // 原始数据对象
};

function CreateGeomUserData(type: GeomType): UserData {
  return {
    type: type,
    typename: GeomType[type],
    canPick: true,
    isAssist: false,
    assistPoints: [],
    color: THREE.Color.NAMES.red,
    original: null,
    detail: Global.scene.detail
  } as UserData;
};

function CloneUserData(src: UserData): UserData {

  if (src.original instanceof Array) {
    let originals = src.original as Array<DataBase>;
    let clonedOriginals: Array<DataBase> = [];
    for (let i = 0; i < originals.length; i++) {
      let original = originals[i].clone();
      clonedOriginals.push(original);
    }
    return {
      type: src.type,
      canPick: src.canPick,
      isAssist: src.isAssist,
      assistPoints: src.assistPoints?.map(ap => ({ p: ap.p.clone(), c: ap.c })),
      color: src.color,
      original: clonedOriginals,
      detail: Global.scene.detail // 以事件发生时的场景精细度为准
    } as UserData;
  } else if (src.original instanceof DataBase) {
    return {
      type: src.type,
      canPick: src.canPick,
      isAssist: src.isAssist,
      assistPoints: src.assistPoints?.map(ap => ({ p: ap.p.clone(), c: ap.c })),
      color: src.color,
      original: src.original.clone(),
      detail: Global.scene.detail // 以事件发生时的场景精细度为准
    } as UserData;
  } else {
    return {
      type: src.type,
      canPick: src.canPick,
      isAssist: src.isAssist,
      assistPoints: src.assistPoints?.map(ap => ({ p: ap.p.clone(), c: ap.c })),
      color: src.color,
      original: src.original.clone(),
      detail: Global.scene.detail // 以事件发生时的场景精细度为准
    } as UserData;
  }

}

function CopyUserData(src: UserData, des: UserData): void {
  des.type = src.type;
  des.canPick = src.canPick;
  des.isAssist = src.isAssist;
  des.assistPoints = src.assistPoints?.map(ap => ({ p: ap.p.clone(), c: ap.c }));
  des.color = src.color;
  des.detail = Global.scene.detail;// 以事件发生时的场景精细度为准
}

// 创建一个辅助点
function CreateAssistPoint2(a: AssisPoint2, isAssist: boolean = true): THREE.Mesh {
  const material = new THREE.MeshBasicMaterial({ color: a.c });
  const mesh = new THREE.Mesh(Command.geometry, material);
  mesh.position.x = a.p.x;
  mesh.position.y = a.p.y;
  mesh.name = "assist";
  mesh.userData.canPick = true;
  mesh.userData.isAssist = isAssist;
  mesh.userData.color = a.c;
  mesh.userData.original = new Point2Data(a.p);
  mesh.userData.detail = 1;
  mesh.visible = !isAssist;
  return mesh;
}

export {
  type UserData,
  type AssisPoint2 as AssisPoint,
  CreateGeomUserData,
  CopyUserData,
  CloneUserData,
  CreateAssistPoint2 as CreateAssistPoint
};