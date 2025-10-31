import { Vector3 } from "../../../../math/Math";
import { Transform2 } from "../Transform2";
import { Curve2Data } from "../Curve2Data";
/**
 * 2D conic curve data struct.
 * the conic curve general equation:
 * A*sqrt(x) + 2B*x*y + C*sqrt(y) + D*x + E*y + F = 0
 * let u = x ∈ R , if there are y1 and y2, then y = max(y1,y2).
 * 
 */
class Conic2Data extends Curve2Data {
    /**
     * The A B C value of this conic curve.
     *
     * @type {Vector3}
     */
    public abc: Vector3;

    /**
     * The D E F value of this conic curve.
     *
     * @type {Vector3}
     */
    public def: Vector3;
    /**
     * Constructs a new 2D Transfrom.
     *
     * @param {Transform2} [trans={position=(0,0),rotation=0}]- The transfrom value of this conic curve.
     * @param {Vector3} [abc=(1,1,1)] - The A B C value of this conic curve.
     * @param {Vector3} [def=(1,1,1)] - The D E F value of this conic curve.
     */
    constructor(trans = new Transform2(), abc = new Vector3(1, 1, 1), def = new Vector3(1, 1, 1)) {
        super(trans);
        this.abc = abc;
        this.def = def;
    }
}

export { Conic2Data };