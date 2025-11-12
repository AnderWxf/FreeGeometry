import { Vector2, type Vector3 } from "../../../math/Math";
import { Arc2Data } from "../../data/base/curve2/Arc2Data";
import { Line2Data } from "../../data/base/curve2/Line2Data";
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
        let ret = new Edge2();
        ret.u = new Vector2(0, Math.PI * 2);
        let curve = CurveBuilder.BuildCircle2FromCenterRadius(c, r);
        ret.curve = curve;
        return ret;
    }

    /**
     * build circle arc edge2 from bengin center end point.
     *
     * @param {Vector2} [c] - The center point.
     * @param {Vector2} [b] - The bengin point.
     * @param {Vector2} [e] - The end point.
     */
    static BuildCircleArcEdge2FromCenterBeginEndPoin(c: Vector2, b: Vector2, e: Vector2): Edge2 {
        let ret = new Edge2();
        let curve = CurveBuilder.BuildCircle2FromCenterBeginEndPoint(c, b);
        let algor = CurveBuilder.Algorithm2ByData(curve);
        ret.u = new Vector2(algor.u(b), algor.u(e));
        ret.curve = curve;
        return ret;
    }

    /**
     * build circle edge2 from bengin middle end point.
     * bengin middle end point on citcle.
     * 
     * D = 2 * (x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2));
     * Ux = [(x1^2 + y1^2)(y2-y3) + (x2^2 + y2^2)(y3-y1) + (x3^2 + y3^2)(y1-y2)]/D
     * Uy = [(x1^2 + y1^2)(x3-x2) + (x2^2 + y2^2)(x1-x3) + (x3^2 + y3^2)(x2-x1)]/D
     * 
     * @param {Vector2} [b] - The bengin point.
     * @param {Vector2} [m] - The middle point.
     * @param {Vector2} [e] - The end point.
     */
    static BuildCircleFromBeginMiddleEndPoint(b: Vector2, m: Vector2, e: Vector2): Edge2 {
        let ret = new Edge2();
        let curve = CurveBuilder.BuildCircle2FromBeginMiddleEndPoint(b, m, e);
        ret.u = new Vector2(0, Math.PI * 2);
        ret.curve = curve;
        return ret;
    }

    /**
     * build arc edge2 from bengin center end point.
     *
     * @param {Vector2} [b] - The bengin point.
     * @param {Vector2} [c] - The center point.
     * @param {Vector2} [e] - The end point.
     */
    static BuildEllipseEdge2FromCenterBeginEndPoint(c: Vector2, b: Vector2, e: Vector2): Edge2 {
        let ret = new Edge2();
        let curve = CurveBuilder.BuildEllipse2FromCenterBeginEndPoint(c, b, e);
        ret.u = new Vector2(0, Math.PI * 2);
        ret.curve = curve;
        return ret;
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

    /**
     * return legnth if this edge.
     *
     * @param {number} [u ∈ [0,a]] - the u parameter of curve.
     * @retun {Matrix2}
     */
    static Length(e: Edge2, tol = 0.0001): number {
        if (e.curve instanceof Line2Data) {
            return Math.abs(e.u.y - e.u.x);
        }
        else if (e.curve instanceof Arc2Data) {
            if (e.curve.radius.x == e.curve.radius.y) {
                return 2 * Math.abs(e.u.y - e.u.x) * e.curve.radius.x
            }
        }
        // 细分求和
        let algor = CurveBuilder.Algorithm2ByData(e.curve);
        let length = 0;
        let ps = new Array<{ u: number, p: Vector2 }>();
        ps.push({ u: e.u.x, p: algor.p(e.u.x) });
        ps.push({ u: e.u.y, p: algor.p(e.u.y) });
        length = ps[0].p.distanceTo(ps[1].p);
        while (1) {
            let ps_ = new Array<{ u: number, p: Vector2 }>();
            var l = 0;
            for (let i = 1; i < ps.length; i++) {
                let p0 = ps[i - 1];
                let p1 = ps[i];
                let u = (p0.u + p1.u) * 0.5;
                let p = algor.p(u);
                l += p.distanceTo(p0.p) + p.distanceTo(p1.p)
                ps_.push(p0);
                ps_.push({ u: u, p: p });
            }
            ps_.push(ps[ps.length - 1]);
            if (Math.abs(l - length) < tol) {
                return l;
            }
            length = l;
            ps = ps_;
        }
    }
}

export { Brep2Builder };