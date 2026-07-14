import { Face2Algo } from "../../geometry/algorithm/brep/Brep2Algo";
import type { Face2 } from "../../geometry/data/brep/Brep2";
import type { Vector2 } from "../../math/Math";

export function process(input: any[]): any {
  let face = input[0].userData.original as Face2;
  let algo = new Face2Algo(face);
  let points: Vector2[] = [];
  for (let i = 1; i < input.length; i++) {
    let point = input[i].userData.original as Vector2;
    points.push(point);
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