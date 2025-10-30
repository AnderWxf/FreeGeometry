import type { Vector3 } from "../../../../math/Math";
import { Transform3 } from "../Transform3";
import { Curve3Data } from "../Curve3Data";
/**
 * 3D nurbs data struct.
 *
 */
class Nurbs3Data extends Curve3Data {
    /**
     * The contrls points of this Nurbs3Data.
     *
     * @type {Array<Vector3>}
     */
    public controls: Array<Vector3>;

    /**
     * The knots of this Nurbs3Data.
     *
     * @type {Array<number>}
     */
    public knots: Array<number>;

    /**
     * The weights of this Nurbs3Data.
     *
     * @type {Array<number>}
     */
    public weights: Array<number>;

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
     * @param {Array<number>} [weights=null] - The weights of this nurbs.
     * @param {number} [p=3] - The degree of this nurbs.
     */
    constructor(trans = new Transform3(), controls = new Array<Vector3>(), knots = new Array<number>(), weights = new Array<number>(), p = 3) {
        super(trans);
        this.controls = controls;
        this.knots = knots;
        this.weights = weights;
        this.p = p;
    }
}

export { Nurbs3Data };