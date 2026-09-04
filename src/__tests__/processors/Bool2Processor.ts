import { Brep2Inter } from "../../geometry/algorithm/relation/intersection/Brep2Inter";
import { Edge2 } from "../../geometry/data/brep/Brep2";

export function process(edge1: Edge2, edge2: Edge2): any[] {

  let resut: any[] = [];
  if (edge1 === null || edge2 === null) {
    return resut;
  }
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
  inters = Brep2Inter.EdgeXEdge(edge2, edge1, 1e-4, 1e-10);
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