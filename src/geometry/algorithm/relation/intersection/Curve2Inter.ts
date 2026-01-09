import type { BigNumber } from '../../../../mathjs';
import { Vector2 } from "../../../../math/Math";
import * as MATHJS from '../../../../mathjs';
import type { Arc2Data } from "../../../data/base/curve2/Arc2Data";
import type { Line2Data } from "../../../data/base/curve2/Line2Data";
import type { Nurbs2Data } from "../../../data/base/curve2/Nurbs2Data";
import type { Curve2Data } from "../../../data/base/Curve2Data";
import { Arc2Algo } from "../../base/curve2/Arc2Algo";
import { Line2Algo } from "../../base/curve2/Line2Algo";
import { CurveBuilder } from "../../builder/CurveBuilder";
import { SolveEquation } from "../../base/SolveEquation";
import type { Hyperbola2Data } from "../../../data/base/curve2/Hyperbola2Data";
import { Hyperbola2Algo } from "../../base/curve2/Hyperbola2Algo";
import type { Parabola2Data } from "../../../data/base/curve2/Parabola2Data";
import { Parabola2Algo } from "../../base/curve2/Parabola2Algo";
import type { Curve2Algo } from "../../base/Curve2Algo";
import * as SVD from "svd-js";
import { e } from '../../../../mathjs/lib/cjs/entry/pureFunctionsAny.generated';

/**
 * compute curve intersection point utility.
 *
 */
export type InterOfCurve2 = {
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
        let ret = new Array<InterOfCurve2>();
        // 直线的二元一次方程
        // A0x + B0y + C0 = 0
        let c0a = new Line2Algo(c0);
        // 曲线的二元二次方程
        // A1x² + B1xy + C1y² + D1x + E1y + F1 = 0 (2)
        let c1a = new Arc2Algo(c1);
        // 求解方程组
        return Curve2Inter.LineXConic(c0a.ge(), c1a.ge(), c0a, c1a, tol);
    }

    /**
     * compute line to arc intersection point.
     *
     * @param {Line2Data} [c0] - The frist curve.
     * @param {Arc2Data} [c1] - The second curve.
     * @param {number} [tol] - The tolerance of distance.
     */
    static LineXHyperbola(c0: Line2Data, c1: Hyperbola2Data, tol: number): Array<InterOfCurve2> {
        let ret = new Array<InterOfCurve2>();
        // 直线的二元一次方程
        // A0x + B0y + C0 = 0
        let c0a = new Line2Algo(c0);
        // 曲线的二元二次方程
        // A1x² + B1xy + C1y² + D1x + E1y + F1 = 0 (2)
        let c1a = new Hyperbola2Algo(c1);
        return Curve2Inter.LineXConic(c0a.ge(), c1a.ge(), c0a, c1a, tol);
    }

    /**
     * compute line to arc intersection point.
     *
     * @param {Line2Data} [c0] - The frist curve.
     * @param {Arc2Data} [c1] - The second curve.
     * @param {number} [tol] - The tolerance of distance.
     */
    static LineXParabola(c0: Line2Data, c1: Parabola2Data, tol: number): Array<InterOfCurve2> {
        let ret = new Array<InterOfCurve2>();
        // 直线的二元一次方程
        // A0x + B0y + C0 = 0
        let c0a = new Line2Algo(c0);
        // 曲线的二元二次方程
        // A1x² + B1xy + C1y² + D1x + E1y + F1 = 0 (2)
        let c1a = new Parabola2Algo(c1);
        return Curve2Inter.LineXConic(c0a.ge(), c1a.ge(), c0a, c1a, tol);
    }

    /**
     * compute line to arc intersection point.
     *
     * @param {Line2Data} [c0] - The frist curve.
     * @param {Arc2Data} [c1] - The second curve.
     * @param {number} [tol] - The tolerance of distance.
     */
    static LineXConic(c0: { A: MATHJS.BigNumber, B: MATHJS.BigNumber, C: MATHJS.BigNumber },
        c1: { A: MATHJS.BigNumber, B: MATHJS.BigNumber, C: MATHJS.BigNumber, D: MATHJS.BigNumber, E: MATHJS.BigNumber, F: MATHJS.BigNumber },
        c0a: Curve2Algo,
        c1a: Curve2Algo,
        tol: number): Array<InterOfCurve2> {
        let ret = new Array<InterOfCurve2>();
        // 直线的二元一次方程
        // A0x + B0y + C0 = 0
        let { A: A0, B: B0, C: C0 } = c0;
        // 曲线的二元二次方程
        // A1x² + B1xy + C1y² + D1x + E1y + F1 = 0 (2)
        let { A: A1, B: B1, C: C1, D: D1, E: E1, F: F1 } = c1;
        // 求解方程组
        // A0x + B0y + C0 = 0 (1) 
        // A1x² + B1xy + C1y² + D1x + E1y + F1 = 0 (2)
        // (1) >> x = (-C0 - B0y) / A0 带入方程（2）
        if (!MATHJS.equal(A0, 0) && !MATHJS.equal(B0, 0)) {
            // 关于x的方程 Ax² + Bx + C = 0
            // A​ = A1 B0² - B1 A0 B0 + C1 A0²​
            // B =-B1​ B0​ C0​ + 2C1​ A0​ C0 + D1​ B0²​ - E1 A0 B0​
            // C​ = C1​ C0²​ - E1​ B0​ C0​ + F1​ B0²​
            let A = MATHJS.add(
                MATHJS.multiply(A1, B0, B0),
                MATHJS.unaryMinus(MATHJS.multiply(B1, A0, B0)),
                MATHJS.multiply(C1, A0, A0)
            ) as BigNumber;
            let B = MATHJS.add(
                MATHJS.unaryMinus(MATHJS.multiply(B1, B0, C0)),
                MATHJS.multiply(C1, A0, C0, 2),
                MATHJS.multiply(D1, B0, B0),
                MATHJS.unaryMinus(MATHJS.multiply(E1, A0, B0))
            ) as BigNumber;
            let C = MATHJS.add(
                MATHJS.multiply(C1, C0, C0),
                MATHJS.unaryMinus(MATHJS.multiply(E1, B0, C0)),
                MATHJS.multiply(F1, B0, B0)
            ) as BigNumber;

            let xs = SolveEquation.SolveQuadraticEquation(A, B, C);
            for (let i = 0; i < xs.length; i++) {
                let xi = xs[i];
                let x: BigNumber;
                if (MATHJS.typeOf(xi) === 'Complex') {
                    xi = xi as MATHJS.Complex;
                    if (Math.abs(xi.im) > tol) {
                        continue;
                    }
                    x = MATHJS.bignumber(xi.re);
                }
                if (MATHJS.typeOf(xi) === 'BigNumber') {
                    x = xi as BigNumber;
                }
                // y= -(A0/B0​)x − C0/B0​ ​ = - (xA0 + c0)/b0
                let y = MATHJS.unaryMinus(MATHJS.divide(MATHJS.add((MATHJS.multiply(x, A0)), C0), B0)) as BigNumber;
                let p = new Vector2(x.toNumber(), y.toNumber());
                let u0 = c0a?.u(p);
                let u1 = c1a?.u(p);
                ret.push({ p, u0, u1 });
            }
        } else if (!MATHJS.equal(A0, 0) && MATHJS.equal(B0, 0)) {
            // 关于y的方程 A0x + B0y + C0 = 0 >> x = -C0/A0
            let x = MATHJS.unaryMinus(MATHJS.divide(C0, A0)) as BigNumber;
            // 带入二次方程得到关于y的方程
            // A1x² + B1xy + C1y² + D1x + E1y + F1 = 0             
            // A​ = C1
            // B = -B1​C0/A0 + E1​
            // C​ = A1C0C0/A0A0​ - D1​C0/A0 + F1​
            let A = C1 as BigNumber;
            let B = MATHJS.add(MATHJS.divide(MATHJS.unaryMinus(MATHJS.multiply(B1, C0)), A0), E1) as BigNumber;
            let C = MATHJS.add(MATHJS.divide(MATHJS.multiply(A1, C0, C0), MATHJS.multiply(A0, A0)), MATHJS.divide(MATHJS.multiply(D1, C0), A0), F1) as BigNumber;
            let ys = SolveEquation.SolveQuadraticEquation(A, B, C);
            for (let i = 0; i < ys.length; i++) {
                let yi = ys[i];
                let y: BigNumber;
                if (MATHJS.typeOf(yi) === 'Complex') {
                    yi = yi as MATHJS.Complex;
                    if (Math.abs(yi.im) > tol) {
                        continue;
                    }
                    y = MATHJS.bignumber(yi.re);
                }
                if (MATHJS.typeOf(yi) === 'BigNumber') {
                    y = yi as BigNumber;
                }
                let p = new Vector2(x.toNumber(), y.toNumber());
                let u0 = c0a?.u(p);
                let u1 = c1a?.u(p);
                ret.push({ p, u0, u1 });
            }
        } else if (MATHJS.equal(A0, 0) && !MATHJS.equal(B0, 0)) {
            // 关于y的方程 A0x + B0y + C0 = 0 >> y = -C0/B0
            let y = MATHJS.unaryMinus(MATHJS.divide(C0, B0)) as BigNumber;
            // 带入二次方程得到关于x的方程
            // A1x² + B1xy + C1y² + D1x + E1y + F1 = 0 
            // A​ = A1​
            // B = -B1​C0/B0 + D1​
            // C​ = C1C0C0/B0B0​ - E1​C0/B0 + F1​
            let A = A1 as BigNumber;
            let B = MATHJS.add(MATHJS.divide(MATHJS.unaryMinus(MATHJS.multiply(B1, C0)), B0), D1) as BigNumber;
            let C = MATHJS.add(MATHJS.divide(MATHJS.multiply(C1, C0, C0), MATHJS.multiply(B0, B0)), MATHJS.divide(MATHJS.multiply(E1, C0), B0), F1) as BigNumber;
            let xs = SolveEquation.SolveQuadraticEquation(A, B, C);
            for (let i = 0; i < xs.length; i++) {
                let xi = xs[i];
                let x: BigNumber;
                if (MATHJS.typeOf(xi) === 'Complex') {
                    xi = xi as MATHJS.Complex;
                    if (Math.abs(xi.im) > tol) {
                        continue;
                    }
                    x = MATHJS.bignumber(xi.re);
                }
                if (MATHJS.typeOf(xi) === 'BigNumber') {
                    x = xi as BigNumber;
                }
                let p = new Vector2(x.toNumber(), y.toNumber());
                let u0 = c0a?.u(p);
                let u1 = c1a?.u(p);
                ret.push({ p, u0, u1 });
            }
        }
        return ret;
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
    static QuadraticXQuadratic(c0: Arc2Data | Hyperbola2Data | Parabola2Data, c1: Arc2Data | Hyperbola2Data | Parabola2Data, tol: number): Array<InterOfCurve2> {
        let c0a = CurveBuilder.Algorithm2ByData(c0) as Arc2Algo | Hyperbola2Algo | Parabola2Algo;
        let c1a = CurveBuilder.Algorithm2ByData(c1) as Arc2Algo | Hyperbola2Algo | Parabola2Algo;
        return Curve2Inter.ConicXConic(c0a.ge(), c1a.ge(), c0a, c1a, tol);
    }

    /**
     * compute arc to arc intersection point.
     * 1. 构造对称矩阵 ( A1, A2 ) 表示两条二次曲线。
     * 2. 解广义特征值问题 (det(A1 + λA2) = 0)，得到 λ（最多三个）。
     * 3. 对每个 λ 构造 ( B = A1 + λ A2 )。
     * 4. 分解 B 为两条直线（利用对称 SVD 或配方法）。
     * 5. 每条直线与原二次曲线之一求交（解二次方程），得到候选交点。
     * 6. 验证 候选点在两条曲线上，并去重。
     * @param {Arc2Data} [c0] - The frist curve.
     * @param {Arc2Data} [c1] - The second curve.
     * @param {number} [tol] - The tolerance of distance.
     */
    static ConicXConic(
        c0: { A: MATHJS.BigNumber, B: MATHJS.BigNumber, C: MATHJS.BigNumber, D: MATHJS.BigNumber, E: MATHJS.BigNumber, F: MATHJS.BigNumber },
        c1: { A: MATHJS.BigNumber, B: MATHJS.BigNumber, C: MATHJS.BigNumber, D: MATHJS.BigNumber, E: MATHJS.BigNumber, F: MATHJS.BigNumber },
        c0a: Curve2Algo,
        c1a: Curve2Algo,
        tol: number): Array<InterOfCurve2> {
        let format = (v: any): string => {
            return MATHJS.format(v, { precision: 6 });
        }
        let isExist = (p: Vector2): boolean => {
            let isExist = false;
            for (let k = 0; k < ret.length; k++) {
                let exist = ret[k];
                if (p.distanceTo(exist.p) < tol) {
                    isExist = true;
                    break;
                }
            }
            return isExist;
        }
        // 6. 验证 候选点在两条曲线上，并去重。
        let checkAndPush = (inters: Array<InterOfCurve2>) => {
            for (let j = 0; j < inters.length; j++) {
                let inter = inters[j];
                if (isExist(inter.p)) {
                    continue
                }
                let g0 = c0a.g(inter.p);
                let g1 = c1a.g(inter.p);
                if (Math.abs(g0) < tol && Math.abs(g1) < tol) {
                    console.log("Right: g0 " + format(g0) + " g1 " + format(g1));
                    ret.push({ p: inter.p, u0: inter.u1, u1: c1a.u(inter.p) });
                }
                else if (Math.abs(g0) < tol) {
                    inter.u0 = c0a.u(inter.p);
                    console.log("Binary before: g0 " + format(g0) + " g1 " + format(g1));
                    Curve2Inter.Binary(c0a, c1a, inter, tol);
                    g0 = c0a.g(inter.p);
                    g1 = c1a.g(inter.p);
                    console.log("Binary after: g0 " + format(g0) + " g1 " + format(g1));
                    if (Math.abs(g0) < tol && Math.abs(g1) < tol) {
                        if (!isExist(inter.p)) {
                            ret.push({ p: inter.p, u0: inter.u1, u1: c1a.u(inter.p) });
                        }

                    }
                }
                else if (Math.abs(g1) < tol) {
                    inter.u0 = c1a.u(inter.p);
                    console.log("Binary before: g0 " + format(g0) + " g1 " + format(g1));
                    Curve2Inter.Binary(c1a, c0a, inter, tol);
                    g0 = c0a.g(inter.p);
                    g1 = c1a.g(inter.p);
                    console.log("Binary after: g0 " + format(g0) + " g1 " + format(g1));
                    if (Math.abs(g0) < tol && Math.abs(g1) < tol) {
                        if (!isExist(inter.p)) {
                            ret.push({ p: inter.p, u0: inter.u1, u1: c1a.u(inter.p) });
                        }
                    }
                }
                else {
                    console.log("Error: g0 " + format(g0) + " g1 " + format(g1));
                }
            }
        }
        // console.log("ConicXConic \n c0:  " + format(c0) + "\n c1: " + format(c1));
        let ret = new Array<InterOfCurve2>();

        // 1. 构造对称矩阵 ( A1, A2 ) 表示两条二次曲线。
        let A_1 = Curve2Inter.QuadraticMatrix(c0);
        let A_2 = Curve2Inter.QuadraticMatrix(c1);
        // console.log("ConicXConic \n A_1: \n" + format(A_1) + "\n A_2: \n" + format(A_2));
        let a_1 = c0.A, b_1 = c0.B, c_1 = c0.C, d_1 = c0.D, e_1 = c0.E, f_1 = c0.F;
        let a_2 = c1.A, b_2 = c1.B, c_2 = c1.C, d_2 = c1.D, e_2 = c1.E, f_2 = c1.F;
        //2. 解广义特征值问题 (det(A1 + λA2) = 0)，得到 λ（最多三个）。
        // det(A_1 + λ A_2) = C_3 λ^3 + C_2 λ^2 + C_1 λ + C_0 = 0

        // C_0 = a_1 c_1 f_1 + (b_1 d_1 e_1)/4 - (a_1 e_1^2 + c_1 d_1^2 + f_1 b_1^2)/4
        const C_0 = MATHJS.add(
            MATHJS.multiply(a_1, c_1, f_1),
            MATHJS.multiply(b_1, d_1, e_1, 0.25),
            MATHJS.multiply(MATHJS.add(MATHJS.multiply(a_1, e_1, e_1), MATHJS.multiply(c_1, d_1, d_1), MATHJS.multiply(f_1, b_1, b_1)), -0.25),
        ) as MATHJS.BigNumber;
        // C_3 = a_2 c_2 f_2 + (b_2 d_2 e_2)/4 - (a_2 e_2^2 + c_2 d_2^2 + f_2 b_2^2)/4
        const C_3 = MATHJS.add(
            MATHJS.multiply(a_2, c_2, f_2),
            MATHJS.multiply(b_2, d_2, e_2, 0.25),
            MATHJS.multiply(MATHJS.add(MATHJS.multiply(a_2, e_2, e_2), MATHJS.multiply(c_2, d_2, d_2), MATHJS.multiply(f_2, b_2, b_2)), -0.25),
        ) as MATHJS.BigNumber;
        // C_1 =   (c_1 f_1 - e_1^2/4) a_2 
        //       + (a_1 f_1 - d_1^2/4) c_2 
        //       + (a_1 c_1 - b_1^2/4) f_2 
        //       + ((b_1 f_1 - (d_1 e_1)/2) b_2 0.5
        //       + ((b_1 e_1)/2 - c_1 d_1) d_2 0.5
        //       + ((a_1 e_1 - (b_1 d_1)/2) e_2 0.5        
        const C_1 = MATHJS.add(
            MATHJS.multiply(MATHJS.add(MATHJS.multiply(c_1, f_1), MATHJS.multiply(e_1, e_1, -0.25)), a_2),
            MATHJS.multiply(MATHJS.add(MATHJS.multiply(a_1, f_1), MATHJS.multiply(d_1, d_1, -0.25)), c_2),
            MATHJS.multiply(MATHJS.add(MATHJS.multiply(a_1, c_1), MATHJS.multiply(b_1, b_1, -0.25)), f_2),
            MATHJS.multiply(MATHJS.add(MATHJS.multiply(b_1, f_1), MATHJS.multiply(d_1, e_1, -0.5)), b_2, 0.5),
            MATHJS.multiply(MATHJS.add(MATHJS.multiply(b_1, e_1, 0.5), MATHJS.multiply(c_1, d_1, -1)), d_2, 0.5),
            MATHJS.multiply(MATHJS.add(MATHJS.multiply(a_1, e_1), MATHJS.multiply(b_1, d_1, -0.5)), e_2, 0.5),
        ) as MATHJS.BigNumber;
        // C_2 =   (c_2 f_2 - e_2^2/4) a_1 
        //       + (a_2 f_2 - d_2^2/4) c_1 
        //       + (a_2 c_2 - b_2^2/4) f_1 
        //       + ((b_2 f_2 - (d_2 e_2)/2) b_1 0.5
        //       + ((b_2 e_2)/2 - c_2 d_2) d_1 0.5
        //       + ((a_2 e_2 - (b_2 d_2)/2) e_1 0.5
        const C_2 = MATHJS.add(
            MATHJS.multiply(MATHJS.add(MATHJS.multiply(c_2, f_2), MATHJS.multiply(e_2, e_2, -0.25)), a_1),
            MATHJS.multiply(MATHJS.add(MATHJS.multiply(a_2, f_2), MATHJS.multiply(d_2, d_2, -0.25)), c_1),
            MATHJS.multiply(MATHJS.add(MATHJS.multiply(a_2, c_2), MATHJS.multiply(b_2, b_2, -0.25)), f_1),
            MATHJS.multiply(MATHJS.add(MATHJS.multiply(b_2, f_2), MATHJS.multiply(d_2, e_2, -0.5)), b_1, 0.5),
            MATHJS.multiply(MATHJS.add(MATHJS.multiply(b_2, e_2, 0.5), MATHJS.multiply(c_2, d_2, -1)), d_1, 0.5),
            MATHJS.multiply(MATHJS.add(MATHJS.multiply(a_2, e_2), MATHJS.multiply(b_2, d_2, -0.5)), e_1, 0.5),
        ) as MATHJS.BigNumber;

        const C3 = MATHJS.bignumber(1)
        const C2 = MATHJS.divide(C_2, C_3) as MATHJS.BigNumber;
        const C1 = MATHJS.divide(C_1, C_3) as MATHJS.BigNumber;
        const C0 = MATHJS.divide(C_0, C_3) as MATHJS.BigNumber;

        //3. 对每个 λ 构造 ( B = A1 + λ A2 )。
        // console.log(" B = A1 + λ A2 :\n C3 " + format(C3) + " C2 " + format(C2) + " C1 " + format(C1) + " C0 " + format(C0));
        const λs = SolveEquation.SolveCubicNumberical(C3, C2, C1, C0);
        // console.log(" λs : " + format(λs));
        for (let i = 0; i < λs.length; i++) {
            let λ = λs[i];
            if (MATHJS.typeOf(λ) === "Complex") {
                continue;
            }
            if (ret.length >= 4) {
                continue;
            }
            // console.log(" 取 λ" + i + " : " + format(λ));
            let B = new Array<Array<MATHJS.BigNumber>>(3);
            let row0 = new Array<MATHJS.BigNumber>(3);
            let row1 = new Array<MATHJS.BigNumber>(3);
            let row2 = new Array<MATHJS.BigNumber>(3);
            row0[0] = MATHJS.add(A_1[0][0], MATHJS.multiply(λ, A_2[0][0])) as MATHJS.BigNumber;
            row0[1] = MATHJS.add(A_1[0][1], MATHJS.multiply(λ, A_2[0][1])) as MATHJS.BigNumber;
            row0[2] = MATHJS.add(A_1[0][2], MATHJS.multiply(λ, A_2[0][2])) as MATHJS.BigNumber;
            row1[0] = MATHJS.add(A_1[1][0], MATHJS.multiply(λ, A_2[1][0])) as MATHJS.BigNumber;
            row1[1] = MATHJS.add(A_1[1][1], MATHJS.multiply(λ, A_2[1][1])) as MATHJS.BigNumber;
            row1[2] = MATHJS.add(A_1[1][2], MATHJS.multiply(λ, A_2[1][2])) as MATHJS.BigNumber;
            row2[0] = MATHJS.add(A_1[2][0], MATHJS.multiply(λ, A_2[2][0])) as MATHJS.BigNumber;
            row2[1] = MATHJS.add(A_1[2][1], MATHJS.multiply(λ, A_2[2][1])) as MATHJS.BigNumber;
            row2[2] = MATHJS.add(A_1[2][2], MATHJS.multiply(λ, A_2[2][2])) as MATHJS.BigNumber;

            B[0] = row0;
            B[1] = row1;
            B[2] = row2;

            // 4. 分解 B 为两条直线（利用对称 SVD 或配方法）。
            // console.log(" B = A1 + λ A2 :\n " + format(row0) + " \n " + format(row1) + " \n " + format(row2));
            let isSVD = true;
            let isEigs = true;
            const tol_ = 1e-10;// 内部容差
            // svd分解
            if (isSVD && ret.length < 4) {
                console.log("SVD分解");
                const m = [[0, 0, 0], [0, 0, 0], [0, 0, 0]];
                m[0][0] = B[0][0].toNumber();
                m[0][1] = B[0][1].toNumber();
                m[0][2] = B[0][2].toNumber();
                m[1][0] = B[1][0].toNumber();
                m[1][1] = B[1][1].toNumber();
                m[1][2] = B[1][2].toNumber();
                m[2][0] = B[2][0].toNumber();
                m[2][1] = B[2][1].toNumber();
                m[2][2] = B[2][2].toNumber();

                // console.log(" m :\n" +
                //     format(m[0]) + "\n" +
                //     format(m[1]) + "\n" +
                //     format(m[2]) + "\n"
                // );

                const svd = SVD.SVD(m);
                // console.log(" svd分解 :" +
                //     "\n svd.q 奇异值数组" + format(svd.q) +
                //     "\n svd.u 左奇异向量" + format(svd.u) +
                //     "\n svd.v 右奇异向量" + format(svd.v)
                // );
                const S: number[] = svd.q;
                const U: number[][] = svd.u;
                const V: number[][] = svd.v;
                // 4.1. 找到零奇异值索引
                const zeroIndices: number[] = [];
                for (let i = 0; i < S.length; i++) {
                    if (Math.abs(S[i]) < 1e-10) {
                        zeroIndices.push(i);
                    }
                }
                // if (zeroIndices.length === 0) {
                // console.warn('矩阵非奇异');
                // return ret;
                // }

                // 4.2. 提取零空间向量（交点）
                // const intersection = [];
                // const zeroIdx = zeroIndices[0];
                // for (let row = 0; row < 3; row++) {
                //     intersection.push(V[row][zeroIdx]);
                // }
                // 4.3. 提取非零奇异值对应的向量
                const nonZeroIndices = [0, 1, 2].filter(i => !zeroIndices.includes(i));
                const lines: MATHJS.BigNumber[][] = [];
                // 4.3.1只有一个非零奇异值，说明两条直线重合，退化情况未处理
                if (nonZeroIndices.length < 2) {
                    const vec1: MATHJS.BigNumber[] = [];
                    for (let row = 0; row < 3; row++) {
                        vec1.push(MATHJS.bignumber(U[row][nonZeroIndices[0]]));
                    }
                    // 4.4. 构造一条直线
                    const l0 = vec1;
                    // console.log(" 退化直线 :" + "\n l0 : " + format(l0));
                    lines.push(l0);
                }
                // 4.3.2有两个非零奇异值，说明两条直线不同
                else {
                    const vec1: MATHJS.BigNumber[] = [], vec2: MATHJS.BigNumber[] = [];
                    for (let row = 0; row < 3; row++) {
                        vec1.push(MATHJS.bignumber(U[row][nonZeroIndices[0]]));
                        vec2.push(MATHJS.bignumber(U[row][nonZeroIndices[1]]));
                    }
                    // console.log(" VEC :" +
                    //     "\n vec1 : " + format(vec1) +
                    //     "\n vec1 : " + format(vec2)
                    // );
                    // 4.4. 构造两条直线
                    const sqrt_s1 = MATHJS.sqrt(MATHJS.bignumber(MATHJS.abs(S[nonZeroIndices[0]]))) as MATHJS.BigNumber;
                    const sqrt_s2 = MATHJS.sqrt(MATHJS.bignumber(MATHJS.abs(S[nonZeroIndices[1]]))) as MATHJS.BigNumber;

                    // console.log(" sqrt :" +
                    //     "\n sqrt_s1 : " + format(sqrt_s1) +
                    //     "\n sqrt_s2 : " + format(sqrt_s2)
                    // );
                    let p = MATHJS.multiply(sqrt_s1, vec1) as MATHJS.BigNumber[];
                    let q = MATHJS.multiply(sqrt_s2, vec2) as MATHJS.BigNumber[];

                    // console.log(" p q :" +
                    //     "\n p : " + format(p) +
                    //     "\n q : " + format(q)
                    // );

                    // 调整符号
                    // if (S[nonZeroIndices[0]] * S[nonZeroIndices[1]] < 0) {
                    //     if (S[nonZeroIndices[1]] < 0) {
                    //         q = MATHJS.unaryMinus(q) as MATHJS.BigNumber[];
                    //     }
                    // }
                    q = MATHJS.unaryMinus(q) as MATHJS.BigNumber[];
                    const l0 = MATHJS.add(p, q);
                    const l1 = MATHJS.subtract(p, q);
                    // console.log(" 退化直线 :" +
                    //     "\n l0 : " + format(l0) +
                    //     "\n l1 : " + format(l1)
                    // );
                    lines.push(l0, l1);
                }

                // 5. 每条直线与原二次曲线之一求交（解二次方程），得到候选交点。
                for (let j = 0; j < lines.length; j++) {
                    const l = lines[j];
                    // console.log(" 直线 l :" + format(l));
                    let inters1 = Curve2Inter.LineXConic({ A: l[0], B: l[1], C: l[2] }, c0, null, c0a, tol_);
                    checkAndPush(inters1);
                    if (ret.length >= 4) {
                        break;
                    }
                    let inters2 = Curve2Inter.LineXConic({ A: l[0], B: l[1], C: l[2] }, c0, null, c0a, tol_);
                    checkAndPush(inters2);
                    if (ret.length >= 4) {
                        break;
                    }
                }
            }
            // 特征值分解
            if (isEigs && ret.length < 4) {
                console.log("特征值分解");
                const eigenvectors = MATHJS.eigs(B, { precision: 1e-25, eigenvectors: true }).eigenvectors;
                eigenvectors.sort((a, b): number => {
                    let va = MATHJS.abs(a.value) as MATHJS.BigNumber;
                    let vb = MATHJS.abs(b.value) as MATHJS.BigNumber;
                    return MATHJS.compare(vb, va) as number;
                });
                // console.log(" 特征值和特征向量 :" +
                //     "\n λ0 " + format(eigenvectors[0].value) + " vec " + format(eigenvectors[0].vector) +
                //     "\n λ1 " + format(eigenvectors[1].value) + " vec " + format(eigenvectors[1].vector) +
                //     "\n λ2 " + format(eigenvectors[2].value) + " vec " + format(eigenvectors[2].vector)
                // );
                // 检查最小特征值是否接近0（验证退化性）
                // if (MATHJS.larger(MATHJS.abs(eigenvectors[2].value), tol_)) {
                //     console.warn(`最小特征值 ${format(eigenvectors[2].value)} 不接近0，可能 λ 不准确`);
                // }

                let λ0 = eigenvectors[0].value as MATHJS.BigNumber;
                let λ1 = eigenvectors[1].value as MATHJS.BigNumber;
                let u = eigenvectors[0].vector as Array<MATHJS.BigNumber>;
                let v = eigenvectors[1].vector as Array<MATHJS.BigNumber>;

                // 虚数特征值跳过
                if (MATHJS.typeOf(λ0) === 'Complex' || MATHJS.typeOf(λ1) === 'Complex') {
                    continue
                }
                // λ0 * λ1 < 0 两个实数特征值
                if (!MATHJS.largerEq(MATHJS.multiply(λ0, λ1), 0)) {
                    let λ0_sqrt = MATHJS.sqrt(MATHJS.abs(λ0)) as MATHJS.BigNumber;
                    let λ1_sqrt = MATHJS.sqrt(MATHJS.abs(λ1)) as MATHJS.BigNumber;

                    // console.log(" 特征值和特征向量 :" +
                    //     "\n λ0 u : " + format(λ0) + " " + format(u[0]) + " " + format(u[1]) + " " + format(u[2]) +
                    //     "\n λ1 v : " + format(λ1) + " " + format(v[0]) + " " + format(v[1]) + " " + format(v[2])
                    // );

                    let p = MATHJS.multiply(u, λ0_sqrt) as MATHJS.BigNumber[];
                    let q = MATHJS.multiply(v, λ1_sqrt) as MATHJS.BigNumber[];
                    if (!MATHJS.largerEq(λ1, 0)) {
                        q = MATHJS.unaryMinus(q);
                    }
                    // console.log(" p q :" +
                    //     "\n p : " + format(p) +
                    //     "\n q : " + format(q)
                    // );
                    let l0 = MATHJS.add(p, q) as MATHJS.BigNumber[];
                    let l1 = MATHJS.subtract(p, q) as MATHJS.BigNumber[];
                    const lines: MATHJS.BigNumber[][] = [];
                    lines.push(l0, l1);
                    // console.log(" 退化直线 :" +
                    //     "\n l0 : " + format(l0) +
                    //     "\n l1 : " + format(l1)
                    // );
                    // 5. 每条直线与原二次曲线之一求交（解二次方程），得到候选交点。
                    for (let j = 0; j < lines.length; j++) {
                        const l = lines[j];
                        // console.log(" 直线 l :" + format(l));
                        let inters1 = Curve2Inter.LineXConic({ A: l[0], B: l[1], C: l[2] }, c0, null, c0a, tol_);
                        checkAndPush(inters1);
                        if (ret.length >= 4) {
                            break;
                        }
                        let inters2 = Curve2Inter.LineXConic({ A: l[0], B: l[1], C: l[2] }, c1, null, c0a, tol_);
                        checkAndPush(inters2);
                        if (ret.length >= 4) {
                            break;
                        }
                    }
                }
            }
        }
        return ret;
    }

    /**
     * 用二分逼近在c0上寻找与c1的交点。
     * 在c0的参数空间内迭代。
     * 寻找一个c0的参数u0，使得c0.p(u0)在c1上，即满足c1的一般方程。
     * 误差小于tol时停止。
     * p0s为c0上的初始猜测点。
     * 
     * @param {Curve2Algo} [c0] - The frist curve.
     * @param {Curve2Algo} [c1] - The second curve.
     * @param {number} [tol] - The tolerance of distance.
     */
    static Binary(
        c0a: Curve2Algo,
        c1a: Curve2Algo,
        p0: InterOfCurve2,
        tol: number): void {
        let ret = p0;
        let g = c1a.g(p0.p);
        let s = Math.log10(Math.abs(g));
        let du = 0.1 * (s > 1 ? s : 1);
        let du_ = 0;
        let times = 0;
        while (true) {
            times++;
            ret.u0 += du;
            let u = ret.u0;
            let dp = c0a.p(u);
            let dg = c1a.g(dp);
            // 异号时，说明跨过了根，减小步长并反向
            if (g * dg < 0) {
                du = -du * 0.5;
            }
            // 扩张时，反向
            else if (Math.abs(dg) > Math.abs(g)) {
                du = -du * 0.5;
            }
            // 收缩时
            else if (Math.abs(dg) < Math.abs(g)) {
                // let s = Math.log10(Math.abs(dg) / (Math.abs(g) - Math.abs(dg)))
                // if (s > 1) {
                //     du = du * s;
                // }
            }
            // 满足要求,找到了在c1上的点
            if (Math.abs(dg) < tol) {
                ret.p = dp;
                ret.u1 = c1a.u(dp);
                break;
            }
            // 迭代结果不变，认为已经收敛，或者du已经很小。
            else if (Math.abs(g - dg) < tol && du_ == du || Math.abs(du) < 1e-15) {
                ret.p = dp;
                ret.u1 = c1a.u(dp);
                break;
            }
            else {
                g = dg;
                du_ = du;
            }
        }
        if (times > 1000) {
            console.warn("times :" + times);
        } else {
            console.log("times :" + times);
        }
    }

    // 构建二次型矩阵
    static QuadraticMatrix(c: { A: MATHJS.BigNumber, B: MATHJS.BigNumber, C: MATHJS.BigNumber, D: MATHJS.BigNumber, E: MATHJS.BigNumber, F: MATHJS.BigNumber }): Array<Array<MATHJS.BigNumber>> {
        let A = new Array<Array<MATHJS.BigNumber>>(3);
        let row0 = new Array<MATHJS.BigNumber>(3);
        let row1 = new Array<MATHJS.BigNumber>(3);
        let row2 = new Array<MATHJS.BigNumber>(3);
        row0[0] = c.A;
        row0[1] = MATHJS.multiply(c.B, 0.5) as MATHJS.BigNumber;
        row0[2] = MATHJS.multiply(c.D, 0.5) as MATHJS.BigNumber;
        row1[0] = MATHJS.multiply(c.B, 0.5) as MATHJS.BigNumber;
        row1[1] = c.C;
        row1[2] = MATHJS.multiply(c.E, 0.5) as MATHJS.BigNumber;
        row2[0] = MATHJS.multiply(c.D, 0.5) as MATHJS.BigNumber;
        row2[1] = MATHJS.multiply(c.E, 0.5) as MATHJS.BigNumber;
        row2[2] = c.F;
        A[0] = row0;
        A[1] = row1;
        A[2] = row2;
        return A;
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