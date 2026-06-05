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
      if (inter.u0 >= e0.u.x && inter.u0 <= e0.u.y &&
        inter.u1 >= e1.u.x && inter.u1 <= e1.u.y
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
        ret.push({
          is: inters,
          c0: c0,
          c1: c1,
        });
      }
    }
    return ret;
  }
}
export { Brep2Inter };