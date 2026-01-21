import { Vector3 } from "../../../../math/Math";
import * as MATHJS from '../../../../mathjs';
import { Line3Data } from "../../../data/base/curve3/Line3Data";
import { Curve3Algo } from "../Curve3Algo";
/**
 * 3D line algorithm.
 *
 */
class Line3Algo extends Curve3Algo {
    /**
     * The data struct of this 3D line algorithm.
     *
     * @type {Line3Data}
     */
    protected dat_: Line3Data;
    public get dat(): Line3Data {
        return this.dat_;
    }
    public set dat(dat: Line3Data) {
        this.dat_ = dat;
    }

    /**
     * Constructs a 3D line algorithm.
     *
     * @param {Curve3Data} [dat=Line3Data] - The data struct of this 3D line algorithm.
     */
    constructor(dat = new Line3Data()) {
        super(dat);
        this.dat = dat;
    }

    /**
     * the D(derivative) function return r-order derivative vector at u parameter.
     * @param {number} [u ∈ [0,a]] - the u parameter of curve.
     * @param {number} [r ∈ [0,1,3...]] - r-order.
     * @retun {Vector3}
     */
    override d(u: number, r: number = 0): Vector3 {
        if (r == 0) {
            let m = this.dat.trans.makeLocalMatrix();
            let ret = new Vector3(u, 0);
            ret.applyMatrix4(m);
            return ret;
        } else {
            return new Vector3(0, 0);
        }
    }
}

export { Line3Algo };