import { Vector2 } from "../../../../math/Math";
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
    public override dat: Line2Data;

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
}

export { Line2Algo };