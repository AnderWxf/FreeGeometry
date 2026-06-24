import { unserialize } from "../geometry/data/base/Unserialize";
import { Edge2, Face2 } from "../geometry/data/brep/Brep2";
import { Vector2 } from "../math/Math";
import { BrepMeshBuilder } from "./BrepMeshBuilder";
import { CreateAssistPoint, type UserData } from "./UserData";
import * as THREE from "three";

type DocNode = {
  userData: UserData,
}

function ImportJson(json: string): THREE.Object3D[] {
  let results: THREE.Object3D[] = [];
  const jsonData = JSON.parse(json);
  let datas = jsonData as Array<DocNode>;
  for (let i = 0; i < datas.length; i++) {
    let userData = datas[i].userData;
    let original = unserialize(userData.original);
    if (original instanceof Edge2) {
      let geo = BrepMeshBuilder.BuildEdge2Mesh(original, userData.color, null, null, userData.canPick);
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
      let geo = BrepMeshBuilder.BuildFace2Mesh(original, userData.color, null, null, userData.canPick);
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
  return results;
}
export type {
  DocNode,
};
export {
  ImportJson
}
