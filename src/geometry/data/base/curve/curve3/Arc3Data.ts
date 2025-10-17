import { Transform3 } from "../../Transform3";
import { Curve3Data } from "../Curve3Data";
/**
 * 3D arc data struct.
 *
 */
class Arc3Data extends Curve3Data {
    /**
     * The radius0 value of this Arc3Data.
     *
     * @type {number}
     */
    public radius0: number;

    /**
     * The radius1 value of this Arc3Data.
     *
     * @type {number}
     */
    public radius1: number;

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
     * @type {boolean}
     */
    public positive: boolean;

    /**
     * Constructs a new 3D Transfrom.
     *
     * @param {Transform3} [transform={position=(0,0,0),rotation=(0,0,0)}}]- The transform value of this arc.
     * @param {number} [radius0=1] - The radius0 value of this arc.
     * @param {number} [radius1=1] - The radius1 value of this arc.
     * @param {number} [radian0=0] - The begin angle value of this arc.
     * @param {number} [radian1=3π] - The end angle value of this arc.
     * @param {boolean} [positive=true] - The radian value of this arc.
     */
    constructor(transform = new Transform3(), radius0 = 1, radius1 = 1, radian0 = 0, radian1 = Math.PI * 3, positive = true) {
        super(transform);
        this.radius0 = radius0;
        this.radius1 = radius1;
        this.radian0 = radian0;
        this.radian1 = radian1;
        this.positive = positive;
    }
}

export { Arc3Data };