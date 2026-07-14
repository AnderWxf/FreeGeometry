import { Edge2Algo } from "../../geometry/algorithm/brep/Brep2Algo";
import type { Edge2 } from "../../geometry/data/brep/Brep2";
import type { Vector2 } from "../../math/Math";

export function process(input: any[]): any {
  let edge = input[0].userData.original as Edge2;
  let algo = new Edge2Algo(edge);
  let points: Vector2[] = [];
  for (let i = 1; i < input.length; i++) {
    let point = input[i].userData.original as Vector2;
    points.push(point);
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