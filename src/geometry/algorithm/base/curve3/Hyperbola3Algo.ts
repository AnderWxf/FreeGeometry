import { Vector3 } from "../../../../math/Math";
import { Hyperbola3Data } from "../../../data/base/curve3/Hyperbola3Data";
import { Curve3Algo } from "../Curve3Algo";
/**
 * 3D Hyperbola algorithm. TODO
 *
 */
class Hyperbola3Algo extends Curve3Algo {
    /**
     * The data struct of this 3D Hyperbola algorithm.
     *
     * @type {Hyperbola3Data}
     */
    protected dat_: Hyperbola3Data;
    public get dat(): Hyperbola3Data {
        return this.dat_;
    }
    public set dat(dat: Hyperbola3Data) {
        this.dat_ = dat;
    }

    /**
     * Constructs a 3D Hyperbola algorithm.
     *
     * @param {Curve3Data} [dat=Hyperbola3Data] - The data struct of this 3D Hyperbola algorithm.
     */
    constructor(dat = new Hyperbola3Data()) {
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

export { Hyperbola3Algo };