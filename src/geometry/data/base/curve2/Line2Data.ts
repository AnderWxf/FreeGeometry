import { Transform2 } from "../Transform2";
import { Curve2Data } from "../Curve2Data";
/**
 * 2D line data struct.
 *
 */
class Line2Data extends Curve2Data {
    /**
     * Constructs a new 2D Transfrom.
     *
     * @param {Transform2} [trans={position=(0,0),rotation=0}]- The transfrom value of this line curve.
     */
    constructor(trans = new Transform2()) {
        super(trans);
    }
}

export { Line2Data };