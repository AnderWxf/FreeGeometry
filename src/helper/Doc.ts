import { array } from "three/src/nodes/TSL";
import { unserialize } from "../geometry/data/base/Unserialize";
import { Edge2, Face2 } from "../geometry/data/brep/Brep2";
import { Vector2 } from "../math/Math";
import { BrepMeshBuilder } from "./BrepMeshBuilder";
import { CreateAssistPoint, type UserData } from "./UserData";
import * as THREE from "three";
import { GeomType } from "../core/Constents";

type DocNode = {
  userData: UserData,
}

function ImportJson(json: string): THREE.Object3D[] {
  let results: THREE.Object3D[] = [];
  const jsonData = JSON.parse(json);
  let datas = jsonData as Array<DocNode>;
  for (let i = 0; i < datas.length; i++) {
    let userData = datas[i].userData as UserData;
    if (userData.type === undefined || userData.type === null) {
      continue;
    }
    userData.assistPoints.forEach((a) => {
      a.p = Vector2.Unserialize(a.p);
    });
    let originals = unserialize(userData.original);
    if (originals.length == 1) {
      let original = originals[0];
      if (original instanceof Vector2) {
        let geo = CreateAssistPoint({ p: original, c: userData.color });
        userData.original = original;
        geo.userData = userData;
        results.push(geo);
      }
      if (original instanceof Edge2) {
        let geo = BrepMeshBuilder.BuildEdge2Mesh(original, userData.color, null, null);
        userData.original = original;
        geo.userData = userData;
        for (let j = 0; j < userData.assistPoints.length; j++) {
          let assistPoint = userData.assistPoints[j];
          let p = Vector2.Unserialize(assistPoint.p);
          geo.children.push(CreateAssistPoint({ p: p, c: assistPoint.c }));
        }
        results.push(geo);
      }
      if (original instanceof Face2) {
        let geo = BrepMeshBuilder.BuildFace2Mesh(original, userData.color, null, null);
        userData.original = original;
        geo.userData = userData;
        for (let j = 0; j < userData.assistPoints.length; j++) {
          let assistPoint = userData.assistPoints[j];
          let p = Vector2.Unserialize(assistPoint.p);
          geo.children.push(CreateAssistPoint({ p: p, c: assistPoint.c }));
        }
        results.push(geo);
      }
    }

    if (originals.length > 1) {
      if (originals[0] instanceof Edge2) {
        let geo = BrepMeshBuilder.BuildEdge2sMesh(originals as Edge2[], userData.color, null, null);
        userData.original = originals;
        geo.userData = userData;
        for (let j = 0; j < userData.assistPoints.length; j++) {
          let assistPoint = userData.assistPoints[j];
          let p = Vector2.Unserialize(assistPoint.p);
          geo.children.push(CreateAssistPoint({ p: p, c: assistPoint.c }));
        }
        results.push(geo);
      }
      if (originals[0] instanceof Face2) {
        let geo = BrepMeshBuilder.BuildFace2sMesh(originals as Face2[], userData.color, null, null);
        userData.original = originals;
        geo.userData = userData;
        for (let j = 0; j < userData.assistPoints.length; j++) {
          let assistPoint = userData.assistPoints[j];
          let p = Vector2.Unserialize(assistPoint.p);
          geo.children.push(CreateAssistPoint({ p: p, c: assistPoint.c }));
        }
        results.push(geo);
      }
    }
  }
  return results;
}
export type {
  DocNode,
};
export {
  ImportJson
}
