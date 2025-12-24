import { Vector3 } from "../../../../math/Math";
import { Parabola3Data } from "../../../data/base/curve3/Parabola3Data";
import { Curve3Algo } from "../Curve3Algo";
/**
 * 3D Parabola algorithm. TODO
 * 
 */
class Parabola3Algo extends Curve3Algo {
    /**
     * The data struct of this 3D Parabola algorithm.
     *
     * @type {Parabola3Data}
     */
    public override dat: Parabola3Data;

    /**
     * Constructs a 3D Parabola algorithm.
     *
     * @param {Curve3Data} [dat=Parabola3Data] - The data struct of this 3D Parabola algorithm.
     */
    constructor(dat = new Parabola3Data()) {
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
        debugger;
        return null;
    }
}

export { Parabola3Algo };