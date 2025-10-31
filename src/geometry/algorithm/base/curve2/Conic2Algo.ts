import { Vector2 } from "../../../../math/Math";
import { Conic2Data } from "../../../data/base/curve2/Conic2Data";
import { Curve2Algo } from "../Curve2Algo";
/**
 * 2D conic algorithm.
 * the conic curve general equation:
 * A*sqrt(x) + 2B*x*y + C*sqrt(y) + D*x + E*y + F = 0
 * let u = x ∈ R , if there are y1 and y2, then y = max(y1,y2).
 * 
 */
class Conic2Algo extends Curve2Algo {
    /**
     * The data struct of this 2D conic algorithm.
     *
     * @type {Conic2Data}
     */
    public override dat: Conic2Data;

    /**
     * Constructs a 2D conic algorithm.
     *
     * @param {Curve2Data} [dat=Conic2Data] - The data struct of this 2D conic algorithm.
     */
    constructor(dat = new Conic2Data()) {
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

export { Conic2Algo };