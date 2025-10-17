import { Transform3 } from "../../Transform3";
import { Curve3Data } from "../Curve3Data";
/**
 * 3D circle data struct.
 *
 */
class Circle3Data extends Curve3Data {
    /**
     * The radius value of this Circle3Data.
     *
     * @type {number}
     */
    public radius: number;

    /**
     * Constructs a new 3D Transfrom.
     *
     * @param {Transform3} [transform={position=(0,0,0),rotation=(0,0,0)}]- The transform value of this circle curve.
     * @param {number} [radius=1] - The length value of this circle curve.
     */
    constructor(transform = new Transform3(), radius = 1) {
        super(transform);
        this.radius = radius;
    }
}

export { Circle3Data };