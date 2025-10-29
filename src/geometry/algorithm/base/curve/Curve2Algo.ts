import { Vector2 } from "../../../../math/Math";
import { Curve2Data } from "../../../data/base/curve/Curve2Data";
import { CurveAlgo } from "../CurveAlgo";
/**
 * 2D curvr algorithm.
 *
 */
class Curve2Algo extends CurveAlgo {

    /**
     * The data struct of this 2D curvr algorithm.
     *
     * @type {Curve2Data}
     */
    public override dat: Curve2Data;

    /**
     * Constructs a 2D curvr algorithm.
     *
     * @param {Curve2Data} [dat=Curve2Data] - The data struct of this 2D curvr algorithm.
     */
    constructor(dat = new Curve2Data()) {
        super(dat);
        this.dat = dat;
    }

    /**
     * get begin point.
     *
     * @retun {Vector2}
     */
    begin(): Vector2 {
        return this.point(0);
    }

    /**
     * get end point.
     *
     * @retun {Vector2}
     */
    end(): Vector2 {
        return this.point(1);
    }

    /**
     * get t point.
     * @param {number} [t∈[0,1]] - Get position on this 2D curvr with t parameter algorithm.
     * @retun {Vector2}
     */
    point(t: number): Vector2 {
        return this.derivative(t, 0);
    }

    /**
     * get t parameter.
     * @param {Vector2} [point] - Get t parameter on this 2D curvr with position algorithm.
     * @retun {number}
     */
    t(point: Vector2): number {
        debugger;
        return null;
    }

    /**
     * get t tangent.
     *
     * @retun {Vector2}
     */
    tangent(t: number): Vector2 {
        return this.derivative(t, 1).normalize();
    }

    /**
     * get r-order derivative at t of curve.
     *
     * @retun {Vector2}
     */
    derivative(t: number, r: number = 0): Vector2 {
        debugger;
        return null;
    }

}

export { Curve2Algo };