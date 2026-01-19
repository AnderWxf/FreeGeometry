import type { Vector3, Vector4 } from "../../../../math/Math";
import { Transform3 } from "../Transform3";
import { Curve3Data } from "../Curve3Data";
/**
 * 3D nurbs data struct.
 *
 */
class Nurbs3Data extends Curve3Data {
    /**
     * The contrls points of this Nurbs3Data.
     * use Vector4 to include weight info (w is weight)
     * @type {Array<Vector4>}
     */
    public controls: Array<Vector4>;

    /**
     * The knots of this Nurbs3Data.
     *
     * @type {Array<number>}
     */
    public knots: Array<number>;

    /**
     * The degree of this Nurbs3Data.
     *
     * @type {number}
     */
    public p: number;

    /**
     * Constructs a new 3D Transfrom.
     *
     * @param {Transform3} [trans={position=(0,0,0),rotation=(0,0,0)}]- The transfrom value of this nurbs.
     * @param {Array<Vector3>} [controls=null] - The controls points of this nurbs.
     * @param {Array<number>} [knots=null] - The knots of this nurbs.
     * @param {number} [p=3] - The degree of this nurbs.
     */
    constructor(trans = new Transform3(), controls = new Array<Vector4>(), knots = new Array<number>(), p = 3) {
        super(trans);
        this.controls = controls;
        this.knots = knots;
        this.p = p;
    }
}

export { Nurbs3Data };