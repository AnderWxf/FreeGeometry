import { Edge2Algo } from "../../geometry/algorithm/brep/Brep2Algo";
import { Point2Data } from "../../geometry/data/base/Point2Data";
import { Edge2 } from "../../geometry/data/brep/Brep2";
import type { UserData } from "../../helper/UserData";
import { Vector2 } from "../../math/Math";

export function process(input: any[]): any {
  let algo:Edge2Algo;
  let points: Vector2[] = [];
  for (let i = 0; i < input.length; i++) {
    let userData = input[i].userData as UserData;
    if (userData.original instanceof Edge2){ 
      algo = new Edge2Algo(userData.original);
    }
    if (userData.original instanceof Vector2) {
      points.push(userData.original);
    }
    if (userData.original instanceof Point2Data) {
      points.push(userData.original.pos);
    }
  }
  let as: Object[] = [];
  let ai: Object[] = [];
  let ab: Object[] = [];
  let ao: Object[] = [];

  for (let i = 0; i < points.length; i++) {
    let point = points[i];

    let isAtSpace = algo.isSpacePoint(point, 1e-4, 1e-10);
    let isAtInner = algo.isPointAtInner(point, 1e-4, 1e-10);
    let isAtBoder = algo.isPointAtBoder(point, 1e-4, 1e-10);
    let isAtOn = algo.isPointOn(point, 1e-4, 1e-10);

    as.push({ userData: { "original": isAtSpace } });
    ai.push({ userData: { "original": isAtInner } });
    ab.push({ userData: { "original": isAtBoder } });
    ao.push({ userData: { "original": isAtOn } });
  }
  let resut = {
    as: as,
    ai: ai,
    ab: ab,
    ao: ao,
  }
  return resut;
}