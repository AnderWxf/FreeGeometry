import { Transform3 } from "../Transform3";
import { Curve3Data } from "../Curve3Data";
/**
 * 3D line data struct.
 *
 */
class Line3Data extends Curve3Data {

    /**
     * Constructs a new 3D Transfrom.
     *
     * @param {Transform3} [trans={position=(0,0,0),rotation=(0,0,0)}]- The transfrom value of this line curve.
     */
    constructor(trans = new Transform3()) {
        super(trans);
    }

    /**
     * Returns a new Line3Data with copied values from this instance.
     *
     * @return {Line3Data} A clone of this instance.
     */
    override clone() {
        return new Line3Data(this.trans.clone());
    }
}

export { Line3Data };