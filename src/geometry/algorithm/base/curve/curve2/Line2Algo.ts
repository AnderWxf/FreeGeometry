import { Vector2 } from "../../../../../math/Math";
import { Line2Data } from "../../../../data/base/curve/curve2/Line2Data";
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
     * get r-order derivative at t of curve.
     *
     * @retun {Vector2}
     */
    override derivative(t: number, r: number = 0): Vector2 {
        if (r == 0) {
            let m = this.dat.transform.makeLocalMatrix();
            let u = t * this.dat.length;
            m.scale(u, u);
            let ret = new Vector2(1, 0);
            ret.applyMatrix3(m);
            return ret;
        } else {
            return new Vector2(0, 0);
        }
    }
}

export { Line2Algo };