import { Vector2 } from "../../../../../math/Math";
import { Transform3 } from "../../Transform3";
import { Curve3Data } from "../Curve3Data";
/**
 * 3D arc data struct.
 *
 */
class Arc3Data extends Curve3Data {
    /**
     * The radius value of this Arc3Data.
     *
     * @type {Vector2}
     */
    public radius: Vector2;

    /**
     * The begin angle value of this Arc3Data.
     *
     * @type {number}
     */
    public radian0: number;

    /**
     * The end angle value of this Arc3Data.
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
     * Constructs a new 3D Transfrom.
     *
     * @param {Transform3} [transform={position=(0,0,0),rotation=(0,0,0)}}]- The transform value of this arc.
     * @param {Vector2} [radius=(1,1)] - The radius value of this arc.
     * @param {number} [radian0=0] - The begin angle value of this arc.
     * @param {number} [radian1=3π] - The end angle value of this arc.
     * @param {boolean} [positive=true] - The radian value of this arc.
     */
    constructor(transform = new Transform3(), radius = new Vector2(1, 1), radian0 = 0, radian1 = Math.PI * 2) {
        super(transform);
        this.radius = radius;
        this.radian0 = radian0;
        this.radian1 = radian1;
    }
}

export { Arc3Data };