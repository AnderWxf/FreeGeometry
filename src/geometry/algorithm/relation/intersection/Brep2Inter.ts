import { Arc2Data } from "../../../data/base/curve2/Arc2Data";
import { Hyperbola2Data } from "../../../data/base/curve2/Hyperbola2Data";
import { Line2Data } from "../../../data/base/curve2/Line2Data";
import { Nurbs2Data } from "../../../data/base/curve2/Nurbs2Data";
import { Parabola2Data } from "../../../data/base/curve2/Parabola2Data";
import type { Curve2Data } from "../../../data/base/Curve2Data";
import type { Edge2, Face2 } from "../../../data/brep/Brep2";
import { Curve2Inter, type InterOfCurve2 } from "./Curve2Inter";

/**
 * compute curve intersection point utility.
 *
 */
export type InterOfFace2 = {
  is: Array<InterOfCurve2>; // Position of intersection point on curve.
  c0: Curve2Data; // The curve of face0.
  c1: Curve2Data; // The curve of face1.
}

class Brep2Inter {
  /**
   * compute edge to edge intersection point.
   *
   * @param {Edge2} [c0] - The frist curve , binary search curve.
   * @param {Edge2} [c1] - The second curve , general equation curve.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  public static EdgeXEdge(e0: Edge2, e1: Edge2, tol0: number, tol1: number): Array<InterOfCurve2> {
    let c0 = e0.curve;
    let c1 = e1.curve;
    let result: Array<InterOfCurve2> = [];
    let inters = Curve2Inter.X(c0, c1, tol0, tol1);
    for (let i = 0; i < inters.length; i++) {
      let inter = inters[i];
      let e0ur = e0.ur;
      let e1ur = e1.ur;
      if (inter.u0 >= e0ur.x && inter.u0 <= e0ur.y &&
        inter.u1 >= e1ur.x && inter.u1 <= e1ur.y
      ) {
        result.push(inter);
      }
    }
    return result;
  }

  /**
   * compute edge to edge intersection point.
   *
   * @param {Edge2} [c0] - The frist curve , binary search curve.
   * @param {Edge2} [c1] - The second curve , general equation curve.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  public static FaceXFace(f0: Face2, f1: Face2, tol0: number, tol1: number): Array<InterOfFace2> {
    let cs0 = f0.curves;
    let cs1 = f1.curves;
    let ret: Array<InterOfFace2> = [];
    for (let i = 0; i < cs0.length; i++) {
      for (let j = 0; j < cs1.length; j++) {
        let inters: Array<InterOfCurve2> = [];
        let c0 = cs0[i];
        let c1 = cs1[j];
        inters.push(...Curve2Inter.X(c0, c1, tol0, tol1));
        if (inters.length) {
          ret.push({
            is: inters,
            c0: c0,
            c1: c1,
          });
        }
      }
    }

    // 过滤哪些不在边上的交点
    let count = ret.length;
    for (let i = count - 1; i > -1; i--) {
      let interf = ret[i];
      let edges0 = f0.getEdgesByCurve(interf.c0);
      let edges1 = f1.getEdgesByCurve(interf.c1);
      if (edges0.length == 0 || edges1.length == 0) {
        ret.splice(i, 1);
        continue;
      }
      let count1 = interf.is.length;
      for (let j = count1 - 1; j > -1; j--) {
        let isValid0 = false;
        let isValid1 = false;
        let interp = interf.is[j];
        for (let l = 0; l < edges0.length; l++) {
          let ur = edges0[l].ur;
          if (interp.u0 >= ur.x && interp.u0 <= ur.y) {
            isValid0 = true;
            break;
          }
        }
        for (let l = 0; l < edges1.length; l++) {
          let ur = edges1[l].ur;
          if (interp.u1 >= ur.x && interp.u1 <= ur.y) {
            isValid1 = true;
            break;
          }
        }
        if (!isValid0 || !isValid1) {
          interf.is.splice(j, 1);
        }
      }
      if (interf.is.length == 0) {
        ret.splice(i, 1);
      }
    }
    return ret;
  }
}
export { Brep2Inter };