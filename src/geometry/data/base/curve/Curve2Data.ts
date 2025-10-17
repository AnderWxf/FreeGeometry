import { CurveData } from "../CurveData";
import { Transform2 } from "../Transform2";
/**
 * 2D curvr data struct.
 *
 */
class Curve2Data extends CurveData {
    /**
     * The transform value of this Curve2Data.
     *
     * @type {Transform2}
     */
    public transform: Transform2;

    /**
     * Constructs a new 3D Transfrom.
     *
     * @param {Vector3} [position=(0,0,0)] - The position value of this Transfrom.
     * @param {rotation} [rotation=(0,0,0)] - The rotation value of this Transfrom.
     * @param {number} [scale=1] - The rotation value of this Transfrom.
     */
    constructor(transform = new Transform2()) {
        super();
        this.transform = transform;
    }
}

export { Curve2Data };