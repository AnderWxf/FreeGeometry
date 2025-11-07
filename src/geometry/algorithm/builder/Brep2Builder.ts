import { Vector2, type Vector3 } from "../../../math/Math";
import type { Curve2Data } from "../../data/base/Curve2Data";
import { Edge2, type Face2 } from "../../data/brep/Brep2";
import { CurveBuilder } from "./CurveBuilder";

/**
 * brep builder.
 *
 */
class Brep2Builder {

    /**
     * build line edge2 from begin point and end point.
     *
     * @param {Vector2} [b] - The begin point.
     * @param {Vector2} [e] - The end point.
     */
    static BuildLineEdge2FromBeginEndPoint(b: Vector2, e: Vector2): Edge2 {
        let ret = new Edge2();
        ret.u = new Vector2(0, b.distanceTo(e))
        let curve = CurveBuilder.BuildLine2FromBeginEndPoint(b, e);
        ret.curve = curve;
        return ret;
    }

    /**
     * build circle edge2 from center point and radius.
     *
     * @param {Vector2} [c] - The center point.
     * @param {number} [r] - radius.
     */
    static BuildCircleEdge2FromCenterRadius(c: Vector2, r: number): Edge2 {
        debugger;
        return null;
    }

    /**
     * build circle edge2 from bengin center end point.
     *
     * @param {Vector2} [b] - The bengin point.
     * @param {Vector2} [c] - The center point.
     * @param {Vector2} [e] - The end point.
     */
    static BuildCircleEdge2FromBeginCenterEndPoint(b: Vector2, c: Vector2, e: Vector2): Edge2 {
        debugger;
        return null;
    }

    /**
     * build arc edge2 from bengin center end point.
     *
     * @param {Vector2} [b] - The bengin point.
     * @param {Vector2} [c] - The center point.
     * @param {Vector2} [e] - The end point.
     */
    static BuildArcEdge2FromBeginCenterEndPoint(b: Vector2, c: Vector2, e: Vector2): Edge2 {
        debugger;
        return null;
    }

    /**
     * build nurbs edge2 from fitting points.
     *
     * @param {Array<Vector2>} [points] - The fitting points.
     */
    static BuildEdge2FromFittingPoints(points: Array<Vector2>): Edge2 {
        debugger;
        return null;
    }

    /**
     * build rectangle face from size vector.
     *
     * @param {Vector2} [size] - The size of rectangle.
     */
    static BuildRectangleFace(size: Vector2): Face2 {
        debugger;
        return null;
    }

    /**
     * build polygon face from points.
     *
     * @param {Vector2} [points] - The points of polygon.
     */
    static BuildPolygonFace(points: Array<Vector2>): Face2 {
        debugger;
        return null;
    }

    /**
     * build circle face from center and radius.
     *
     * @param {Vector2} [centor] - The points of polygon.
     * @param {number} [radius] - The radius of circle.
     */
    static BuildCircleFace(center: Vector2, radius: number): Face2 {
        debugger;
        return null;
    }

    /**
     * build circle face from center and radius.
     *
     * @param {Vector2} [centor] - The points of polygon.
     * @param {Vector2} [radius] - The radius of circle.
     */
    static BuildEllipseFace(center: Vector2, radius: Vector2): Face2 {
        debugger;
        return null;
    }

    /**
     * build face from cures that one by one closed.
     *
     * @param {Array<Curve2Data>} [cures] - The cures of face.
     */
    static BuildFace(cures: Array<Curve2Data>): Face2 {
        debugger;
        return null;
    }
}

export { Brep2Builder };