import { Face2Algo } from "../../geometry/algorithm/brep/Brep2Algo";
import { Point2Data } from "../../geometry/data/base/Point2Data";
import { Face2 } from "../../geometry/data/brep/Brep2";
import type { UserData } from "../../helper/UserData";
import { Vector2 } from "../../math/Math";

export function process(input: any[]): any {
  let algo: Face2Algo;
  let points: Vector2[] = [];
  for (let i = 0; i < input.length; i++) {
    let userData = input[i].userData as UserData;
    if (userData.original instanceof Face2) {
      algo = new Face2Algo(userData.original);
    }
    if (userData.original instanceof Vector2) {
      points.push(userData.original);
    }
    if (userData.original instanceof Point2Data) {
      points.push(userData.original.pos);
    }
  }

  let ai: Object[] = [];
  let ab: Object[] = [];
  let ao: Object[] = [];

  for (let i = 0; i < points.length; i++) {
    let point = points[i];

    let isAtInner = algo.isPointAtInner(point, 1e-4, 1e-10);
    let isAtBoder = algo.isPointAtBoder(point, 1e-4, 1e-10);
    let isAtOn = algo.isPointOn(point, 1e-4, 1e-10);

    ai.push({ userData: { "original": isAtInner } });
    ab.push({ userData: { "original": isAtBoder } });
    ao.push({ userData: { "original": isAtOn } });
  }
  let resut = {
    ai: ai,
    ab: ab,
    ao: ao,
  }
  return resut;
}