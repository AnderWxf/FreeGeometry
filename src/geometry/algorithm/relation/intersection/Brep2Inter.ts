import { PI2, toRange } from "../../../../math/MathUtils";
import { Arc2Data } from "../../../data/base/curve2/Arc2Data";
import { Hyperbola2Data } from "../../../data/base/curve2/Hyperbola2Data";
import { Line2Data } from "../../../data/base/curve2/Line2Data";
import { Nurbs2Data } from "../../../data/base/curve2/Nurbs2Data";
import { Parabola2Data } from "../../../data/base/curve2/Parabola2Data";
import type { Curve2Data } from "../../../data/base/Curve2Data";
import type { Edge2, Face2 } from "../../../data/brep/Brep2";
import type { Face2Algo, Face2Algos } from "../../brep/Brep2Algo";
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
      let e0IsOnURange = false;
      let e1IsOnURange = false;
      if (c0 instanceof Arc2Data) {
        e0IsOnURange = e0.isOnURangePeriod(inter.u0, PI2, tol1);
        if (e0IsOnURange) {
          inter.u0 = toRange(inter.u0, e0.umin, e0.umax, PI2);
        }
      } else {
        e0IsOnURange = e0.isOnURange(inter.u0, tol1)
      }
      if (c1 instanceof Arc2Data) {
        e1IsOnURange = e1.isOnURangePeriod(inter.u1, PI2, tol1);
        if (e1IsOnURange) {
          inter.u1 = toRange(inter.u1, e1.umin, e1.umax, PI2);
        }
      } else {
        e1IsOnURange = e1.isOnURange(inter.u1, tol1)
      }
      if (e0IsOnURange && e1IsOnURange) {
        result.push(inter);
      }
    }
    for (let i = result.length - 1; i > 0; i--) {
      let curr = result[i];
      let pre = result[i - 1];
      if (curr.p.distanceTo(pre.p) < tol0
        && Math.abs(curr.u0 - pre.u0) < tol1
        && Math.abs(curr.u1 - pre.u1) < tol1
      ) {
        result.splice(i, 1);
      }
    }

    return result;
  }

  /**
   * compute edge to edge intersection point.
   *
   * @param {Face2Algo} [f0] - The frist curve , binary search curve.
   * @param {Face2Algo} [f1] - The second curve , general equation curve.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  public static FaceXFace(f0: Face2Algo | Face2Algos, f1: Face2Algo | Face2Algos, tol0: number, tol1: number): Array<InterOfFace2> {
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
      let coedges0 = f0.getCoedgesByCurve(interf.c0);
      let coedges1 = f1.getCoedgesByCurve(interf.c1);
      if (coedges0.length == 0 || coedges1.length == 0) {
        ret.splice(i, 1);
        continue;
      }
      let count1 = interf.is.length;
      for (let j = count1 - 1; j > -1; j--) {
        let isValid0 = false;
        let isValid1 = false;
        let interp = interf.is[j];
        for (let l = 0; l < coedges0.length; l++) {
          let isOn = coedges0[l].isOnURange(interp.u0, tol1);
          if (isOn) {
            isValid0 = true;
            break;
          }
        }
        for (let l = 0; l < coedges1.length; l++) {
          let isOn = coedges1[l].isOnURange(interp.u1, tol1);
          if (isOn) {
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