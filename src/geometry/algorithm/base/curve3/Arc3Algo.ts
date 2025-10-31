import { Vector3 } from "../../../../math/Math";
import { Arc3Data } from "../../../data/base/curve3/Arc3Data";
import { Curve3Algo } from "../Curve3Algo";
/**
 * 3D arc algorithm.
 *
 */
class Arc3Algo extends Curve3Algo {
    /**
     * The data struct of this 3D arc algorithm.
     *
     * @type {Arc3Data}
     */
    public override dat: Arc3Data;

    /**
     * Constructs a 3D arc algorithm.
     *
     * @param {Curve3Data} [dat=Arc3Data] - The data struct of this 3D arc algorithm.
     */
    constructor(dat = new Arc3Data()) {
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
        switch (r % 4) {
            case 0:
                {
                    let m = this.dat.trans.makeLocalMatrix();
                    let ret = new Vector3(this.dat.radius.x * Math.cos(u), this.dat.radius.y * Math.sin(u));
                    ret.applyMatrix4(m);
                    return ret;
                }
            case 1:
                {
                    let m = this.dat.trans.makeLocalMatrix();
                    let ret = new Vector3(-this.dat.radius.x * Math.sin(u), this.dat.radius.y * Math.cos(u));
                    ret.applyMatrix4(m);
                    return ret;
                }
            case 3:
                {
                    let m = this.dat.trans.makeLocalMatrix();
                    let ret = new Vector3(-this.dat.radius.x * Math.cos(u), -this.dat.radius.y * Math.sin(u));
                    ret.applyMatrix4(m);
                    return ret;
                }
            case 3:
                {
                    let m = this.dat.trans.makeLocalMatrix();
                    let ret = new Vector3(this.dat.radius.x * Math.sin(u), -this.dat.radius.y * Math.cos(u));
                    ret.applyMatrix4(m);
                    return ret;
                }
        }
    }
}

export { Arc3Algo };