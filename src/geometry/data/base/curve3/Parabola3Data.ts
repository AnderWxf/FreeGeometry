import { Vector3 } from "../../../../math/Math";
import { Transform3 } from "../Transform3";
import { Curve3Data } from "../Curve3Data";
/**
 * 3D Parabola curve data struct. TODO
 * 
 */
class Parabola3Data extends Curve3Data {
    /**
     * The focus distance of this Parabola curve.
     *
     * @type {number}
     */
    public f: number;

    /**
     * Constructs a new 3D Transfrom.
     *
     * @param {Transform3} [trans={position=(0,0),rotation=0}]- The transfrom value of this Parabola curve.
     * @param {number} [f=(1)] - The focus distance of this Parabola curve.
     */
    constructor(trans = new Transform3(), f: number = 1) {
        super(trans);
        this.f = f;
    }
}

export { Parabola3Data };