import type { Vector2 } from "../../../../../math/Math";
import { Transform2 } from "../../Transform2";
import { Curve2Data } from "../Curve2Data";
/**
 * 2D nurbs data struct.
 *
 */
class Nurbs2Data extends Curve2Data {
    /**
     * The contrls points of this Nurbs2Data.
     *
     * @type {Array<Vector2>}
     */
    public controls: Array<Vector2>;

    /**
     * The knots of this Nurbs2Data.
     *
     * @type {Array<number>}
     */
    public knots: Array<number>;

    /**
     * The weights of this Nurbs2Data.
     *
     * @type {Array<number>}
     */
    public weights: Array<number>;

    /**
     * The degree of this Nurbs2Data.
     *
     * @type {number}
     */
    public degree: number;

    /**
     * Constructs a new 2D Transfrom.
     *
     * @param {Transform2} [transform={position=(0,0),rotation=0}]- The transform value of this nurbs.
     * @param {Array<Vector2>} [controls=null] - The controls points of this nurbs.
     * @param {Array<number>} [knots=null] - The knots of this nurbs.
     * @param {Array<number>} [weights=null] - The weights of this nurbs.
     * @param {degree} [degree=3] - The degree of this nurbs.
     */
    constructor(transform = new Transform2(), controls = new Array<Vector2>(), knots = new Array<number>(), weights = new Array<number>(), degree = 3) {
        super(transform);
        this.controls = controls;
        this.knots = knots;
        this.weights = weights;
        this.degree = degree;
    }
}

export { Nurbs2Data };