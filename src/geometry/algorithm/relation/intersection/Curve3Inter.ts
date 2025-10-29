import type { Vector3 } from "../../../../math/Math";
import type { Arc3Data } from "../../../data/base/curve/curve3/Arc3Data";
import type { Line3Data } from "../../../data/base/curve/curve3/Line3Data";
import type { Nurbs3Data } from "../../../data/base/curve/curve3/Nurbs3Data";
import type { Curve3Data } from "../../../data/base/curve/Curve3Data";

/**
 * compute curve intersection point utility.
 *
 */
class InterOfCurve3 {
    pos: Vector3;   // Position of intersection point.
    t0: number;     // The t parameter of intersection point on curve0.
    t1: number;     // The t parameter of intersection point on curve1.
}
class Curve3Inter {

    /**
     * compute line to line intersection point.
     *
     * @param {Line3Data} [c0] - The frist curve.
     * @param {Line3Data} [c1] - The second curve.
     * @param {number} [tol] - The tolerance of distance.
     */
    static LineXLine(c0: Line3Data, c1: Line3Data, tol: number): Array<InterOfCurve3> {
        return null;
    }

    /**
     * compute line to arc intersection point.
     *
     * @param {Line3Data} [c0] - The frist curve.
     * @param {Arc3Data} [c1] - The second curve.
     * @param {number} [tol] - The tolerance of distance.
     */
    static LineXEllipseArc(c0: Line3Data, c1: Arc3Data, tol: number): Array<InterOfCurve3> {
        return null;
    }

    /**
     * compute line to nurbs intersection point.
     *
     * @param {Line3Data} [c0] - The frist curve.
     * @param {Nurbs3Data} [c1] - The second curve.
     * @param {number} [tol] - The tolerance of distance.
     */
    static LineXNurbs(c0: Line3Data, c1: Nurbs3Data, tol: number): Array<InterOfCurve3> {
        return null;
    }

    /**
     * compute arc to arc intersection point.
     *
     * @param {Arc3Data} [c0] - The frist curve.
     * @param {Arc3Data} [c1] - The second curve.
     * @param {number} [tol] - The tolerance of distance.
     */
    static EllipseArcXEllipseArc(c0: Arc3Data, c1: Arc3Data, tol: number): Array<InterOfCurve3> {
        return null;
    }

    /**
     * compute arc to nurbs intersection point.
     *
     * @param {Arc3Data} [c0] - The frist curve.
     * @param {Nurbs3Data} [c1] - The second curve.
     * @param {number} [tol] - The tolerance of distance.
     */
    static EllipseArcXNurbs(c0: Arc3Data, c1: Nurbs3Data, tol: number): Array<InterOfCurve3> {
        return null;
    }

    /**
     * compute nurbs to nurbs intersection point.
     *
     * @param {Nurbs3Data} [c0] - The frist curve.
     * @param {Nurbs3Data} [c1] - The second curve.
     * @param {number} [tol] - The tolerance of distance.
     */
    static NurbsXNurbs(c0: Nurbs3Data, c1: Nurbs3Data, tol: number): Array<InterOfCurve3> {
        return null;
    }

    /**
     * compute curve to curve intersection point.
     *
     * @param {Curve3Data} [c0] - The frist curve.
     * @param {Curve3Data} [c1] - The second curve.
     * @param {number} [tol] - The tolerance of distance.
     */
    private static CurveXCurve(c0: Curve3Data, c1: Curve3Data, tol: number): Array<InterOfCurve3> {
        return null;
    }
}

export { Curve3Inter };