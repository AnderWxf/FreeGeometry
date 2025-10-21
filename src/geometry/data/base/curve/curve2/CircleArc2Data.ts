import { Transform2 } from "../../Transform2";
import { Curve2Data } from "../Curve2Data";
/**
 * 2D circle arc data struct.
 *
 */
class CircleArc2Data extends Curve2Data {
    /**
     * The radius value of this CircleArc2Data.
     *
     * @type {number}
     */
    public radius: number;
    /**
     * The begin angle value of this CircleArc2Data.
     *
     * @type {number}
     */
    public radian0: number;

    /**
     * The end angle value of this CircleArc2Data.
     *
     * @type {number}
     */
    public radian1: number;

    /**
     * Constructs a new 2D Transfrom.
     *
     * @param {Transform2} [transform={position=(0,0),rotation=0}]- The transform value of this arc.
     * @param {number} [radius=1] - The radius value of this arc.
     * @param {number} [radian0=0] - The begin angle value of this arc.
     * @param {number} [radian1=2π] - The end angle value of this arc.
     */
    constructor(transform = new Transform2(), radius = 1, radian0 = 0, radian1 = Math.PI * 2) {
        super(transform);
        this.radius = radius;
        this.radian0 = radian0;
        this.radian1 = radian1;
    }
}

export { CircleArc2Data };