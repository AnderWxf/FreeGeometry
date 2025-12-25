import { Vector2 } from "../../../../math/Math";
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
     * the D(derivative) function return r-order derivative vector at u parameter.
     * @param {number} [u ∈ [0,a]] - the u parameter of curve.
     * @param {number} [r ∈ [0,1,2...]] - r-order.
     * @retun {Vector2}
     */
    override d(u: number, r: number = 0): Vector2 {
        let x = MATHJS.bignumber(u);
        let m = this.dat.trans.makeLocalMatrix();
        let f4_ = MATHJS.divide(MATHJS.bignumber(1), MATHJS.multiply(MATHJS.bignumber(this.dat.f), 4)) as MATHJS.BigNumber;
        switch (r) {
            case 0:
                {
                    // y = x²/4f         
                    let y = MATHJS.multiply(x, x, f4_) as MATHJS.BigNumber;
                    let ret = new Vector2(x.toNumber(), y.toNumber());
                    ret.applyMatrix3(m);
                    return ret;
                }
            case 1:
                {
                    // y' = 2x/4f           
                    let y = MATHJS.add(x, x, f4_, 2) as MATHJS.BigNumber;
                    let ret = new Vector2(x.toNumber(), y.toNumber());
                    ret.applyMatrix3(m);
                    return ret;
                }
            case 2:
                {
                    // y'' = 2/4f     
                    let ret = new Vector2(u, f4_.toNumber() * 2);
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
        let c = this.dat;
        let p = MATHJS.bignumber(c.f);
        let φ = MATHJS.bignumber(c.trans.rot);
        let x0 = MATHJS.bignumber(c.trans.pos.x);
        let y0 = MATHJS.bignumber(c.trans.pos.y);
        let sinφ = MATHJS.sin(φ);
        let cosφ = MATHJS.cos(φ);
        let sin2φ = MATHJS.sin(MATHJS.multiply(φ, 2) as MATHJS.BigNumber);

        let A = MATHJS.multiply(cosφ, cosφ) as MATHJS.BigNumber;
        let B = sin2φ;
        let C = MATHJS.multiply(sinφ, sinφ) as MATHJS.BigNumber;
        let D = MATHJS.add(
            MATHJS.multiply(p, sinφ, 4),
            MATHJS.unaryMinus(MATHJS.multiply(A, x0, 2)),
            MATHJS.unaryMinus(MATHJS.multiply(B, y0))
        ) as MATHJS.BigNumber;
        let E = MATHJS.add(
            MATHJS.unaryMinus(MATHJS.multiply(p, cosφ, 4)),
            MATHJS.unaryMinus(MATHJS.multiply(B, x0)),
            MATHJS.unaryMinus(MATHJS.multiply(C, y0, 2))
        ) as MATHJS.BigNumber;
        let F = MATHJS.add(
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