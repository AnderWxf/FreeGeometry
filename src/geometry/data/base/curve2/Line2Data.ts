import { Transform2 } from "../Transform2";
import { Curve2Data } from "../Curve2Data";
/**
 * 2D line data struct.
 *
 */
class Line2Data extends Curve2Data {
    /**
     * The length value of this Line2Data.
     *
     * @type {number}
     */
    public length: number;

    /**
     * Constructs a new 2D Transfrom.
     *
     * @param {Transform2} [trans={position=(0,0),rotation=0}]- The transfrom value of this line curve.
     * @param {number} [length=1] - The length value of this line curve.
     */
    constructor(trans = new Transform2(), length = 1) {
        super(trans);
        this.length = length;
    }
}

export { Line2Data };