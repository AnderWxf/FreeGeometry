import { Vector2, type Vector3 } from "../../../math/Math";
import { Arc2Data } from "../../data/base/curve2/Arc2Data";
import { Parabola2Data } from "../../data/base/curve2/Parabola2Data";
import { Line2Data } from "../../data/base/curve2/Line2Data";
import { Nurbs2Data } from "../../data/base/curve2/Nurbs2Data";
import type { Curve2Data } from "../../data/base/Curve2Data";
import { Arc3Data } from "../../data/base/curve3/Arc3Data";
import { Parabola3Data } from "../../data/base/curve3/Parabola3Data";
import { Line3Data } from "../../data/base/curve3/Line3Data";
import { Nurbs3Data } from "../../data/base/curve3/Nurbs3Data";
import type { Curve3Data } from "../../data/base/Curve3Data";
import { Transform2 } from "../../data/base/Transform2";
import { Arc2Algo } from "../base/curve2/Arc2Algo";
import { Parabola2Algo } from "../base/curve2/Parabola2Algo";
import { Line2Algo } from "../base/curve2/Line2Algo";
import { Nurbs2Algo } from "../base/curve2/Nurbs2Algo";
import type { Curve2Algo } from "../base/Curve2Algo";
import { Arc3Algo } from "../base/curve3/Arc3Algo";
import { Parabola3Algo } from "../base/curve3/Parabola3Algo";
import { Line3Algo } from "../base/curve3/Line3Algo";
import { Nurbs3Algo } from "../base/curve3/Nurbs3Algo";
import type { Curve3Algo } from "../base/Curve3Algo";
import { Hyperbola2Data } from "../../data/base/curve2/Hyperbola2Data";
import { Hyperbola2Algo } from "../base/curve2/Hyperbola2Algo";

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
        let ret = new Line2Data();
        ret.trans.pos = b;
        let r = e.clone().sub(b).normalize();
        ret.trans.rot = r.angle();
        return ret;
    }

    /**
     * build circle from center point and radius.
     *
     * @param {Vector2} [c] - The center point.
     * @param {number} [r] - radius.
     */
    static BuildCircle2FromCenterRadius(c: Vector2, r: number): Arc2Data {
        let ret = new Arc2Data();
        ret.trans.pos = c;
        ret.radius.set(r, r);
        return ret;
    }

    /**
     * build circle from bengin center end point.
     * 
     * @param {Vector2} [c] - The center point.
     * @param {Vector2} [b] - The bengin point.
     */
    static BuildCircle2FromCenterBeginEndPoint(c: Vector2, b: Vector2): Arc2Data {
        let ret = new Arc2Data();
        let r = c.distanceTo(b);
        ret.trans.pos = c;
        ret.radius.set(r, r);
        return ret;
    }

    /**
     * build circle from bengin middle end point.
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
    static BuildCircle2FromBeginMiddleEndPoint(b: Vector2, m: Vector2, e: Vector2): Arc2Data {
        let x1 = b.x, y1 = b.y, x2 = m.x, y2 = m.y, x3 = e.x, y3 = e.y;
        let D = 2 * (x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2));
        if (D == 0) {
            return null;
        }
        let sqrt1 = b.lengthSq();
        let sqrt2 = m.lengthSq();
        let sqrt3 = e.lengthSq();
        let Ux = (sqrt1 * (y2 - y3) + sqrt2 * (y3 - y2) + sqrt3 * (y1 - y2)) / D;
        let Uy = (sqrt1 * (x3 - x2) + sqrt2 * (x1 - x3) + sqrt3 * (x2 - x1)) / D;
        let center = new Vector2(Ux, Uy);
        let r = center.distanceTo(b);
        return new Arc2Data(new Transform2(center), new Vector2(r, r));
    }

    /**
     * build ellipse from bengin center end point.
     * center point is center of ellipse.
     * vector center to begin is major of radius.
     * the distance of end point project to major radius of ellipse is minor radius size of ellipse.
     * 
     * @param {Vector2} [c] - The center point.
     * @param {Vector2} [b] - The bengin point.
     * @param {Vector2} [e] - The end point.
     */
    static BuildEllipse2FromCenterBeginEndPoint(c: Vector2, b: Vector2, e: Vector2): Arc2Data {
        let major = b.clone().sub(c);
        let radius = new Vector2();
        radius.x = major.length();
        major.normalize();
        let rotation = Math.atan2(major.y, major.x);
        major.multiplyScalar(e.clone().dot(major));
        radius.y = e.distanceTo(major);
        let tr = new Transform2(c, rotation);
        return new Arc2Data(tr, radius);
    }

    /**
     * build hyperbola from bengin center end point.
     * center point is center of hyperbola.
     * vector center to begin is major of radius.
     * the distance of end point project to major radius of hyperbola is minor radius size of hyperbola.
     * 
     * @param {Vector2} [c] - The center point.
     * @param {Vector2} [a] - The a point.
     * @param {Vector2} [b] - The b point.
     */
    static BuildHyperbola2FromCenterABPoint(c: Vector2, a: Vector2, b: Vector2): Hyperbola2Data {
        let major = a.clone().sub(c);
        let radius = new Vector2();
        radius.x = major.length();
        major.normalize();
        let rotation = Math.atan2(major.y, major.x);
        major.multiplyScalar(b.clone().dot(major));
        radius.y = b.distanceTo(major);
        let tr = new Transform2(c, rotation);
        return new Hyperbola2Data(tr, radius);
    }

    /**
     * build parabola from bengin top focus point.
     * center point is top of parabola.
     * vector top to focus is major of parabola.
     * 
     * @param {Vector2} [c] - The top point.
     * @param {Vector2} [a] - The focus point.
     */
    static BuildParabola2FromCenterABPoint(c: Vector2, a: Vector2): Parabola2Data {
        let major = a.clone().sub(c);
        let f = major.length();
        major.normalize();
        let rotation = Math.atan2(major.y, major.x) - Math.PI / 2;
        let tr = new Transform2(c, rotation);
        return new Parabola2Data(tr, f);
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


    static Algorithm2ByData(dat: Curve2Data): Curve2Algo {
        if (dat instanceof Arc2Data) {
            return new Arc2Algo(dat);
        }
        else if (dat instanceof Parabola2Data) {
            return new Parabola2Algo(dat);
        }
        else if (dat instanceof Line2Data) {
            return new Line2Algo(dat);
        }
        else if (dat instanceof Nurbs2Data) {
            return new Nurbs2Algo(dat);
        }
        else if (dat instanceof Hyperbola2Data) {
            return new Hyperbola2Algo(dat);
        }
        else if (dat instanceof Parabola2Data) {
            return new Parabola2Algo(dat);
        }
        debugger;
        return null;
    }

    static Algorithm3ByData(dat: Curve3Data): Curve3Algo {
        if (dat instanceof Arc3Data) {
            return new Arc3Algo(dat);
        }
        else if (dat instanceof Parabola3Data) {
            return new Parabola3Algo(dat);
        }
        else if (dat instanceof Line3Data) {
            return new Line3Algo(dat);
        }
        else if (dat instanceof Nurbs3Data) {
            return new Nurbs3Algo(dat);
        }
        debugger;
        return null;
    }
}

export { CurveBuilder };