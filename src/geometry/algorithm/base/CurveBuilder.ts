import type { Vector2, Vector3 } from "../../../math/Math";
import type { Arc2Data } from "../../data/base/curve/curve2/Arc2Data";
import type { Line2Data } from "../../data/base/curve/curve2/Line2Data";
import type { Nurbs2Data } from "../../data/base/curve/curve2/Nurbs2Data";
import type { Arc3Data } from "../../data/base/curve/curve3/Arc3Data";
import type { Line3Data } from "../../data/base/curve/curve3/Line3Data";
import type { Nurbs3Data } from "../../data/base/curve/curve3/Nurbs3Data";

/**
 * curvr builder.
 *
 */
class CurveBuilder {
    /**
     * build line2 from begin point and end point.
     *
     * @param {Vector2} [b] - The begin point.
     * @param {Vector2} [e] - The end point.
     */
    static BuildLine2FromBeginEndPoint(b: Vector2, e: Vector2): Line2Data {
        debugger;
        return null;
    }

    /**
     * build circle from center point and radius.
     *
     * @param {Vector2} [c] - The center point.
     * @param {number} [r] - radius.
     */
    static BuildCircle2FromCenterRadius(c: Vector2, r: number): Arc2Data {
        debugger;
        return null;
    }

    /**
     * build circle from bengin center end point.
     *
     * @param {Vector2} [b] - The bengin point.
     * @param {Vector2} [c] - The center point.
     * @param {Vector2} [e] - The end point.
     */
    static BuildCircle2FromBeginCenterEndPoint(b: Vector2, c: Vector2, e: Vector2): Arc2Data {
        debugger;
        return null;
    }

    /**
     * build arc from bengin center end point.
     *
     * @param {Vector2} [b] - The bengin point.
     * @param {Vector2} [c] - The center point.
     * @param {Vector2} [e] - The end point.
     */
    static BuildArc2FromBeginCenterEndPoint(b: Vector2, c: Vector2, e: Vector2): Arc2Data {
        debugger;
        return null;
    }

    /**
     * build nurbs from fitting points.
     *
     * @param {Array<Vector2>} [points] - The fitting points.
     */
    static BuildNurbs2FromFittingPoints(points: Array<Vector2>): Nurbs2Data {
        debugger;
        return null;
    }

    /**
     * build line3 from begin point and end point.
     *
     * @param {Vector3} [b] - The begin point.
     * @param {Vector3} [e] - The end point.
     */
    static BuildLine3FromBeginEndPoint(b: Vector3, e: Vector3): Line3Data {
        debugger;
        return null;
    }

    /**
     * build circle from center point and radius.
     *
     * @param {Vector3} [c] - The center point.
     * @param {number} [r] - radius.
     */
    static BuildCircle3FromCenterRadius(c: Vector3, r: number): Arc3Data {
        debugger;
        return null;
    }

    /**
     * build circle from bengin center end point.
     *
     * @param {Vector3} [b] - The bengin point.
     * @param {Vector3} [c] - The center point.
     * @param {Vector3} [e] - The end point.
     */
    static BuildCircle3FromBeginCenterEndPoint(b: Vector3, c: Vector3, e: Vector3): Arc3Data {
        debugger;
        return null;
    }

    /**
     * build arc from bengin center end point.
     *
     * @param {Vector3} [b] - The bengin point.
     * @param {Vector3} [c] - The center point.
     * @param {Vector3} [e] - The end point.
     */
    static BuildArc3FromBeginCenterEndPoint(b: Vector3, c: Vector3, e: Vector3): Arc3Data {
        debugger;
        return null;
    }

    /**
     * build nurbs from fitting points.
     *
     * @param {Array<Vector3>} [points] - The fitting points.
     */
    static BuildNurbs3FromFittingPoints(points: Array<Vector3>): Nurbs3Data {
        debugger;
        return null;
    }

}

export { CurveBuilder };