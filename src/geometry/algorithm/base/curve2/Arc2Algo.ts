import { Matrix3, Vector2 } from "../../../../math/Math";
import * as MATHJS from '../../../../mathjs';
import { MathUtils } from "../../../../math/MathUtils";
import { Arc2Data } from "../../../data/base/curve2/Arc2Data";
import { Curve2Algo } from "../Curve2Algo";
/**
 * 2D arc algorithm.
 * x = acos(φ)
 * y = bsin(φ)
 */
class Arc2Algo extends Curve2Algo {
    /**
     * The data struct of this 2D arc algorithm.
     *
     * @type {Arc2Data}
     */
    protected dat_: Arc2Data;
    public get dat(): Arc2Data {
        return this.dat_;
    }
    public set dat(dat: Arc2Data) {
        this.dat_ = dat;
    }
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
        // const x = MATHJS.bignumber(v.x);
        // const y = MATHJS.bignumber(v.y);
        // let a = MathUtils.clamp((MATHJS.divide(x, MATHJS.bignumber(this.dat.radius.x)) as MATHJS.BigNumber).toNumber(), -1, 1);
        // let b = MathUtils.clamp((MATHJS.divide(y, MATHJS.bignumber(this.dat.radius.y)) as MATHJS.BigNumber).toNumber(), -1, 1);

        let x = MathUtils.clamp(v.x / this.dat.radius.x, -1, 1);
        let y = MathUtils.clamp(v.y / this.dat.radius.y, -1, 1);

        let r = Math.atan2(y, x);
        if (r < 0) {
            r += Math.PI * 2
        }
        return r;

        // a = Math.acos(a);
        // b = Math.asin(b);
        // if (b >= 0) {
        //     return a;
        // } else {
        //     return Math.PI * 2 - a;
        // }
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
     * the G(general) function return the value of the general equation for the curve.
     * if point on curve then the return value is zero.
     * f(x,y) = 0
     * x²/a² + y²/b² - 1 = 0
     * @param {Vector2} [point] - the point baout curve. 
     * @retun {number}
     */
    g(point: Vector2): number {
        let v = point.clone();
        v.applyMatrix3(this.dat.trans.makeWorldMatrix().invert());
        const x = MATHJS.bignumber(v.x);
        const y = MATHJS.bignumber(v.y);
        let a = MATHJS.bignumber(this.dat.radius.x);
        let b = MATHJS.bignumber(this.dat.radius.y);
        return (MATHJS.add(
            MATHJS.divide(MATHJS.multiply(x, x), MATHJS.multiply(a, a)),
            MATHJS.divide(MATHJS.multiply(y, y), MATHJS.multiply(b, b)),
            -1) as MATHJS.BigNumber).toNumber();
    }

    /**
     * the GE function return general equation coefficients of 2D Arc.
     * @param {Arc2Data} [c = Arc2Data] - The data struct of 2D arc.
     * @retun {A B C D E F} - General equation coefficients.
     */
    ge(): { A: MATHJS.BigNumber, B: MATHJS.BigNumber, C: MATHJS.BigNumber, D: MATHJS.BigNumber, E: MATHJS.BigNumber, F: MATHJS.BigNumber } {
        // Qnew = T^-T * Qold * T^-1
        let dat = this.dat;
        let a = (MATHJS.divide(MATHJS.bignumber(1), MATHJS.multiply(dat.radius.x, dat.radius.x)) as MATHJS.BigNumber).toNumber();
        let c = (MATHJS.divide(MATHJS.bignumber(1), MATHJS.multiply(dat.radius.y, dat.radius.y)) as MATHJS.BigNumber).toNumber();
        let t_1 = dat.trans.makeLocalMatrix().invert();
        let t_t = t_1.clone().transpose();
        let Qold = new Matrix3().set(
            a, 0, 0,
            0, c, 0,
            0, 0, -1
        );
        let Qnew = t_t.multiply(Qold).multiply(t_1);
        return {
            A: MATHJS.bignumber(Qnew.elements[0]),
            B: MATHJS.bignumber(Qnew.elements[1] + Qnew.elements[3]),
            C: MATHJS.bignumber(Qnew.elements[4]),
            D: MATHJS.bignumber(Qnew.elements[2] + Qnew.elements[6]),
            E: MATHJS.bignumber(Qnew.elements[5] + Qnew.elements[7]),
            F: MATHJS.bignumber(Qnew.elements[8])
        };
    }
}

export { Arc2Algo };