import type { Vector2, Vector3 } from "../../../../math/Math";
import { Transform2 } from "../Transform2";
import { Curve2Data } from "../Curve2Data";
/**
 * 2D nurbs data struct.
 *
 */
class Nurbs2Data extends Curve2Data {
    /**
     * The contrls points of this Nurbs2Data.
     * use Vector3 to include weight info (z is weight)
     * @type {Array<Vector3>}
     */
    public controls: Array<Vector3>;

    /**
     * The knots of this Nurbs2Data.
     *
     * @type {Array<number>}
     */
    public knots: Array<number>;


    /**
     * The degree of this Nurbs2Data.
     *
     * @type {number}
     */
    public degree: number;

    /**
     * Constructs a new 2D Transfrom.
     *
     * @param {Transform2} [trans={position=(0,0),rotation=0}]- The transfrom value of this nurbs.
     * @param {Array<Vector3>} [controls=null] - The controls points of this nurbs.
     * @param {Array<number>} [knots=null] - The knots of this nurbs.
     * @param {number} [degree=3] - The degree of this nurbs.
     */
    constructor(trans = new Transform2(), controls = new Array<Vector3>(), knots = new Array<number>(), degree = 3) {
        super(trans);
        this.controls = controls;
        this.knots = knots;
        this.degree = degree;
    }
}

export { Nurbs2Data };