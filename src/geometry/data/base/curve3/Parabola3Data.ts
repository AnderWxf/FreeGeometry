import { Vector3 } from "../../../../math/Math";
import { Transform3 } from "../Transform3";
import { Curve3Data } from "../Curve3Data";
/**
 * 3D Parabola curve data struct. TODO
 * 
 */
class Parabola3Data extends Curve3Data {
    /**
     * The A B C value of this Parabola curve.
     *
     * @type {Vector3}
     */
    public abc: Vector3;

    /**
     * The D E F value of this Parabola curve.
     *
     * @type {Vector3}
     */
    public def: Vector3;
    /**
     * Constructs a new 3D Transfrom.
     *
     * @param {Transform3} [trans={position=(0,0),rotation=0}]- The transfrom value of this Parabola curve.
     * @param {Vector3} [abc=(1,1,1)] - The A B C value of this Parabola curve.
     * @param {Vector3} [def=(1,1,1)] - The D E F value of this Parabola curve.
     */
    constructor(trans = new Transform3(), abc = new Vector3(1, 1, 1), def = new Vector3(1, 1, 1)) {
        super(trans);
        this.abc = abc;
        this.def = def;
    }
}

export { Parabola3Data };