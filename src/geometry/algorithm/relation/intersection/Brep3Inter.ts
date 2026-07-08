import { Arc3Data } from "../../../data/base/curve3/Arc3Data";
import { Hyperbola3Data } from "../../../data/base/curve3/Hyperbola3Data";
import { Line3Data } from "../../../data/base/curve3/Line3Data";
import { Nurbs3Data } from "../../../data/base/curve3/Nurbs3Data";
import { Parabola3Data } from "../../../data/base/curve3/Parabola3Data";
import type { Curve3Data } from "../../../data/base/Curve3Data";
import type { Edge3, Face3 } from "../../../data/brep/Brep3";
import type { Face3Algo, Face3Algos } from "../../brep/Brep3Algo";
import { Curve3Inter, type InterOfCurve3 } from "./Curve3Inter";

/**
 * compute curve intersection point utility.
 *
 */
export type InterOfFace3 = {
  is: Array<InterOfCurve3>; // Position of intersection point on curve.
  c0: Curve3Data; // The curve of face0.
  c1: Curve3Data; // The curve of face1.
}

class Brep3Inter {
  /**
   * compute edge to edge intersection point.
   *
   * @param {Edge3} [c0] - The frist curve , binary search curve.
   * @param {Edge3} [c1] - The second curve , general equation curve.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  public static EdgeXEdge(e0: Edge3, e1: Edge3, tol0: number, tol1: number): Array<InterOfCurve3> {
    let c0 = e0.curve;
    let c1 = e1.curve;
    let result: Array<InterOfCurve3> = [];
    let inters = Curve3Inter.X(c0, c1, tol0, tol1);
    for (let i = 0; i < inters.length; i++) {
      let inter = inters[i];
      if (e0.isOnURange(inter.u0, tol1)
        && e1.isOnURange(inter.u1, tol1)) {
        result.push(inter);
      }
    }
    return result;
  }

  // /**
  //  * compute edge to edge intersection point.
  //  *
  //  * @param {Face3Algo} [f0] - The frist curve , binary search curve.
  //  * @param {Face3Algo} [f1] - The second curve , general equation curve.
  //  * @param {number} [tol0] - The tolerance of geometric.
  //  * @param {number} [tol1] - The tolerance of algebraic.
  //  */
  // public static FaceXFace(f0: Face3Algo | Face3Algos, f1: Face3Algo | Face3Algos, tol0: number, tol1: number): Array<InterOfFace3> {
  //   let cs0 = f0.curves;
  //   let cs1 = f1.curves;
  //   let ret: Array<InterOfFace3> = [];
  //   for (let i = 0; i < cs0.length; i++) {
  //     for (let j = 0; j < cs1.length; j++) {
  //       let inters: Array<InterOfFace3> = [];
  //       let c0 = cs0[i];
  //       let c1 = cs1[j];
  //       inters.push(...Curve3Inter.X(c0, c1, tol0, tol1));
  //       if (inters.length) {
  //         ret.push({
  //           is: inters,
  //           c0: c0,
  //           c1: c1,
  //         });
  //       }
  //     }
  //   }

  //   // 过滤哪些不在边上的交点
  //   let count = ret.length;
  //   for (let i = count - 1; i > -1; i--) {
  //     let interf = ret[i];
  //     let coedges0 = f0.getCoedgesByCurve(interf.c0);
  //     let coedges1 = f1.getCoedgesByCurve(interf.c1);
  //     if (coedges0.length == 0 || coedges1.length == 0) {
  //       ret.splice(i, 1);
  //       continue;
  //     }
  //     let count1 = interf.is.length;
  //     for (let j = count1 - 1; j > -1; j--) {
  //       let isValid0 = false;
  //       let isValid1 = false;
  //       let interp = interf.is[j];
  //       for (let l = 0; l < coedges0.length; l++) {
  //         let isOn = coedges0[l].isOnURange(interp.u0, tol1);
  //         if (isOn) {
  //           isValid0 = true;
  //           break;
  //         }
  //       }
  //       for (let l = 0; l < coedges1.length; l++) {
  //         let isOn = coedges1[l].isOnURange(interp.u1, tol1);
  //         if (isOn) {
  //           isValid1 = true;
  //           break;
  //         }
  //       }
  //       if (!isValid0 || !isValid1) {
  //         interf.is.splice(j, 1);
  //       }
  //     }
  //     if (interf.is.length == 0) {
  //       ret.splice(i, 1);
  //     }
  //   }
  //   return ret;
  // }
}
export { Brep3Inter };