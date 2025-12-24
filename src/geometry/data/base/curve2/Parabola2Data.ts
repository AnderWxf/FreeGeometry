import { Vector3 } from "../../../../math/Math";
import { Transform2 } from "../Transform2";
import { Curve2Data } from "../Curve2Data";
/**
 * 2D Parabola curve data struct. TODO
 * 
 */
class Parabola2Data extends Curve2Data {
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
     * Constructs a new 2D Transfrom.
     *
     * @param {Transform2} [trans={position=(0,0),rotation=0}]- The transfrom value of this Parabola curve.
     * @param {Vector3} [abc=(1,1,1)] - The A B C value of this Parabola curve.
     * @param {Vector3} [def=(1,1,1)] - The D E F value of this Parabola curve.
     */
    constructor(trans = new Transform2(), abc = new Vector3(1, 1, 1), def = new Vector3(1, 1, 1)) {
        super(trans);
        this.abc = abc;
        this.def = def;
    }
}

export { Parabola2Data };