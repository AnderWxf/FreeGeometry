import type { Vector2, Vector3 } from "../../../math/Math";
import { Arc2Data } from "../../data/base/curve2/Arc2Data";
import { Conic2Data } from "../../data/base/curve2/Conic2Data";
import { Line2Data } from "../../data/base/curve2/Line2Data";
import { Nurbs2Data } from "../../data/base/curve2/Nurbs2Data";
import type { Curve2Data } from "../../data/base/Curve2Data";
import { Arc3Data } from "../../data/base/curve3/Arc3Data";
import { Conic3Data } from "../../data/base/curve3/Conic3Data";
import { Line3Data } from "../../data/base/curve3/Line3Data";
import { Nurbs3Data } from "../../data/base/curve3/Nurbs3Data";
import type { Curve3Data } from "../../data/base/Curve3Data";
import { Arc2Algo } from "../base/curve2/Arc2Algo";
import { Conic2Algo } from "../base/curve2/Conic2Algo";
import { Line2Algo } from "../base/curve2/Line2Algo";
import { Nurbs2Algo } from "../base/curve2/Nurbs2Algo";
import type { Curve2Algo } from "../base/Curve2Algo";
import { Arc3Algo } from "../base/curve3/Arc3Algo";
import { Conic3Algo } from "../base/curve3/Conic3Algo";
import { Line3Algo } from "../base/curve3/Line3Algo";
import { Nurbs3Algo } from "../base/curve3/Nurbs3Algo";
import type { Curve3Algo } from "../base/Curve3Algo";

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
        ret.trans.position = b;
        let r = e.clone().sub(b).normalize();
        ret.trans.rotation = r.angle();
        return ret;
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


    static BuildCurve2AlgorithmByData(dat: Curve2Data): Curve2Algo {
        if (dat instanceof Arc2Data) {
            return new Arc2Algo(dat);
        }
        else if (dat instanceof Conic2Data) {
            return new Conic2Algo(dat);
        }
        else if (dat instanceof Line2Data) {
            return new Line2Algo(dat);
        }
        else if (dat instanceof Nurbs2Data) {
            return new Nurbs2Algo(dat);
        }
        debugger;
        return null;
    }

    static BuildCurve3AlgorithmByData(dat: Curve3Data): Curve3Algo {
        if (dat instanceof Arc3Data) {
            return new Arc3Algo(dat);
        }
        else if (dat instanceof Conic3Data) {
            return new Conic3Algo(dat);
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