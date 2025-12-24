import { Vector2 } from "../../../../math/Math";
import { Parabola2Data } from "../../../data/base/curve2/Parabola2Data";
import { Curve2Algo } from "../Curve2Algo";
/**
 * 2D Parabola algorithm. TODO
 * 
 */
class Parabola2Algo extends Curve2Algo {
    /**
     * The data struct of this 2D Parabola algorithm.
     *
     * @type {Parabola2Data}
     */
    public override dat: Parabola2Data;

    /**
     * Constructs a 2D Parabola algorithm.
     *
     * @param {Curve2Data} [dat=Parabola2Data] - The data struct of this 2D Parabola algorithm.
     */
    constructor(dat = new Parabola2Data()) {
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

export { Parabola2Algo };