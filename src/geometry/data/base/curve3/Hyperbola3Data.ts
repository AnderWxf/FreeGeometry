import { Vector2 } from "../../../../math/Math";
import { Transform3 } from "../Transform3";
import { Curve3Data } from "../Curve3Data";
/**
 * 3D Hyperbola data struct. 
 *
 */
class Hyperbola3Data extends Curve3Data {
    /**
     * The radius value of this Hyperbola3Data.
     *
     * @type {Vector2}
     */
    public radius: Vector2;

    /**
     * Constructs a new 3D Transfrom.
     *
     * @param {Transform3} [trans={position=(0,0,0),rotation=(0,0,0)}}]- The transfrom value of this Hyperbola.
     * @param {Vector2} [radius=(1,1)] - The radius value of this Hyperbola.
     */
    constructor(trans = new Transform3(), radius = new Vector2(1, 1)) {
        super(trans);
        this.radius = radius;
    }
}

export { Hyperbola3Data };