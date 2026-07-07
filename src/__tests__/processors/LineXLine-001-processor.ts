import { Brep2Inter } from "../../geometry/algorithm/relation/intersection/Brep2Inter";
import type { Edge2 } from "../../geometry/data/brep/Brep2";

export function process(input: any[]): any[] {

  let edge1 = input[0].userData.original as Edge2;
  let edge2 = input[1].userData.original as Edge2;

  let p = Brep2Inter.EdgeXEdge(edge1, edge2, 1e-4, 1e-10)[0].p;

  let userData = {
    "canPick": true,
    "isAssist": true,
    "color": 255,
    "original": p
  }

  // 这里替换为你的实际业务逻辑
  // 例如：对输入数据进行转换、计算等
  return [{ userData: userData }];
}