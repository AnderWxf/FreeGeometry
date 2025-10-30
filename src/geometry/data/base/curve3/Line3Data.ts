import { Transform3 } from "../Transform3";
import { Curve3Data } from "../Curve3Data";
/**
 * 3D line data struct.
 *
 */
class Line3Data extends Curve3Data {
    /**
     * The length value of this Line3Data.
     *
     * @type {number}
     */
    public length: number;

    /**
     * Constructs a new 3D Transfrom.
     *
     * @param {Transform3} [trans={position=(0,0,0),rotation=(0,0,0)}]- The transfrom value of this line curve.
     * @param {number} [length=1] - The length value of this line curve.
     */
    constructor(trans = new Transform3(), length = 1) {
        super(trans);
        this.length = length;
    }
}

export { Line3Data };