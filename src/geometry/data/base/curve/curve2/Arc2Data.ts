import { Transform2 } from "../../Transform2";
import { Curve2Data } from "../Curve2Data";
/**
 * 2D arc data struct.
 *
 */
class Arc2Data extends Curve2Data {
    /**
     * The radius0 value of this Arc2Data.
     *
     * @type {number}
     */
    public radius0: number;

    /**
     * The radius1 value of this Arc2Data.
     *
     * @type {number}
     */
    public radius1: number;

    /**
     * The begin angle value of this Arc2Data.
     *
     * @type {number}
     */
    public radian0: number;

    /**
     * The end angle value of this Arc2Data.
     *
     * @type {number}
     */
    public radian1: number;

    /**
     * The positive value of this Arc2Data.
     *
     * @type {boolean}
     */
    public positive: boolean;

    /**
     * Constructs a new 2D Transfrom.
     *
     * @param {Transform2} [transform={position=(0,0),rotation=0}]- The transform value of this arc.
     * @param {number} [radius0=1] - The radius0 value of this arc.
     * @param {number} [radius1=1] - The radius1 value of this arc.
     * @param {number} [radian0=0] - The begin angle value of this arc.
     * @param {number} [radian1=2π] - The end angle value of this arc.
     * @param {boolean} [positive=true] - The radian value of this arc.
     */
    constructor(transform = new Transform2(), radius0 = 1, radius1 = 1, radian0 = 0, radian1 = Math.PI * 2, positive = true) {
        super(transform);
        this.radius0 = radius0;
        this.radius1 = radius1;
        this.radian0 = radian0;
        this.radian1 = radian1;
        this.positive = positive;
    }
}

export { Arc2Data };