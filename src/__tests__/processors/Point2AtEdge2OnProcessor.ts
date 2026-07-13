import type { Vector2Function } from "three/src/nodes/TSL";
import { Edge2Algo } from "../../geometry/algorithm/brep/Brep2Algo";
import { Brep2Inter } from "../../geometry/algorithm/relation/intersection/Brep2Inter";
import type { Edge2 } from "../../geometry/data/brep/Brep2";
import type { AssisPoint } from "../../helper/UserData";
import type { Vector2 } from "../../math/Math";

export function process(input: any[]): any[] {
  let edge = input[0].userData.original as Edge2;
  let algo = new Edge2Algo(edge);
  let points: Vector2[] = [];
  for (let i = 1; i < input.length; i++) {
    let point = input[i].userData.original as Vector2;
    points.push(point);
  }
  let resut = [];
  for (let i = 0; i < points.length; i++) {
    let is = algo.isPointOn(points[i], 1e-4, 1e-10);
    let userData = {
      "canPick": true,
      "isAssist": true,
      "color": 255,
      "original": is
    };
    resut.push({ userData: userData });
  }
  return resut;
}