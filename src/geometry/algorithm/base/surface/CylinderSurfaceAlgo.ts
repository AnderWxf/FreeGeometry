import { Vector2, Vector3 } from "../../../../math/Math";
import { Curve3Data } from "../../../data/base/Curve3Data";
import { CylinderSurfaceData } from "../../../data/base/surface/CylinderSurfaceData";
import { SurfaceAlgo } from "../SurfaceAlgo";

/**
 * Cylinder surface algorithm.
 * u parameter is general parameters.
 * 
 */
class CylinderSurfaceAlgo extends SurfaceAlgo {

    /**
     * The data struct of this surface algorithm.
     *
     * @type {CylinderSurfaceData}
     */
    public dat: CylinderSurfaceData;

    /**
     * Constructs a surface algorithm.
     *
     * @param {CylinderSurfaceData} [dat = CylinderSurfaceData] - The data struct of this surface algorithm.
     */
    constructor(dat: CylinderSurfaceData) {
        super(dat);
        this.dat = dat;
    }

    /**
     * the T function return uv parameter at a point on curve.
     * @param {Vector3} [point] - the point on curve.
     * @retun {Vector2}
     */
    override uv(point: Vector3): Vector2 {
        debugger;
        return null;
    }

    /**
     * the D function return r-order derivative vector at uv parameter.
     * @param {Vector2} [t ∈ [0,1]] - the uv parameter of curve.
     * @param {number} [r ∈ [0,1,3...]] - r-order.
     * @retun {Vector3}
     */
    override d(uv: Vector2, r: number = 0): Vector3 {
        debugger;
        return null;
    }

    /**
     * the g function return the value of the general equation for the curve.
     * if point on curve then the return value is zero vector.
     * f(x,y,z) = 0
     * the return vector.x is the value fo f1 equation for the curve.
     * the return vector.y is the value fo f2 equation for the curve.
     * 
     * @param {Vector3} [point] - the point baout curve. 
     * @retun {number}
     */
    override g(point: Vector3): number {
        debugger;
        return null;
    }

    /**
     * the curve at v parameter.
     *
     * @retun {Curve3Data}
     */
    override ucurve(v: number): Curve3Data {
        debugger;
        return null;
    }
    /**
     * the curve at u parameter.
     *
     * @retun {Curve3Data}
     */
    override vcurve(u: number): Curve3Data {
        debugger;
        return null;
    }

    /**
     * the K1 function return max main curvature at uv parameter.
     *
     * @param {Vector2} [uv ∈ R] - the uv parameter of surface.
     * @retun {number}
     */
    override k1(uv: Vector2): number {
        debugger;
        return null;
    }

    /**
     * the K2 function return min maincurvature at uv parameter.
     *
     * @param {Vector2} [uv ∈ R] - the uv parameter of surface.
     * @retun {number}
     */
    override k2(uv: Vector2): number {
        debugger;
        return null;
    }
}

export { CylinderSurfaceAlgo };