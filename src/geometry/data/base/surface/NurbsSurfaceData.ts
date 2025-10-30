import { Vector3 } from "../../../../math/Math";
import { Transform3 } from "../Transform3";
import { SurfaceData } from "../SurfaceData";
/**
 * 3D nurbs surface data struct.
 *
 */
class NurbsSurfaceData extends SurfaceData {
    /**
     * The contrls points ( m x n )of this nurbs surface.
     *
     * @type {Array<Array<Vector3>>}
     */
    public controls: Array<Vector3>;

    /**
     * The u knots ( m ) of this nurbs surface.
     *
     * @type {Array<number>}
     */
    public uknots: Array<number>;

    /**
     * The v knots ( n ) of this nurbs surface.
     *
     * @type {Array<number>}
     */
    public vknots: Array<number>;

    /**
     * The weights ( m x n ) of this nurbs surface.
     *
     * @type {Array<Array<number>>}
     */
    public weights: Array<Array<number>>;

    /**
     * The u degree of this nurbs surface.
     *
     * @type {number}
     */
    public p: number;

    /**
     * The v degree of this nurbs surface.
     *
     * @type {number}
     */
    public q: number;

    /**
     * Constructs a new 3D nurbs surface.
     *
     * @param {Transform3} [trans={position=(0,0,0),rotation=(0,0,0)}]- The transfrom value of this nurbs surface.
     * @param {Array<Array<Vector3>>} [controls=null] - The controls points of this nurbs surface.
     * @param {Array<number>} [uknots=null] - The u knots of this nurbs surface.
     * @param {Array<number>} [vknots=null] - The v knots of this nurbs surface.
     * @param {Array<Array<number>>} [weights=null] - The weights of this nurbs surface.
     * @param {number} [p=3] - The u degree of this nurbs surface.
     * @param {number} [q=3] - The v degree of this nurbs surface.
     */
    constructor(trans = new Transform3(), controls = new Array<Vector3>(), uknots = new Array<number>(), vknots = new Array<number>(), weights = new Array<Array<number>>(), p = 3, q = 3) {
        super(trans);
        this.controls = controls;
        this.uknots = uknots;
        this.vknots = vknots;
        this.weights = weights;
        this.p = p;
        this.q = q;
    }
}

export { NurbsSurfaceData };