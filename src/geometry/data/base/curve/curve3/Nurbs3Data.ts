import type { Vector3 } from "../../../../../math/Math";
import { Transform3 } from "../../Transform3";
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
    public degree: number;

    /**
     * Constructs a new 3D Transfrom.
     *
     * @param {Transform3} [transform={position=(0,0,0),rotation=(0,0,0)}]- The transform value of this nurbs.
     * @param {Array<Vector3>} [controls=null] - The controls points of this nurbs.
     * @param {Array<number>} [knots=null] - The knots of this nurbs.
     * @param {Array<number>} [weights=null] - The weights of this nurbs.
     * @param {degree} [degree=3] - The degree of this nurbs.
     */
    constructor(transform = new Transform3(), controls = new Array<Vector3>(), knots = new Array<number>(), weights = new Array<number>(), degree = 3) {
        super(transform);
        this.controls = controls;
        this.knots = knots;
        this.weights = weights;
        this.degree = degree;
    }
}

export { Nurbs3Data };