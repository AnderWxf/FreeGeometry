import type { GeomType } from "../core/Constents";
import type { Vector2, Vector3 } from "../math/Math";
import * as THREE from "three";
import { Command } from "./command/Command";

// 用户数据类型，挂在显示对象的userData属性上。
type AssisPoint = {
  p: Vector2;
  c: number;
};

type UserData = {
  type: GeomType;
  canPick: boolean;
  isAssist: boolean;
  assistPoints: AssisPoint[];
  color: number;
  original: any;
};

function CreateGeomUserData(type: GeomType): UserData {
  return {
    type: type,
    canPick: true,
    isAssist: false,
    assistPoints: [],
    color: 0xffffff,
    original: null
  } as UserData;
};



function CloneUserData(src: UserData): UserData {
  return {
    type: src.type,
    canPick: src.canPick,
    isAssist: src.isAssist,
    assistPoints: src.assistPoints?.map(ap => ({ p: ap.p.clone(), c: ap.c })),
    color: src.color,
    original: src.original
  } as UserData;
}

function CopyUserData(src: UserData, dest: UserData): void {
  dest.type = src.type;
  dest.canPick = src.canPick;
  dest.isAssist = src.isAssist;
  dest.assistPoints = src.assistPoints?.map(ap => ({ p: ap.p.clone(), c: ap.c }));
  dest.color = src.color;
  dest.original = src.original;
}

// 创建一个辅助点
function CreateAssistPoint(a: AssisPoint): THREE.Mesh {
  const material = new THREE.MeshBasicMaterial({ color: a.c });
  const mesh = new THREE.Mesh(Command.geometry, material);
  mesh.position.x = a.p.x;
  mesh.position.y = a.p.y;
  mesh.name = "assist";
  mesh.userData.canPick = true;
  mesh.userData.isAssist = true;
  mesh.userData.color = a.c;
  mesh.userData.original = a.p;
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