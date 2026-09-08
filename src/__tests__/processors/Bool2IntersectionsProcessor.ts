import { GeomType } from "../../core/Constents";
import { Bool2 } from "../../geometry/algorithm/relation/bool/Bool2";
import { Face2 } from "../../geometry/data/brep/Brep2";
import type { UserData } from "../../helper/UserData";

export function process(a: Face2[], b: Face2[]): any[] {
  let result: any[] = [];
  let fs:Face2[] = [];
  if (a.length === 1 && b.length === 1) {
    fs =  Bool2.Intersection(a[0], b[0], 1e-4, 1e-10);
  } else {
    fs = Bool2.Intersections(a, b, 1e-4, 1e-10);
  }
  let userData = {
    type: GeomType.DRAW_SURFACE_SEC,
    typename: GeomType[GeomType.DRAW_SURFACE_SEC],
    canPick: true,
    isAssist: false,
    assistPoints: [],
    color: 255,
    original: (fs.length == 1 ? fs[0] : fs) as any,
  } as UserData;

  result.push({ userData: userData });
  return result;
}