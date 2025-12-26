import { Vector2 } from "../../../../math/Math";
import { MathUtils } from "../../../../math/MathUtils";
import * as MATHJS from '../../../../mathjs';
import { Parabola2Data } from "../../../data/base/curve2/Parabola2Data";
import { Curve2Algo } from "../Curve2Algo";
/**
 * 2D Parabola algorithm. 
 * 4fy = x²
 */
class Parabola2Algo extends Curve2Algo {
    /**
     * The data struct of this 2D Parabola algorithm.
     *
     * @type {Parabola2Data}
     */
    public override dat: Parabola2Data;

    /**
     * Constructs a 2D Parabola algorithm.
     *
     * @param {Curve2Data} [dat=Parabola2Data] - The data struct of this 2D Parabola algorithm.
     */
    constructor(dat = new Parabola2Data()) {
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
        return v.x;
    }

    /**
     * the D(derivative) function return r-order derivative vector at u parameter.
     * @param {number} [u ∈ [0,a]] - the u parameter of curve.
     * @param {number} [r ∈ [0,1,2...]] - r-order.
     * @retun {Vector2}
     */
    override d(u: number, r: number = 0): Vector2 {
        const x = MATHJS.bignumber(u);
        const m = this.dat.trans.makeLocalMatrix();
        const f4_ = MATHJS.divide(MATHJS.bignumber(1), MATHJS.multiply(MATHJS.bignumber(this.dat.f), 4)) as MATHJS.BigNumber;
        switch (r) {
            case 0:
                {
                    // y = x²/4f         
                    const y = MATHJS.multiply(x, x, f4_) as MATHJS.BigNumber;
                    const ret = new Vector2(x.toNumber(), y.toNumber());
                    ret.applyMatrix3(m);
                    return ret;
                }
            case 1:
                {
                    // y' = 2x/4f           
                    const y = MATHJS.add(x, x, f4_, 2) as MATHJS.BigNumber;
                    const ret = new Vector2(x.toNumber(), y.toNumber());
                    ret.applyMatrix3(m);
                    return ret;
                }
            case 2:
                {
                    // y'' = 2/4f     
                    const ret = new Vector2(u, f4_.toNumber() * 2);
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
        //设中心在 (x0,y0)，对称轴为 Y 轴正方向，旋转角为 φ（绕中心逆时针转）。
        // 曲线系数计算
        // A = cos²φ, 
        // B = sin2φ
        // C = sin²φ, 
        // D = 4 p sinφ - 2 A x0 - B y0
        // E = −4 p cosφ - B x0 - 2 C y0
        // F = A x0² + B x0 y0 + C y0² − 4 p sinφ x0 + 4 p cosφ y0     
        // 曲线的二元二次方程组
        // Ax² + Bxy + Cy² + Dx + Ey + F = 0
        const c = this.dat;
        const p = MATHJS.bignumber(c.f);
        const φ = MATHJS.bignumber(c.trans.rot);
        const x0 = MATHJS.bignumber(c.trans.pos.x);
        const y0 = MATHJS.bignumber(c.trans.pos.y);
        const sinφ = MATHJS.sin(φ);
        const cosφ = MATHJS.cos(φ);
        const sin2φ = MATHJS.sin(MATHJS.multiply(φ, 2) as MATHJS.BigNumber);

        const A = MATHJS.multiply(cosφ, cosφ) as MATHJS.BigNumber;
        const B = sin2φ;
        const C = MATHJS.multiply(sinφ, sinφ) as MATHJS.BigNumber;
        const D = MATHJS.add(
            MATHJS.multiply(p, sinφ, 4),
            MATHJS.unaryMinus(MATHJS.multiply(A, x0, 2)),
            MATHJS.unaryMinus(MATHJS.multiply(B, y0))
        ) as MATHJS.BigNumber;
        const E = MATHJS.add(
            MATHJS.unaryMinus(MATHJS.multiply(p, cosφ, 4)),
            MATHJS.unaryMinus(MATHJS.multiply(B, x0)),
            MATHJS.unaryMinus(MATHJS.multiply(C, y0, 2))
        ) as MATHJS.BigNumber;
        const F = MATHJS.add(
            MATHJS.multiply(A, x0, x0),
            MATHJS.multiply(B, x0, y0),
            MATHJS.multiply(C, y0, y0),
            MATHJS.unaryMinus(MATHJS.multiply(p, sinφ, x0, 4)),
            MATHJS.multiply(p, cosφ, y0, 4),
        ) as MATHJS.BigNumber;
        return { A, B, C, D, E, F };
    }
}

export { Parabola2Algo };