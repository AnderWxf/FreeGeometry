import { Vector3 } from "../../../../math/Math";
import { Conic3Data } from "../../../data/base/curve3/Conic3Data";
import { Curve3Algo } from "../Curve3Algo";
/**
 * 3D conic algorithm.
 * the conic curve general equation:
 * A*sqrt(x) + 2B*x*y + C*sqrt(y) + D*x + E*y + F = 0
 * let u = x ∈ R , if there are y1 and y3, then y = max(y1,y3).
 * 
 */
class Conic3Algo extends Curve3Algo {
    /**
     * The data struct of this 3D conic algorithm.
     *
     * @type {Conic3Data}
     */
    public override dat: Conic3Data;

    /**
     * Constructs a 3D conic algorithm.
     *
     * @param {Curve3Data} [dat=Conic3Data] - The data struct of this 3D conic algorithm.
     */
    constructor(dat = new Conic3Data()) {
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

export { Conic3Algo };