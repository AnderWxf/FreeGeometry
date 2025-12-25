import { Vector2 } from "../../../../math/Math";
import * as MATHJS from '../../../../mathjs';
import { MathUtils } from "../../../../math/MathUtils";
import { Hyperbola2Data } from "../../../data/base/curve2/Hyperbola2Data";
import { Curve2Algo } from "../Curve2Algo";
/**
 * 2D Hyperbola algorithm. TODO
 * x = asec(φ)
 * y = btan(φ)
 */
class Hyperbola2Algo extends Curve2Algo {
    /**
     * The data struct of this 2D Hyperbola algorithm.
     *
     * @type {Hyperbola2Data}
     */
    public override dat: Hyperbola2Data;

    /**
     * Constructs a 2D Hyperbola algorithm.
     *
     * @param {Curve2Data} [dat=Hyperbola2Data] - The data struct of this 2D Hyperbola algorithm.
     */
    constructor(dat = new Hyperbola2Data()) {
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
        let a = MATHJS.bignumber(this.dat.radius.x);
        let b = MATHJS.bignumber(this.dat.radius.y);
        let m = this.dat.trans.makeLocalMatrix();
        switch (r) {
            case 0:
                {
                    // x = asec(φ)
                    // y = btan(φ)         
                    let x = MATHJS.multiply(a, MATHJS.sec(u)) as MATHJS.BigNumber;
                    let y = MATHJS.multiply(b, MATHJS.tan(u)) as MATHJS.BigNumber;
                    let ret = new Vector2(x.toNumber(), y.toNumber());
                    ret.applyMatrix3(m);
                    return ret;
                }
            case 1:
                {
                    // x' = asec(φ)tan(φ)
                    // y' = bsec(φ)sec(φ)              
                    let x = MATHJS.multiply(a, MATHJS.sec(u), MATHJS.tan(u)) as MATHJS.BigNumber;
                    let y = MATHJS.multiply(b, MATHJS.tan(u), MATHJS.sec(u)) as MATHJS.BigNumber;
                    let ret = new Vector2(x.toNumber(), y.toNumber());
                    ret.applyMatrix3(m);
                    return ret;
                }
            case 2:
                {
                    // x'' = a(sec(φ)tan(φ)tan(φ) + sec(φ)sec(φ)sec(φ)) = a(sec(φ)tan^2(φ) + sec^3(φ))
                    // y'' = b(2sec(φ)sec(φ)tan(φ)) = 2bsec^2(φ)tan(φ)  
                    let su = MATHJS.sec(u);
                    let tu = MATHJS.tan(u);
                    let x = MATHJS.add(MATHJS.multiply(su, tu, tu), MATHJS.multiply(su, su, su)) as MATHJS.BigNumber;
                    let y = MATHJS.multiply(b, su, su, tu, 2) as MATHJS.BigNumber;
                    let ret = new Vector2(x.toNumber(), y.toNumber());
                    ret.applyMatrix3(m);
                    return ret;
                }
            case 3:
                {
                    // x'' = a(sec(φ)tan^3(φ) + 2tan(φ)sec^3(φ) + 3sec^3(φ)tan(φ))
                    // y'' = 2b(2sec^2(φ)tan^2(φ) + sec^4(φ))
                    let su = MATHJS.sec(u);
                    let tu = MATHJS.tan(u);
                    let x = MATHJS.add(MATHJS.multiply(a, su, tu, tu, tu), MATHJS.multiply(a, tu, su, su, su, 2), MATHJS.multiply(a, su, su, su, tu, 3)) as MATHJS.BigNumber;
                    let y = MATHJS.add(MATHJS.multiply(b, su, su, tu, tu, 4), MATHJS.multiply(b, su, su, su, su, 2)) as MATHJS.BigNumber;
                    let ret = new Vector2(x.toNumber(), y.toNumber());
                    ret.applyMatrix3(m);
                    return ret;
                }
            default:
                debugger;
                return;
        }
    }
    /**
     * the GE function return general equation coefficients of 2D Hyperbola.
     * @param {Hyperbola2Data} [c = Hyperbola2Data] - The data struct of 2D Hyperbola.
     * @retun {A B C D E F} - General equation coefficients.
     */
    ge(): { A: MATHJS.BigNumber, B: MATHJS.BigNumber, C: MATHJS.BigNumber, D: MATHJS.BigNumber, E: MATHJS.BigNumber, F: MATHJS.BigNumber } {
        //设中心在 (x0,y0)，长半轴 a（沿旋转前 X 轴方向），短半轴 b（沿旋转前 Y 轴方向），旋转角为 φ（绕中心逆时针转）。
        // 曲线系数计算
        // A = cos²φ/a² - sin²φ/b², 
        // B = (1/a² + 1/b²)sin2φ
        // C = sin²φ/a² - cos²φ/b², 
        // D = −2 A x0 − B y0 
        // E = −2 C y0 − B x0
        // F = A x0² + B x0 y0 + C y0² − 1     
        // 曲线的二元二次方程组
        // Ax² + Bxy + Cy² + Dx + Ey + F = 0
        let c = this.dat;
        let a = MATHJS.bignumber(c.radius.x);
        let b = MATHJS.bignumber(c.radius.y);
        let φ = MATHJS.bignumber(c.trans.rot);
        let x0 = MATHJS.bignumber(c.trans.pos.x);
        let y0 = MATHJS.bignumber(c.trans.pos.y);
        let aa = MATHJS.divide(MATHJS.bignumber(1), MATHJS.multiply(a, a));// 1/a²
        let bb = MATHJS.divide(MATHJS.bignumber(1), MATHJS.multiply(a, a));// 1/b²
        let sinφ = MATHJS.sin(φ);
        let cosφ = MATHJS.cos(φ);
        let sin2φ = MATHJS.sin(MATHJS.multiply(φ, 2) as MATHJS.BigNumber);

        let A = MATHJS.subtract(
            MATHJS.multiply(cosφ, cosφ, aa),
            MATHJS.multiply(sinφ, sinφ, bb)
        ) as MATHJS.BigNumber;
        let B = MATHJS.multiply(MATHJS.add(aa, bb), sin2φ) as MATHJS.BigNumber;
        let C = MATHJS.subtract(
            MATHJS.multiply(aa, sinφ, sinφ),
            MATHJS.multiply(bb, cosφ, cosφ)
        ) as MATHJS.BigNumber;
        let D = MATHJS.add(
            MATHJS.unaryMinus(MATHJS.multiply(A, x0, 2)),
            MATHJS.unaryMinus(MATHJS.multiply(B, y0))
        ) as MATHJS.BigNumber;
        let E = MATHJS.add(
            MATHJS.unaryMinus(MATHJS.multiply(C, y0, 2)),
            MATHJS.unaryMinus(MATHJS.multiply(B, x0))
        ) as MATHJS.BigNumber;
        let F = MATHJS.add(
            MATHJS.multiply(A, x0, x0),
            MATHJS.multiply(B, x0, y0),
            MATHJS.multiply(C, y0, y0),
            MATHJS.bignumber(-1),
        ) as MATHJS.BigNumber;
        return { A, B, C, D, E, F };
    }
}

export { Hyperbola2Algo };