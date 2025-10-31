import { Vector2 } from "../../../../math/Math";
import { Transform2 } from "../Transform2";
import { Curve2Data } from "../Curve2Data";
/**
 * 2D arc data struct.
 *
 */
class Arc2Data extends Curve2Data {
    /**
     * The radius value of this Arc2Data.
     *
     * @type {Vector2}
     */
    public radius: Vector2;

    /**
     * Constructs a new 2D Transfrom.
     *
     * @param {Transform2} [trans={position=(0,0),rotation=0}]- The transfrom value of this arc.
     * @param {Vector2} [radius=(1,1)] - The radius value of this arc.
     */
    constructor(trans = new Transform2(), radius = new Vector2(1, 1)) {
        super(trans);
        this.radius = radius;
    }
}

export { Arc2Data };