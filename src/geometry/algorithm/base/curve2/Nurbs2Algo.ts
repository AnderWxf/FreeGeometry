import { Vector2 } from "../../../../math/Math";
import { Nurbs2Data } from "../../../data/base/curve2/Nurbs2Data";
import { Curve2Algo } from "../Curve2Algo";
/**
 * nurbs algorithm.
 *
 */
class Nurbs2Algo extends Curve2Algo {
    /**
     * The data struct of this nurbs algorithm.
     *
     * @type {Nurbs2Data}
     */
    public override dat: Nurbs2Data;

    /**
     * Constructs a nurbs algorithm.
     *
     * @param {Curve2Data} [dat=Nurbs2Data] - The data struct of this nurbs algorithm.
     */
    constructor(dat: Nurbs2Data) {
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
        debugger;
        return null;
    }
}

export { Nurbs2Algo };