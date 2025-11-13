import { Matrix2, Vector2, Vector3 } from "../../../../math/Math";
import type { Arc2Data } from "../../../data/base/curve2/Arc2Data";
import type { Line2Data } from "../../../data/base/curve2/Line2Data";
import type { Nurbs2Data } from "../../../data/base/curve2/Nurbs2Data";
import type { Curve2Data } from "../../../data/base/Curve2Data";
import { CurveBuilder } from "../../builder/CurveBuilder";

/**
 * compute curve intersection point utility.
 *
 */
type InterOfCurve2 = {
    p: Vector2; // Position of intersection point.
    u0: number; // The u parameter of intersection point on curve0.
    u1: number; // The u parameter of intersection point on curve1.
}

/**
 * temp value of binary search.
 *
 */
type ValueOfBinary = {
    p: Vector2; // Position of curve0.
    u: number;  // The u of curve0.
    g: number;  // The g value of p on curve1.
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
        // 系数计算
        // A = -sin(r) B = cos(r)
        // A(x - x0) + B(y - y0) = 0
        // Ax + By - A*x0 - B*y0 = 0
        // C = - A*x0 - B*y0
        // 二元一次方程组
        // Ax0 + By0 + C0 = 0
        // Ax1 + By1 + C1 = 0
        // => 非齐次方程组
        // Ax0 + By0 = -C0
        // Ax1 + By1 = -C1
        // 克莱姆法则求解

        let ret = new Array<InterOfCurve2>();
        if (c0.trans.rot == c1.trans.rot) {
            return ret;
        }
        let A0 = -Math.sin(c0.trans.rot), B0 = Math.cos(c0.trans.rot);
        let A1 = -Math.sin(c1.trans.rot), B1 = Math.cos(c1.trans.rot);
        let C0 = - A0 * c0.trans.pos.x - B0 * c0.trans.pos.y;
        let C1 = - A1 * c1.trans.pos.x - B1 * c1.trans.pos.y;

        let m = new Matrix2();
        m.set(A0, B0
            , A1, B1);
        let det = m.determinant();
        m.set(-C0, B0
            , -C1, B1);
        let detx = m.determinant();
        m.set(A0, -C0
            , A1, -C1);

        let dety = m.determinant();
        let x = detx / det;
        let y = dety / det;
        let p = new Vector2(x, y);

        let l0 = new Vector3(A0, B0, 1);
        let l1 = new Vector3(A1, B1, 1);
        let lp = l0.cross(l1);

        let v0 = p.clone().sub(c0.trans.pos);
        let v1 = p.clone().sub(c1.trans.pos);

        let u0 = v0.length() * (v0.dot(new Vector2(Math.cos(c0.trans.rot), Math.sin(c0.trans.rot))) > 0 ? 1 : -1);
        let u1 = v1.length() * (v1.dot(new Vector2(Math.cos(c1.trans.rot), Math.sin(c1.trans.rot))) > 0 ? 1 : -1);
        ret.push({ p, u0, u1 });

        return ret;
    }

    /**
     * compute line to arc intersection point.
     *
     * @param {Line2Data} [c0] - The frist curve.
     * @param {Arc2Data} [c1] - The second curve.
     * @param {number} [tol] - The tolerance of distance.
     */
    static LineXArc(c0: Line2Data, c1: Arc2Data, tol: number): Array<InterOfCurve2> {
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
        let segment = c1.controls.length * 2;
        return Curve2Inter.CurveXCurve(c1, c0, segment, tol);
    }

    /**
     * compute arc to arc intersection point.
     *
     * @param {Arc2Data} [c0] - The frist curve.
     * @param {Arc2Data} [c1] - The second curve.
     * @param {number} [tol] - The tolerance of distance.
     */
    static ArcXArc(c0: Arc2Data, c1: Arc2Data, tol: number): Array<InterOfCurve2> {
        return null;
    }

    /**
     * compute arc to nurbs intersection point.
     *
     * @param {Arc2Data} [c0] - The frist curve.
     * @param {Nurbs2Data} [c1] - The second curve.
     * @param {number} [tol] - The tolerance of distance.
     */
    static ArcXNurbs(c0: Arc2Data, c1: Nurbs2Data, tol: number): Array<InterOfCurve2> {
        let segment = c1.controls.length * 2;
        return Curve2Inter.CurveXCurve(c1, c0, segment, tol);
    }

    /**
     * compute nurbs to nurbs intersection point.
     *
     * @param {Nurbs2Data} [c0] - The frist curve.
     * @param {Nurbs2Data} [c1] - The second curve.
     * @param {number} [tol] - The tolerance of distance.
     */
    static NurbsXNurbs(c0: Nurbs2Data, c1: Nurbs2Data, tol: number): Array<InterOfCurve2> {
        if (c0.controls.length <= c1.controls.length) {
            let segment = c0.controls.length * 2;
            return Curve2Inter.CurveXCurve(c0, c1, segment, tol);
        } else {
            let segment = c1.controls.length * 2;
            return Curve2Inter.CurveXCurve(c1, c0, segment, tol);
        }
    }

    /**
     * compute curve to curve intersection point.
     *
     * @param {Curve2Data} [c0] - The frist curve , binary search curve.
     * @param {Curve2Data} [c1] - The second curve , general equation curve.
     * @param {number} [segment] - The segment of frist curve.
     * @param {number} [tol] - The tolerance of distance.
     */
    private static CurveXCurve(c0: Curve2Data, c1: Curve2Data, segment: number, tol: number): Array<InterOfCurve2> {
        let algor0 = CurveBuilder.Algorithm2ByData(c0);
        let algor1 = CurveBuilder.Algorithm2ByData(c1);
        let ret = new Array<InterOfCurve2>();
        let ps = new Array<ValueOfBinary>();
        for (let i = 0; i <= segment; i++) {
            let u = i / segment;
            let p = algor0.p(u);
            let g = algor1.g(p);
            // 一般方程返回值是0，则恰好是交点。
            if (g == 0) {//Math.abs(g) < tol
                ret.push({ p: p, u0: u, u1: algor1.u(p) });
            } else {
                ps.push({ u, p, g });
            }
        }
        // 二分法递归细分
        let bin = (a: ValueOfBinary, b: ValueOfBinary) => {
            let u = (a.u + b.u) * 0.5;
            let p = algor0.p(u);
            let g = algor1.g(p);
            // 一般方程返回值是0，则恰好是交点。
            if (g == 0) {//Math.abs(g) < tol
                ret.push({ p: p, u0: u, u1: algor1.u(p) });
            } else {
                if (a.g * g < 0) {
                    bin(a, { p, u, g });
                }
                else if (b.g * g < 0) {
                    bin({ p, u, g }, b);
                }
            }
        }

        for (let i = 1; i < ps.length; i++) {
            let pre = ps[i - 1];
            let cur = ps[i - 0];
            // 一般方程返回值符号相反，则至少一个交点在这个区间内。
            if (pre.g * cur.g < 0) {
                bin(pre, cur);
            }
        }
        return ret;
    }
}

export { Curve2Inter };