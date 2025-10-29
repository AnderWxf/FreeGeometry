import { Vector2 } from "../../../../../math/Math";
import { Transform2 } from "../../Transform2";
import { Curve2Data } from "../Curve2Data";
/**
 * 2D arc data struct.
 *
 */
class Arc2Data extends Curve2Data {
    /**
     * The radius value of this EllipseArc2Data.
     *
     * @type {Vector2}
     */
    public radius: Vector2;

    /**
     * The begin angle value of this EllipseArc2Data.
     *
     * @type {number}
     */
    public radian0: number;

    /**
     * The end angle value of this EllipseArc2Data.
     *
     * @type {number}
     */
    public radian1: number;

    /**
     * The positive value of this Arc3Data.
     *
     * @return {boolean}
     */
    get positive(): boolean {
        return this.radian1 > this.radian0;
    };

    /**
     * Constructs a new 2D Transfrom.
     *
     * @param {Transform2} [transform={position=(0,0),rotation=0}]- The transform value of this arc.
     * @param {Vector2} [radius=(1,1)] - The radius value of this arc.
     * @param {number} [radian1=2π] - The end angle value of this arc.
     */
    constructor(transform = new Transform2(), radius = new Vector2(1, 1), radian0 = 0, radian1 = Math.PI * 2) {
        super(transform);
        this.radius = radius;
        this.radian0 = radian0;
        this.radian1 = radian1;
    }
}

export { Arc2Data };