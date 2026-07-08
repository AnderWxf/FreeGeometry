import { Brep2Inter } from "../../geometry/algorithm/relation/intersection/Brep2Inter";
import type { Edge2 } from "../../geometry/data/brep/Brep2";

export function process(input: any[]): any[] {
  let edge1 = input[0].userData.original as Edge2;
  let edge2 = input[1].userData.original as Edge2;

  let resut = [];
  let inters = Brep2Inter.EdgeXEdge(edge1, edge2, 1e-4, 1e-10);
  for (let i = 0; i < inters.length; i++) {
    let inter = inters[i];
    let p = inter.p;
    let userData = {
      "canPick": true,
      "isAssist": true,
      "color": 255,
      "original": p
    };
    resut.push({ userData: userData });
  }
  return resut;
}