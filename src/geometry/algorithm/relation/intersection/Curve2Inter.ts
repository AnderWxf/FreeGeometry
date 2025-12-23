import { Matrix2, Vector2, Vector3 } from "../../../../math/Math";
import * as MATHJS from '../../../../mathjs';
import type { Arc2Data } from "../../../data/base/curve2/Arc2Data";
import type { Line2Data } from "../../../data/base/curve2/Line2Data";
import type { Nurbs2Data } from "../../../data/base/curve2/Nurbs2Data";
import type { Curve2Data } from "../../../data/base/Curve2Data";
import { Arc2Algo } from "../../base/curve2/Arc2Algo";
import { Line2Algo } from "../../base/curve2/Line2Algo";
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
        let ret = new Array<InterOfCurve2>();
        if (c0.trans.rot == c1.trans.rot) {
            return ret;
        }

        let c0a = new Line2Algo(c0);
        let c1a = new Line2Algo(c1);
        // 获取一般方程参数
        let { A: A0, B: B0, C: C0 } = c0a.ge();
        let { A: A1, B: B1, C: C1 } = c1a.ge();
        let c0_ = MATHJS.unaryMinus(C0);
        let c1_ = MATHJS.unaryMinus(C1);

        // 克莱姆法则求解方程组
        // A0x + B0y + C0 = 0
        // A1x + B2y + C1 = 0
        let det = MATHJS.det([[A0, B0], [A1, B1]]);
        let detx = MATHJS.det([[c0_, B0], [c1_, B1]]);
        let dety = MATHJS.det([[A0, c0_], [A1, c1_]]);

        let x = MATHJS.divide(detx, det);
        let y = MATHJS.divide(dety, det);
        let p = new Vector2(x, y);

        let u0 = c0a.u(p);
        let u1 = c1a.u(p);
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
        // 直线的二元一次方程
        // A0x + B0y + C0 = 0
        let c0a = new Line2Algo(c0);
        let { A: A0, B: B0, C: C0 } = c0a.ge();

        // 曲线的二元二次方程
        let c1a = new Arc2Algo(c1);
        let { A: A1, B: B1, C: C1, D: D1, E: E1, F: F1 } = c1a.ge();

        // 求解方程组
        // A0x + B0y + C0 = 0 (1)
        // A1x² + B1xy + C1y² + D1x + E1y + F1 = 0 (2)
        // (1) >> x = (-C0 - B0y) / A0 带入方程（2）
        if (!A0.equals(0) && !B0.equals(0)) {
            // 关于x的方程 Ax² + Bx + C = 0
            // A​ = A1 B0² - B1 A0 B0 + C1 A0²​
            // B =-B1​ B0​ C0​ + 2C1​ A0​ C0 + D1​ B0²​ - E1 A0 B0​
            // C​ = C1​ C0²​ - E1​ B0​ C0​ + F1​ B0²​

            // y= -(B0/A0​)x − B0/C0​ 

            let A = MATHJS.add(MATHJS.subtract(MATHJS.multiply(A1, B0, B0), MATHJS.multiply(B1, A0, B0)), MATHJS.multiply(C1, A0, A0));
            let B = MATHJS.add(MATHJS.subtract(MATHJS.multiply(B1, B0, C0), MATHJS.multiply(B1, A0, B0)), MATHJS.multiply(C1, A0, A0));
            let C = MATHJS.add(MATHJS.subtract(MATHJS.multiply(A1, B0, B0), MATHJS.multiply(B1, A0, B0)), MATHJS.multiply(C1, A0, A0));

        }


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