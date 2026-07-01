import { ComCreate } from "../ComCreate";
import type { CommandExecuter } from "../../CommandExecuter";
import { Coedge2, Digraph2, Edge2, Face2, Vertice2 } from "../../../../geometry/data/brep/Brep2";
import { Digraph2Algo } from "../../../../geometry/algorithm/brep/Brep2Algo";


/**
 * Create face command class.
 * 
 */
class CreateFaceCom extends ComCreate {
  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
  }

  protected createFace(edges: Edge2[]): Face2 {
    // 创建一个面
    let face = new Face2();
    for (let i = 0; i < edges.length; i++) {
      face.vertices.push(new Vertice2());
    }
    for (let i = 0; i < edges.length; i++) {
      let edge = edges[i];
      edge.v0 = face.vertices[i];
      edge.v1 = face.vertices[(i + 1) % edges.length];
      let coedge = new Coedge2();
      coedge.e = edge;
      face.border.coedges.push(coedge);
      face.curves.push(edge.curve);
      edge.curve = null;
      edge.curvei = i;
    }
    return face;
  }

  protected createFaces(edges: Edge2[], tol0: number, tol1: number): Face2[] {
    // 构建全新的有向图
    let galgo = new Digraph2Algo(new Digraph2());
    galgo.addEdges(edges, tol0);
    let alloops = galgo.getAllLoops();
    // 删除面积为0或者反向的环
    let count = alloops.length;
    for (let i = count - 1; i > -1; i--) {
      // 面积 <= 0
      if (alloops[i].area() <= tol1) {
        alloops.splice(i, 1);
      }
    }
    let result: Face2[] = [];
    if (alloops.length) {
      // 获得一个外层loop
      let count = alloops.length;
      for (let i = count - 1; i > -1; i--) {
        let f = new Face2();
        // 正向的外轮廓
        let outside = alloops[i];
        f.border = outside.loop;
        outside.coedges.forEach(coedge => {
          let index = f.curves.indexOf(coedge.curve.dat);
          if (index == -1) {
            index = f.curves.length;
            f.curves.push(coedge.curve.dat);
          }
          coedge.c.e.curve = null;
          coedge.c.e.curvei = index;
          if (!f.vertices.includes(coedge.c.e.v0)) {
            f.vertices.push(coedge.c.e.v0);
          }
          if (!f.vertices.includes(coedge.c.e.v1)) {
            f.vertices.push(coedge.c.e.v1);
          }
        });
        result.push(f);
      }
    }
    return result;
  }
}
export { CreateFaceCom };