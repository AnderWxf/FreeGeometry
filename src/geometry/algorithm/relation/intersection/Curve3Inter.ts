import type { Vector3 } from "../../../../math/Math";
import { Arc3Data } from "../../../data/base/curve3/Arc3Data";
import { Hyperbola3Data } from "../../../data/base/curve3/Hyperbola3Data";
import { Line3Data } from "../../../data/base/curve3/Line3Data";
import { Nurbs3Data } from "../../../data/base/curve3/Nurbs3Data";
import { Parabola3Data } from "../../../data/base/curve3/Parabola3Data";
import { UvCurveData } from "../../../data/base/curve3/UvCurveData";
import type { Curve3Data } from "../../../data/base/Curve3Data";

/**
 * compute curve intersection point utility.
 *
 */
class InterOfCurve3 {
  p: Vector3;   // Position of intersection point.
  u0: number;     // The u parameter of intersection point on curve0.
  u1: number;     // The u parameter of intersection point on curve1.
}
class Curve3Inter {

  /**
   * compute line to line intersection point.
   *
   * @param {Line3Data} [c0] - The frist curve.
   * @param {Line3Data} [c1] - The second curve.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  static LineXLine(c0: Line3Data, c1: Line3Data, tol0: number, tol1: number): Array<InterOfCurve3> {
    return null;
  }

  /**
   * compute line to arc intersection point.
   *
   * @param {Line3Data} [c0] - The frist curve.
   * @param {Arc3Data} [c1] - The second curve.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  static LineXArc(c0: Line3Data, c1: Arc3Data, tol0: number, tol1: number): Array<InterOfCurve3> {
    return null;
  }

  /**
   * compute line to hyperbola intersection point.
   *
   * @param {Line3Data} [c0] - The frist curve.
   * @param {Hyperbola3Data} [c1] - The second curve.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  static LineXHyperbola(c0: Line3Data, c1: Hyperbola3Data, tol0: number, tol1: number): Array<InterOfCurve3> {
    return null;
  }

  /**
   * compute line to parabola intersection point.
   *
   * @param {Line3Data} [c0] - The frist curve.
   * @param {Parabola3Data} [c1] - The second curve.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  static LineXParabola(c0: Line3Data, c1: Parabola3Data, tol0: number, tol1: number): Array<InterOfCurve3> {
    return null;
  }

  /**
   * compute line to nurbs intersection point.
   *
   * @param {Line3Data} [c0] - The frist curve.
   * @param {Nurbs3Data} [c1] - The second curve.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  static LineXNurbs(c0: Line3Data, c1: Nurbs3Data, tol0: number, tol1: number): Array<InterOfCurve3> {
    return null;
  }

  /**
   * compute line to UvCurve intersection point.
   *
   * @param {Line3Data} [c0] - The frist curve.
   * @param {UvCurveData} [c1] - The second curve.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  static LineXUvCurve(c0: Line3Data, c1: UvCurveData, tol0: number, tol1: number): Array<InterOfCurve3> {
    return null;
  }

  /**
   * compute arc to arc intersection point.
   *
   * @param {Arc3Data} [c0] - The frist curve.
   * @param {Arc3Data} [c1] - The second curve.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  static ArcXArc(c0: Arc3Data, c1: Arc3Data, tol0: number, tol1: number): Array<InterOfCurve3> {
    return null;
  }

  /**
   * compute arc to nurbs intersection point.
   *
   * @param {Arc3Data} [c0] - The frist curve.
   * @param {Nurbs3Data} [c1] - The second curve.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  static ArcXNurbs(c0: Arc3Data, c1: Nurbs3Data, tol0: number, tol1: number): Array<InterOfCurve3> {
    return null;
  }

  /**
   * compute nurbs to nurbs intersection point.
   *
   * @param {Nurbs3Data} [c0] - The frist curve.
   * @param {Nurbs3Data} [c1] - The second curve.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  static NurbsXNurbs(c0: Nurbs3Data, c1: Nurbs3Data, tol0: number, tol1: number): Array<InterOfCurve3> {
    return null;
  }

  /**
   * compute curve to curve intersection point.
   *
   * @param {Curve3Data} [c0] - The frist curve.
   * @param {Curve3Data} [c1] - The second curve.
   * @param {number} [segment] - The segment of frist curve.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  private static CurveXCurve(c0: Curve3Data, c1: Curve3Data, segment: number, tol0: number, tol1: number): Array<InterOfCurve3> {
    return null;
  }

  /**
   * compute curve to curve intersection point.
   *
   * @param {Curve3Data} [c0] - The frist curve , binary search curve.
   * @param {Curve3Data} [c1] - The second curve , general equation curve.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  public static X(c0: Curve3Data, c1: Curve3Data, tol0: number, tol1: number): Array<InterOfCurve3> {
    let inters: Array<InterOfCurve3> = [];
    if (c0 instanceof Line3Data) {
      if (c1 instanceof Line3Data) {
        inters.push(...Curve3Inter.LineXLine(c0, c1, tol0, tol1));
      }
      else if (c1 instanceof Arc3Data) {
        inters.push(...Curve3Inter.LineXArc(c0, c1, tol0, tol1));
      }
      else if (c1 instanceof Hyperbola3Data) {
        inters.push(...Curve3Inter.LineXHyperbola(c0, c1, tol0, tol1));
      }
      else if (c1 instanceof Parabola3Data) {
        inters.push(...Curve3Inter.LineXParabola(c0, c1, tol0, tol1));
      }
      else if (c1 instanceof Nurbs3Data) {
        inters.push(...Curve3Inter.LineXNurbs(c0, c1, tol0, tol1));
      }
      else if (c1 instanceof UvCurveData) {
        inters.push(...Curve3Inter.LineXUvCurve(c0, c1, tol0, tol1));
      }
    }
    else if (c1 instanceof Line3Data) {
      if (c0 instanceof Arc3Data) {
        inters.push(...Curve3Inter.SwapU(Curve3Inter.LineXArc(c1, c0, tol0, tol1)));
      }
      else if (c0 instanceof Hyperbola3Data) {
        inters.push(...Curve3Inter.SwapU(Curve3Inter.LineXHyperbola(c1, c0, tol0, tol1)));
      }
      else if (c0 instanceof Parabola3Data) {
        inters.push(...Curve3Inter.SwapU(Curve3Inter.LineXParabola(c1, c0, tol0, tol1)));
      }
      else if (c0 instanceof Nurbs3Data) {
        inters.push(...Curve3Inter.SwapU(Curve3Inter.LineXNurbs(c1, c0, tol0, tol1)));
      }
      else if (c0 instanceof UvCurveData) {
        inters.push(...Curve3Inter.SwapU(Curve3Inter.LineXUvCurve(c1, c0, tol0, tol1)));
      }
    }
    // else if (c0 instanceof Arc3Data || c0 instanceof Hyperbola3Data || c0 instanceof Parabola3Data) {
    //   if (c0 instanceof Arc3Data && c1 instanceof Arc3Data) {
    //     if (c0.radius.x === c0.radius.y && c1.radius.x === c1.radius.y) {
    //       inters.push(...Curve3Inter.QuadraticXQuadratic(c0, c1, tol0, tol1, 3));
    //     } else {
    //       inters.push(...Curve3Inter.QuadraticXQuadratic(c0, c1, tol0, tol1, 4));
    //     }
    //   }
    //   else if (c1 instanceof Arc3Data || c1 instanceof Hyperbola3Data || c1 instanceof Parabola3Data) {
    //     inters.push(...Curve3Inter.QuadraticXQuadratic(c0, c1, tol0, tol1));
    //   }
    //   else if (c1 instanceof Nurbs3Data) {
    //     inters.push(...Curve3Inter.QuadraticXNurbs(c0, c1, tol0, tol1));
    //   }
    // }
    else if (c0 instanceof Nurbs3Data) {
      if (c1 instanceof Nurbs3Data) {
        inters.push(...Curve3Inter.NurbsXNurbs(c0, c1, tol0, tol1));
      }
    } else {
      inters.push(...Curve3Inter.CurveXCurve(c0, c1, 513, tol0, tol1));
    }
    return inters;
  }

  /**
   * swap u of curve to curve intersection point.
   *
   * @param {InterOfCurve3} [inters] - The intersection of curve to curve.
   */
  private static SwapU(inters: Array<InterOfCurve3>): Array<InterOfCurve3> {
    inters.forEach((inter) => {
      let temp = inter.u0;
      inter.u0 = inter.u1;
      inter.u1 = temp;
    });
    return inters;
  }

}

export { Curve3Inter, InterOfCurve3 };