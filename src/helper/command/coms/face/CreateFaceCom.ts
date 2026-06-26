import { ComCreate } from "../ComCreate";
import type { CommandExecuter } from "../../CommandExecuter";
import { Coedge2, Edge2, Face2, Vertice2 } from "../../../../geometry/data/brep/Brep2";


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
}
export { CreateFaceCom };