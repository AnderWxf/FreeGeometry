import { CurveData } from "../CurveData";
import { Transform3 } from "../Transform3";
/**
 * 3D curvr data struct.
 *
 */
class Curve3Data extends CurveData {
    /**
     * The transform value of this Curve3Data.
     *
     * @type {Transform3}
     */
    public transform: Transform3;

    /**
     * Constructs a new 3D Transfrom.
     *
     * @param {Vector3} [position=(0,0,0)] - The position value of this Transfrom.
     * @param {rotation} [rotation=(0,0,0)] - The rotation value of this Transfrom.
     * @param {number} [scale=1] - The rotation value of this Transfrom.
     */
    constructor(transform = new Transform3()) {
        super();
        this.transform = transform;
    }
}

export { Curve3Data };