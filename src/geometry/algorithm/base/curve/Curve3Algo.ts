import { Vector3 } from "../../../../math/Math";
import { Curve3Data } from "../../../data/base/curve/Curve3Data";
import { CurveAlgo } from "../CurveAlgo";
/**
 * 3D curvr algorithm.
 *
 */
class Curve3Algo extends CurveAlgo {

    /**
     * The data struct of this 3D curvr algorithm.
     *
     * @type {Curve3Data}
     */
    public override dat: Curve3Data;

    /**
     * Constructs a 3D curvr algorithm.
     *
     * @param {Curve3Data} [dat=Curve3Data] - The data struct of this 3D curvr algorithm.
     */
    constructor(dat = new Curve3Data()) {
        super(dat);
        this.dat = dat;
    }

    /**
     * get begin point.
     *
     * @retun {Vector3}
     */
    begin(): Vector3 {
        return this.point(0);
    }

    /**
     * get end point.
     *
     * @retun {Vector3}
     */
    end(): Vector3 {
        return this.point(1);
    }

    /**
     * get t point.
     * @param {number} [t∈[0,1]] - Get position on this 3D curvr with t parameter algorithm.
     * @retun {Vector3}
     */
    point(t: number): Vector3 {
        return this.derivative(t, 0);
    }

    /**
     * get t parameter.
     * @param {Vector3} [point] - Get t parameter on this 3D curvr with position algorithm.
     * @retun {number}
     */
    t(point: Vector3): number {
        debugger;
        return null;
    }

    /**
     * get t tangent.
     *
     * @retun {Vector3}
     */
    tangent(t: number): Vector3 {
        return this.derivative(t, 1).normalize();
    }

    /**
     * get r-order derivative at t of curve.
     *
     * @retun {Vector3}
     */
    derivative(t: number, r: number = 0): Vector3 {
        debugger;
        return null;
    }

}

export { Curve3Algo };