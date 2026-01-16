import { Vector2 } from "../../../../math/Math";
import * as MATHJS from '../../../../mathjs';
import { Line2Data } from "../../../data/base/curve2/Line2Data";
import { Curve2Algo } from "../Curve2Algo";
/**
 * 2D line algorithm.
 *
 */
class Line2Algo extends Curve2Algo {
    /**
     * The data struct of this 2D line algorithm.
     *
     * @type {Line2Data}
     */
    protected dat_: Line2Data;
    public get dat(): Line2Data {
        return this.dat_;
    }
    public set dat(dat: Line2Data) {
        this.dat_ = dat;
    }
    /**
     * Constructs a 2D line algorithm.
     *
     * @param {Curve2Data} [dat=Line2Data] - The data struct of this 2D line algorithm.
     */
    constructor(dat = new Line2Data()) {
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
        switch (r) {
            case 0:
                let m = this.dat.trans.makeLocalMatrix();
                let ret = new Vector2(u, 0);
                ret.applyMatrix3(m);
                return ret;
            case 1:
                return new Vector2(Math.cos(this.dat.trans.rot), Math.sin(this.dat.trans.rot));
            default:
                return new Vector2(0, 0);
        }
    }

    /**
     * the G(general) function return the value of the general equation for the curve.
     * if point on curve then the return value is zero.
     * f(x,y) = 0
     * 
     * @param {Vector2} [point] - the point baout curve. 
     * @retun {number}
     */
    g(point: Vector2): number {
        let v = point.clone();
        v.applyMatrix3(this.dat.trans.makeWorldMatrix().invert());
        return v.y;
    }

    /**
     * the U function return u parameter at a position .
     * @param {Vector2} [point] - the point on curve.
     * @retun {number}
     */
    u(point: Vector2): number {
        let v0 = point.clone().sub(this.dat.trans.pos);
        let u = v0.length() * (v0.dot(new Vector2(Math.cos(this.dat.trans.rot), Math.sin(this.dat.trans.rot))) > 0 ? 1 : -1);
        return u
    }

    /**
     * the GE function return general equation coefficients of 2D line.
     * @param {Line2Data} [c = Line2Data] - The data struct of 2D line.
     * @retun {A B C} - General equation coefficients.
     */
    ge(): { A: MATHJS.BigNumber, B: MATHJS.BigNumber, C: MATHJS.BigNumber } {
        // 直线系数计算
        // A = -sin(θ)
        // B = cos(θ)
        // C = - A*x0 - B*y0
        // 曲线的二元一次方程组
        // Ax + By + C = 0
        let c = this.dat;
        let θ = MATHJS.bignumber(c.trans.rot);
        let x0 = MATHJS.bignumber(c.trans.pos.x);
        let y0 = MATHJS.bignumber(c.trans.pos.y);
        let A = MATHJS.unaryMinus(MATHJS.sin(θ));
        let B = MATHJS.cos(θ);
        let C = MATHJS.add(MATHJS.multiply(MATHJS.unaryMinus(A), x0), MATHJS.multiply(MATHJS.unaryMinus(B), y0)) as MATHJS.BigNumber;
        return { A, B, C };
    }
}

export { Line2Algo };