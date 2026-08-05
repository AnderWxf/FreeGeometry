import { Brep2Inter } from "../../geometry/algorithm/relation/intersection/Brep2Inter";
import { Edge2 } from "../../geometry/data/brep/Brep2";

export function process(input: any[]): any[] {
  let edge1: Edge2 = null;
  let edge2: Edge2 = null;

  for (let i = 0; i < input.length; i++) {
    if (input[i].userData.original instanceof Edge2) {
      if (edge1 === null) {
        edge1 = input[i].userData.original;
        continue;
      }
      if (edge2 === null) {
        edge2 = input[i].userData.original;
        continue;
      }
    }
  }

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