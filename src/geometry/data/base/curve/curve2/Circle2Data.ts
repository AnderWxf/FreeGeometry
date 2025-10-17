import { Transform2 } from "../../Transform2";
import { Curve2Data } from "../Curve2Data";
/**
 * 2D circle data struct.
 *
 */
class Circle2Data extends Curve2Data {
    /**
     * The radius value of this Circle2Data.
     *
     * @type {number}
     */
    public radius: number;

    /**
     * Constructs a new 2D Transfrom.
     *
     * @param {Transform2} [transform={position=(0,0),rotation=0}]- The transform value of this circle curve.
     * @param {number} [radius=1] - The radius value of this circle curve.
     */
    constructor(transform = new Transform2(), radius = 1) {
        super(transform);
        this.radius = radius;
    }
}

export { Circle2Data };