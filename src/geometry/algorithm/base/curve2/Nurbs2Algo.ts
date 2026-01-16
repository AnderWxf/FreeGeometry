import { Vector2, Vector4 } from "../../../../math/Math";
import { Nurbs2Data } from "../../../data/base/curve2/Nurbs2Data";
import { Transform2 } from "../../../data/base/Transform2";
import { Curve2Algo } from "../Curve2Algo";
import * as MATHJS from 'mathjs';
import verb from 'verb-nurbs';
// import * as verb from 'verb-nurbs';

/**
 * nurbs algorithm.
 *
 */
class Nurbs2Algo extends Curve2Algo {
    /**
     * The data struct of this nurbs algorithm.
     *
     * @type {Nurbs2Data}
     */
    protected override dat_: Nurbs2Data;
    private curve_: any;

    public override get dat(): Nurbs2Data {
        return this.dat_;
    }

    public override set dat(dat: Nurbs2Data) {
        this.dat_ = dat;
    }
    /**
     * Constructs a nurbs algorithm.
     *
     * @param {Curve2Data} [dat=Nurbs2Data] - The data struct of this nurbs algorithm.
     */
    constructor(dat: Nurbs2Data) {
        super(dat);
        this.dat = dat;
        let controls: number[][] = [];
        for (let i = 0; i < dat.controls.length; i++) {
            controls.push([dat.controls[i].x, dat.controls[i].y]);
        }
        this.curve_ = new verb.geom.NurbsCurve({
            degree: dat.degree, // 维度
            knots: dat.knots, // 节点向量
            controlPoints: controls
        }
        );
    }

    /**
     * the D(derivative) function return r-order derivative vector at u parameter.
     * @param {number} [u ∈ [0,a]] - the u parameter of curve.
     * @param {number} [r ∈ [0,1,2...]] - r-order.
     * @retun {Vector2}
     */
    override d(u: number, r: number = 0): Vector2 {
        if (r === 0) {
            let points = verb.eval.Eval.rational_curve_point(this.curve_, u);
            return new Vector2(points[0], points[1]);
        }
        return null;
    }
    /**
     * 使用正则化最小二乘法拟合 NURBS 曲线
     */
    public static Fit(
        points: number[][],  // [[x1,y1], [x2,y2], ...]
        degree: number,
        numControlPoints: number,
        lambda: number = 0.1  // 正则化参数
    ): Nurbs2Data {
        const curveData = verb.eval.Make.rational_interp_curve(points, degree, false, null, null);
        return new Nurbs2Data(new Transform2(), [], curveData.knots, [], degree);
    }
    /**
     * 使用正则化最小二乘法拟合 NURBS 曲线
     */
    public static Fit1(
        points: number[][],  // [[x1,y1], [x2,y2], ...]
        degree: number,
        numControlPoints: number,
        lambda: number = 0.1  // 正则化参数
    ): Nurbs2Data {
        const n = points.length;
        const dim = points[0].length;
        const m = numControlPoints;

        // 1. 参数化
        const params = Nurbs2Algo.ChordLengthParam(points);

        // 2. 生成节点向量
        const knots = Nurbs2Algo.GenerateKnots(params, m, degree);

        // 3. 构造设计矩阵
        const N = MATHJS.zeros(n, m) as MATHJS.Matrix;
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < m; j++) {
                N.set([i, j], Nurbs2Algo.BasisFunction(j, degree, params[i], knots));
            }
        }

        // 4. 添加正则化项
        const D = Nurbs2Algo.DifferenceMatrix(m, 2);  // 二阶差分
        const NtN = MATHJS.multiply(MATHJS.transpose(N), N);
        const regularization = MATHJS.multiply(lambda, MATHJS.multiply(MATHJS.transpose(D), D));
        const A = MATHJS.add(NtN, regularization);

        // 5. 对每个维度求解
        const controlPoints: number[][] = [];
        for (let d = 0; d < dim; d++) {
            const b = MATHJS.zeros(n, 1) as MATHJS.Matrix;
            for (let i = 0; i < n; i++) {
                b.set([i, 0], points[i][d]);
            }

            const Ntb = MATHJS.multiply(MATHJS.transpose(N), b);
            const x = MATHJS.lusolve(A, Ntb);

            const dimPoints: number[] = [];
            for (let j = 0; j < m; j++) {
                dimPoints.push(x.get([j, 0]));
            }

            if (d === 0) {
                // 第一维作为控制点数组的基础
                for (let j = 0; j < m; j++) {
                    controlPoints.push([dimPoints[j]]);
                }
            } else {
                for (let j = 0; j < m; j++) {
                    controlPoints[j].push(dimPoints[j]);
                }
            }
        }

        // 6. 设置权重（默认为 1）
        const weights = Array(m).fill(1);
        let controls = new Array<Vector2>();
        for (let i = 0; i < controlPoints.length; i++) {
            controls.push(new Vector2(controlPoints[i][0], controlPoints[i][1]));
        }
        let ret = new Nurbs2Data(new Transform2(), controls, knots, weights, degree);

        return ret;
    }

    private static ChordLengthParam(points: number[][]): number[] {
        const params = [0];
        let totalLength = 0;

        // 计算弦长
        const lengths: number[] = [];
        for (let i = 1; i < points.length; i++) {
            let dist = 0;
            for (let d = 0; d < points[0].length; d++) {
                const diff = points[i][d] - points[i - 1][d];
                dist += diff * diff;
            }
            const length = Math.sqrt(dist);
            lengths.push(length);
            totalLength += length;
        }

        // 归一化参数
        let currentLength = 0;
        for (let i = 0; i < lengths.length; i++) {
            currentLength += lengths[i];
            params.push(currentLength / totalLength);
        }

        return params;
    }

    private static GenerateKnots(params: number[], m: number, p: number): number[] {
        const n = params.length - 1;
        const knots: number[] = [];

        // 开始节点 (p+1 个 0)
        for (let i = 0; i <= p; i++) knots.push(0);

        // 内部节点
        for (let j = 1; j <= m - p; j++) {
            const i = Math.floor(j * n / (m - p + 1));
            knots.push(params[i]);
        }

        // 结束节点 (p+1 个 1)
        for (let i = 0; i <= p; i++) knots.push(1);

        return knots;
    }

    private static BasisFunction(i: number, p: number, u: number, knots: number[]): number {
        if (p === 0) {
            return (knots[i] <= u && u < knots[i + 1]) ? 1 : 0;
        }

        const left = (knots[i + p] - knots[i]) === 0 ? 0 :
            ((u - knots[i]) / (knots[i + p] - knots[i])) * this.BasisFunction(i, p - 1, u, knots);

        const right = (knots[i + p + 1] - knots[i + 1]) === 0 ? 0 :
            ((knots[i + p + 1] - u) / (knots[i + p + 1] - knots[i + 1])) * this.BasisFunction(i + 1, p - 1, u, knots);

        return left + right;
    }

    private static DifferenceMatrix(size: number, order: number): MATHJS.Matrix {
        if (order === 1) {
            const D = MATHJS.zeros(size - 1, size) as MATHJS.Matrix;
            for (let i = 0; i < size - 1; i++) {
                D.set([i, i], -1);
                D.set([i, i + 1], 1);
            }
            return D;
        } else {
            const D1 = this.DifferenceMatrix(size, 1);
            const D2 = this.DifferenceMatrix(size - 1, 1);
            return MATHJS.multiply(D2, D1);
        }
    }

}
export { Nurbs2Algo };