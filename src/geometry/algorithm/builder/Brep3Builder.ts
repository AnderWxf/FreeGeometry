import { Vector2, Vector3 } from "../../../math/Math";
import { Curve2Data } from "../../data/base/Curve2Data";
import { Arc3Data } from "../../data/base/curve3/Arc3Data";
import { Line3Data } from "../../data/base/curve3/Line3Data";
import { Nurbs3Data } from "../../data/base/curve3/Nurbs3Data";
import { Curve3Data } from "../../data/base/Curve3Data";
import { Transform3 } from "../../data/base/Transform3";
import { Body3, Edge3, Face3 } from "../../data/brep/Brep3";
import { Nurbs3Algo } from "../base/curve3/Nurbs3Algo";
import { CurveBuilder } from "./CurveBuilder";

/**
 * brep builder.
 *
 */
class Brep3Builder {
    /**
     * build rectangle face from size vector.
     * @param {Transform3} [trans] - - The base transfrom of face.
     * @param {Vector2} [size] - The size of rectangle.
     */
    static BuildRectangleFace(trans = new Transform3(), size: Vector2): Face3 {
        debugger;
        return null;
    }

    /**
     * build polygon face from points.
     * @param {Transform3} [trans] - - The base transfrom of face.
     * @param {Vector2} [points] - The points of polygon.
     */
    static BuildPolygonFace(trans = new Transform3(), points: Array<Vector2>): Face3 {
        debugger;
        return null;
    }

    /**
     * build circle face from center and radius.
     *
     * @param {Transform3} [trans] - - The base transfrom of face.
     * @param {number} [radius] - The radius of circle.
     */
    static BuildCircleFace(trans = new Transform3(), radius: number): Face3 {
        debugger;
        return null;
    }

    /**
     * build circle face from center and radius.
     *
     * @param {Transform3} [trans] - - The base transfrom of face.
     * @param {Vector2} [radius] - The radius of circle.
     */
    static BuildEllipseFace(trans = new Transform3(), radius: Vector2): Face3 {
        debugger;
        return null;
    }

    /**
     * build generaled face from cures that one by one closed.
     *
     * @param {Transform3} [trans] - - The base transfrom of face.
     * @param {Array<Curve2Data>} [cures] - The cures of face.
     */
    static BuildGeneraledFace(trans = new Transform3(), cures: Array<Curve2Data>): Face3 {
        debugger;
        return null;
    }


    /**
     * build box solid from size vector.
     *
     * @param {Transform3} [trans] - - The base transfrom of box.
     * @param {Vector3} [size] - The size of solid.
     */
    static BuildBoxBody(trans = new Transform3(), size: Vector3): Body3 {
        debugger;
        return null;
    }

    /**
     * build sphere face from center and radius.
     *
     * @param {Transform3} [trans] - - The base transfrom of sphere.
     * @param {number} [radius] - The radius of sphere.
     */
    static BuildSphereBody(trans = new Transform3(), radius: number): Body3 {
        debugger;
        return null;
    }

    /**
     * build ellipsoid from center and radius.
     *
     * @param {Transform3} [trans] - - The base transfrom of ellipsoid.
     * @param {Vector3} [radius] - The radius of circle.
     */
    static BuildEllipsoidBody(trans = new Transform3(), radius: Vector3): Body3 {
        debugger;
        return null;
    }

    /**
     * build cylinder from center and radius.
     *
     * @param {Transform3} [trans] - - The base transfrom of cylinder.
     * @param {number} [radius] - The radius of cylinder.
     */
    static BuildCylinderBody(trans = new Transform3(), radius: number, height: number): Body3 {
        debugger;
        return null;
    }

    /**
     * build elliptic cylinder from center and radius.
     *
     * @param {Transform3} [trans] - - The base transfrom of cylinder.
     * @param {Vector2} [radius] - The radius of cylinder.
     */
    static BuildEllipticCylinderBody(trans = new Transform3(), radius: Vector2, height: number): Body3 {
        debugger;
        return null;
    }

    /**
     * build prism from face and height.
     * @param {Transform3} [trans] - - The base transfrom of prism.
     * @param {Array<Vector2>} [points] - The bottom points of prism.
     * @param {number} [height] - The number of prism.
     */
    static BuildPrismBody(trans = new Transform3(), points: Array<Vector2>, height: number): Body3 {
        debugger;
        return null;
    }

    /**
     * build stretch from face and height.
     *
     * @param {Transform3} [trans] - - The base transfrom of stretch.
     * @param {Array<Curve2Data>} [cures] - The cures of stretch.
     * @param {number} [height] - The number of stretch.
     */
    static BuildStretchBody(trans = new Transform3(), section: Array<Curve2Data>, height: number): Body3 {
        debugger;
        return null;
    }

    /**
     * build sweep from face and height.
     *
     * @param {Transform3} [trans] - - The base transfrom of sweep.
     * @param {Array<Curve2Data>} [section] - The cures of sweep.
     * @param {Curve3Data} [path] - The path curve of sweep. 
     */
    static BuildSweepBody(trans = new Transform3(), section: Array<Curve2Data>, path: Curve3Data): Body3 {
        debugger;
        return null;
    }

    /**
     * build lofting from face and height.
     *
     * @param {Transform3} [trans] - - The base transfrom of lofting.
     * @param {Array<{ c: Curve2Data, t: number }>} [sections] - The sections of lofting.
     * @param {Curve3Data} [path] - The path curve of lofting. 
     */
    static BuildLoftingBody(trans = new Transform3(), sections: Array<{ c: Curve2Data, t: number }>, path: Curve3Data): Body3 {
        debugger;
        return null;
    }
    /**
     * return legnth if this edge.
     *
     * @param {number} [u ∈ [0,a]] - the u parameter of curve.
     * @retun {Matrix2}
     */
    static Length(e: Edge3, tol = 0.0001): number {
        if (e.curve instanceof Line3Data) {
            return Math.abs(e.u.y - e.u.x);
        }
        else if (e.curve instanceof Arc3Data) {
            if (e.curve.radius.x == e.curve.radius.y) {
                return 2 * Math.abs(e.u.y - e.u.x) * e.curve.radius.x
            } else if (e.u.x - e.u.y == Math.PI * 2) {
                //该公式发明人周钰承
                let a = e.curve.radius.x;
                let b = e.curve.radius.y;
                //pi*(a+b)*(1+3*((a-b)/(a+b))^2/(10+sqrt(4-3*((a-b)/(a+b))^2))+(4/pi-14/11)*((a-b)/(a+b))^(14.233+13.981*((a-b)/(a+b))**6.42))
                return Math.PI * (a + b) * (1 + 3 * ((a - b) / (a + b)) ** 2 / (10 + Math.sqrt(4 - 3 * ((a - b) / (a + b)) ** 2)) + (4 / Math.PI - 14 / 11) * ((a - b) / (a + b)) ** (14.233 + 13.981 * ((a - b) / (a + b)) ** 6.42))
            }
        }
        else if (e.curve instanceof Nurbs3Data) {
            let nurbsAlgo = new Nurbs3Algo(e.curve as Nurbs3Data);
            // let start = new Date().getTime();
            let nurbsLength = nurbsAlgo.length();
            // let end = new Date().getTime();
            // console.log("nurbsAlgo :" + nurbsLength + " time:" + (end - start));
            return nurbsLength;
        }
        // 细分求和
        let algor = CurveBuilder.Algorithm3ByData(e.curve);
        // let start = new Date().getTime();
        let length = 0;
        let ps = new Array<{ u: number, p: Vector3 }>();
        ps.push({ u: e.u.x, p: algor.p(e.u.x) });
        ps.push({ u: e.u.x + (e.u.y - e.u.x) * 1 / 8, p: algor.p(e.u.x + (e.u.y - e.u.x) * 1 / 8) });
        ps.push({ u: e.u.x + (e.u.y - e.u.x) * 2 / 8, p: algor.p(e.u.x + (e.u.y - e.u.x) * 2 / 8) });
        ps.push({ u: e.u.x + (e.u.y - e.u.x) * 3 / 8, p: algor.p(e.u.x + (e.u.y - e.u.x) * 3 / 8) });
        ps.push({ u: e.u.x + (e.u.y - e.u.x) * 4 / 8, p: algor.p(e.u.x + (e.u.y - e.u.x) * 4 / 8) });
        ps.push({ u: e.u.x + (e.u.y - e.u.x) * 5 / 8, p: algor.p(e.u.x + (e.u.y - e.u.x) * 5 / 8) });
        ps.push({ u: e.u.x + (e.u.y - e.u.x) * 6 / 8, p: algor.p(e.u.x + (e.u.y - e.u.x) * 6 / 8) });
        ps.push({ u: e.u.y, p: algor.p(e.u.y) });
        length = ps[0].p.distanceTo(ps[1].p);
        length = length + ps[1].p.distanceTo(ps[2].p);
        length = length + ps[2].p.distanceTo(ps[3].p);
        length = length + ps[3].p.distanceTo(ps[4].p);
        length = length + ps[4].p.distanceTo(ps[5].p);
        length = length + ps[5].p.distanceTo(ps[6].p);
        length = length + ps[6].p.distanceTo(ps[7].p);
        while (1) {
            let ps_ = new Array<{ u: number, p: Vector3 }>();
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
                // let end = new Date().getTime();
                // console.log("length :" + l + " time:" + (end - start));
                return l;
            }
            length = l;
            ps = ps_;
        }
    }
}

export { Brep3Builder };