import type { Vector2 } from "../../../../math/Math";
import type { Arc2Data } from "../../../data/base/curve/curve2/Arc2Data";
import type { Line2Data } from "../../../data/base/curve/curve2/Line2Data";
import type { Nurbs2Data } from "../../../data/base/curve/curve2/Nurbs2Data";
import type { Curve2Data } from "../../../data/base/curve/Curve2Data";

/**
 * compute curve intersection point utility.
 *
 */
class InterOfCurve2 {
    pos: Vector2;   // Position of intersection point.
    t0: number;     // The t parameter of intersection point on curve0.
    t1: number;     // The t parameter of intersection point on curve1.
}
class Curve2Inter {

    /**
     * compute line to line intersection point.
     *
     * @param {Line2Data} [c0] - The frist curve.
     * @param {Line2Data} [c1] - The second curve.
     * @param {number} [tol] - The tolerance of distance.
     */
    static LineXLine(c0: Line2Data, c1: Line2Data, tol: number): Array<InterOfCurve2> {
        return null;
    }

    /**
     * compute line to arc intersection point.
     *
     * @param {Line2Data} [c0] - The frist curve.
     * @param {Arc2Data} [c1] - The second curve.
     * @param {number} [tol] - The tolerance of distance.
     */
    static LineXEllipseArc(c0: Line2Data, c1: Arc2Data, tol: number): Array<InterOfCurve2> {
        return null;
    }

    /**
     * compute line to nurbs intersection point.
     *
     * @param {Line2Data} [c0] - The frist curve.
     * @param {Nurbs2Data} [c1] - The second curve.
     * @param {number} [tol] - The tolerance of distance.
     */
    static LineXNurbs(c0: Line2Data, c1: Nurbs2Data, tol: number): Array<InterOfCurve2> {
        return null;
    }

    /**
     * compute arc to arc intersection point.
     *
     * @param {Arc2Data} [c0] - The frist curve.
     * @param {Arc2Data} [c1] - The second curve.
     * @param {number} [tol] - The tolerance of distance.
     */
    static EllipseArcXEllipseArc(c0: Arc2Data, c1: Arc2Data, tol: number): Array<InterOfCurve2> {
        return null;
    }

    /**
     * compute arc to nurbs intersection point.
     *
     * @param {Arc2Data} [c0] - The frist curve.
     * @param {Nurbs2Data} [c1] - The second curve.
     * @param {number} [tol] - The tolerance of distance.
     */
    static EllipseArcXNurbs(c0: Arc2Data, c1: Nurbs2Data, tol: number): Array<InterOfCurve2> {
        return null;
    }

    /**
     * compute nurbs to nurbs intersection point.
     *
     * @param {Nurbs2Data} [c0] - The frist curve.
     * @param {Nurbs2Data} [c1] - The second curve.
     * @param {number} [tol] - The tolerance of distance.
     */
    static NurbsXNurbs(c0: Nurbs2Data, c1: Nurbs2Data, tol: number): Array<InterOfCurve2> {
        return null;
    }

    /**
     * compute curve to curve intersection point.
     *
     * @param {Curve2Data} [c0] - The frist curve.
     * @param {Curve2Data} [c1] - The second curve.
     * @param {number} [tol] - The tolerance of distance.
     */
    private static CurveXCurve(c0: Curve2Data, c1: Curve2Data, tol: number): Array<InterOfCurve2> {
        return null;
    }
}

export { Curve2Inter };