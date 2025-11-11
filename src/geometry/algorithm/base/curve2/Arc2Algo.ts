import { Vector2 } from "../../../../math/Math";
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
}

export { Arc2Algo };