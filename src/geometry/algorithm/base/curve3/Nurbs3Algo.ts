import { Vector2, Vector3 } from "../../../../math/Math";
import { Nurbs3Data } from "../../../data/base/curve3/Nurbs3Data";
import { Transform3 } from "../../../data/base/Transform3";
import { Curve3Algo } from "../Curve3Algo";
import verb from 'verb-nurbs';
/**
 * nurbs algorithm.
 *
 */
class Nurbs3Algo extends Curve3Algo {
    /**
     * The data struct of this nurbs algorithm.
     *
     * @type {Nurbs3Data}
     */
    public override dat_: Nurbs3Data;
    private curve_: any;

    public override get dat(): Nurbs3Data {
        return this.dat_;
    }

    public override set dat(dat: Nurbs3Data) {
        this.dat_ = dat;
        let controls: number[][] = [];
        for (let i = 0; i < dat.controls.length; i++) {
            controls.push([dat.controls[i].x, dat.controls[i].y, dat.controls[i].z]);
        }
        this.curve_ = new verb.geom.NurbsCurve({
            degree: dat.degree, // 维度
            knots: dat.knots, // 节点向量
            controlPoints: controls
        }
        );
    }
    /**
     * Constructs a nurbs algorithm.
     *
     * @param {Curve3Data} [dat=Nurbs3Data] - The data struct of this nurbs algorithm.
     */
    constructor(dat: Nurbs3Data) {
        super(dat);
        this.dat = dat;
    }

    /**
     * the U function return u parameter at a position .
     * @param {Vector3} [point] - the point on curve.
     * @retun {number}
     */
    u(point: Vector3): number {
        let v = point.clone();
        v.applyMatrix4(this.dat.trans.makeWorldMatrix().invert());
        let u = verb.eval.Analyze.rationalCurveClosestParam(this.curve_._data, [v.x, v.y]) as number;
        return u;
    }

    /**
     * the D(derivative) function return r-order derivative vector at u parameter.
     * @param {number} [u ∈ [0,a]] - the u parameter of curve.
     * @param {number} [r ∈ [0,1,2...]] - r-order.
     * @retun {Vector3}
     */
    override d(u: number, r: number = 0): Vector3 {
        if (r === 0) {
            let points = verb.eval.Eval.curvePoint(this.curve_._data, u) as number[];
            return new Vector3(points[0], points[1]);
        } else {
            let points = verb.eval.Eval.rationalCurveDerivatives(this.curve_._data, u, r) as number[];
            return new Vector3(points[0], points[1]);
        }
    }

    /**
     * the G(general) function return the value of the general equation for the curve.
     * if point on curve then the return value is zero.
     * @param {Vector3} [point] - the point baout curve. 
     * @retun {number}
     */
    g(point: Vector3): Vector2 {
        // let v = point.clone();
        // v.applyMatrix4(this.dat.trans.makeWorldMatrix().invert());
        // let u = verb.eval.Analyze.rationalCurveClosestParam(this.curve_._data, [v.x, v.y]) as number;
        // let p_ = verb.eval.Eval.rationalCurvePoint(this.curve_._data, u) as number[];
        // let t_ = verb.eval.Eval.rationalCurveDerivatives(this.curve_._data, u, 1) as number[];
        // let p = new Vector3(p_[0], p_[1]);
        // let v0 = new Vector3(t_[0], t_[1]); // 切向量
        // let v1 = p.clone().sub(v);          // 投影点到目标点方向
        // let ret = v1.length();
        // let d = v1.cross(v0);
        // // 叉乘>0,则v1在v0右侧，返回值取负数，反之取正数。
        // if (d.z > 0) {
        //     ret = -ret;
        // }
        return null;
    }

    /**
     * 曲线弧长
     */
    public length(): number {
        return verb.eval.Analyze.rationalCurveArcLength(this.curve_._data, 1);
        // return this.curve_.length();
    }
    /**
     * 使用正则化最小二乘法拟合 NURBS 曲线
     */
    public static Fit(
        points: Vector3[],  // [[x1,y1], [x2,y2], ...]
        degree: number,
        // numControlPoints: number,
        // lambda: number = 0.1  // 正则化参数
    ): Nurbs3Data {
        let pts: number[][] = [];
        for (let i = 0; i < points.length; i++) {
            pts.push([points[i].x, points[i].y]);
        }

        // const curveData = verb.eval.Make.rational_interp_curve(pts, degree, false, null, null);
        const curveData = verb.eval.Make.rationalInterpCurve(pts, degree, false, null, null);
        const controlPoints = curveData.controlPoints.map((point: any) => new Vector3(point[0], point[1], point[2]));
        return new Nurbs3Data(new Transform3(), controlPoints, curveData.knots, degree);
    }
}

export { Nurbs3Algo };