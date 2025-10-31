import { Vector3 } from "../../../../math/Math";
import { UvCurveData } from "../../../data/base/curve3/UvCurveData";
import { Curve3Algo } from "../Curve3Algo";
/**
 * uv curve algorithm.
 *
 */
class UvCurveAlgo extends Curve3Algo {
    /**
     * The data struct of this 3D ellipse arc algorithm.
     *
     * @type {UvCurveData}
     */
    public override dat: UvCurveData;

    /**
     * Constructs a 3D ellipse arc algorithm.
     *
     * @param {Curve3Data} [dat=UvCurveData] - The data struct of this 3D ellipse arc algorithm.
     */
    constructor(dat: UvCurveData) {
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

export { UvCurveAlgo };