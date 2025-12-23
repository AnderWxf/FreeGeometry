import { Vector2 } from "../../../../math/Math";
import * as MATHJS from '../../../../mathjs';
import { MathUtils } from "../../../../math/MathUtils";
import { Arc2Data } from "../../../data/base/curve2/Arc2Data";
import { Curve2Algo } from "../Curve2Algo";
/**
 * 2D arc algorithm.
 *
 */
class Arc2Algo extends Curve2Algo {
    /**
     * The data struct of this 2D arc algorithm.
     *
     * @type {Arc2Data}
     */
    public override dat: Arc2Data;

    /**
     * Constructs a 2D arc algorithm.
     *
     * @param {Curve2Data} [dat=Arc2Data] - The data struct of this 2D arc algorithm.
     */
    constructor(dat = new Arc2Data()) {
        super(dat);
        this.dat = dat;
    }

    /**
     * the U function return u parameter at a position .
     * @param {Vector2} [point] - the point on curve.
     * @retun {number}
     */
    u(point: Vector2): number {
        let v = point.clone();
        v.applyMatrix3(this.dat.trans.makeWorldMatrix().invert());
        let a = Math.acos(MathUtils.clamp(v.x / this.dat.radius.x, -1, 1));
        let b = Math.asin(MathUtils.clamp(v.y / this.dat.radius.y, -1, 1));
        if (b >= 0) {
            return a;
        } else {
            return Math.PI * 2 - a;
        }
    }

    /**
     * the D(derivative) function return r-order derivative vector at u parameter.
     * @param {number} [u ∈ [0,a]] - the u parameter of curve.
     * @param {number} [r ∈ [0,1,2...]] - r-order.
     * @retun {Vector2}
     */
    override d(u: number, r: number = 0): Vector2 {
        switch (r % 4) {
            case 0:
                {
                    let m = this.dat.trans.makeLocalMatrix();
                    let ret = new Vector2(this.dat.radius.x * Math.cos(u), this.dat.radius.y * Math.sin(u));
                    ret.applyMatrix3(m);
                    return ret;
                }
            case 1:
                {
                    let m = this.dat.trans.makeLocalMatrix();
                    let ret = new Vector2(-this.dat.radius.x * Math.sin(u), this.dat.radius.y * Math.cos(u));
                    ret.applyMatrix3(m);
                    return ret;
                }
            case 2:
                {
                    let m = this.dat.trans.makeLocalMatrix();
                    let ret = new Vector2(-this.dat.radius.x * Math.cos(u), -this.dat.radius.y * Math.sin(u));
                    ret.applyMatrix3(m);
                    return ret;
                }
            case 3:
                {
                    let m = this.dat.trans.makeLocalMatrix();
                    let ret = new Vector2(this.dat.radius.x * Math.sin(u), -this.dat.radius.y * Math.cos(u));
                    ret.applyMatrix3(m);
                    return ret;
                }
        }
    }
    /**
     * the GE function return general equation coefficients of 2D Arc.
     * @param {Arc2Data} [c = Arc2Data] - The data struct of 2D arc.
     * @retun {A B C D E F} - General equation coefficients.
     */
    ge(): { A: MATHJS.BigNumber, B: MATHJS.BigNumber, C: MATHJS.BigNumber, D: MATHJS.BigNumber, E: MATHJS.BigNumber, F: MATHJS.BigNumber } {
        // 曲线系数计算
        // A = a²sin²φ + b²cos²φ, 
        // B = (a² − b²)sin2φ
        // C = a²cos²φ +b²sin²φ, 
        // D = −2Ax0 − By0 ,E = −2Cy0 − Bx0
        // F = Ax0² + Bx0y0 + Cy0² − a²b²     
        // 曲线的二元二次方程组
        // Ax² + Bxy + Cy² + Dx + Ey + F = 0
        let c = this.dat;
        let a = MATHJS.bignumber(c.radius.x);
        let b = MATHJS.bignumber(c.radius.y);
        let φ = MATHJS.bignumber(c.trans.rot);
        let x0 = MATHJS.bignumber(c.trans.pos.x);
        let y0 = MATHJS.bignumber(c.trans.pos.y);
        let aa = MATHJS.multiply(a, a);
        let bb = MATHJS.multiply(b, b);
        let sinφ = MATHJS.sin(φ);
        let cosφ = MATHJS.cos(φ);
        let sin2φ = MATHJS.sin(MATHJS.multiply(φ, 2) as MATHJS.BigNumber);

        let A = MATHJS.add(MATHJS.multiply(aa, MATHJS.multiply(sinφ, sinφ)), MATHJS.multiply(bb, MATHJS.multiply(cosφ, cosφ))) as MATHJS.BigNumber;
        let B = MATHJS.multiply(MATHJS.subtract(aa, bb), sin2φ) as MATHJS.BigNumber;
        let C = MATHJS.add(MATHJS.multiply(aa, MATHJS.multiply(cosφ, cosφ)), MATHJS.multiply(bb, MATHJS.multiply(sinφ, sinφ))) as MATHJS.BigNumber;
        let D = MATHJS.add(MATHJS.unaryMinus(MATHJS.multiply(2, A)), x0) as MATHJS.BigNumber;
        let E = MATHJS.add(MATHJS.unaryMinus(MATHJS.multiply(2, C)), y0) as MATHJS.BigNumber;
        let F = MATHJS.add(MATHJS.add(MATHJS.multiply(A, x0), MATHJS.multiply(B, x0)), y0) as MATHJS.BigNumber;
        return { A, B, C, D, E, F };
    }
}

export { Arc2Algo };