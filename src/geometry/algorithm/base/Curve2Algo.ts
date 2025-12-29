import { Matrix2, Vector2 } from "../../../math/Math";
import * as MATHJS from '../../../mathjs';
import { Curve2Data } from "../../data/base/Curve2Data";

/**
 * 2D curvr algorithm.
 * u parameter is general parameters.
 * u ∈ [0,a], the a is diffent for curve type : 
 * in case line, a = distance to o.
 * in case arc, a = 2π-1/Infinity.
 * in case hyperbola, u = x ∈ R.
 * in case parabola, u = x ∈ R.
 * in case nurbs, a = 1, when u < 0 or u > 1 curve extend with 1-order derivative vector.
 * 
 * 2D curvr separates plane to parts;
 * 
 */
class Curve2Algo {

    /**
     * The data struct of this 2D curvr algorithm.
     *
     * @type {Curve2Data}
     */
    public dat: Curve2Data;

    /**
     * Constructs a 2D curvr algorithm.
     *
     * @param {Curve2Data} [dat = Curve2Data] - The data struct of this 2D curvr algorithm.
     */
    constructor(dat: Curve2Data) {
        this.dat = dat;
    }

    /**
     * the P(poinit) function return a position at u parameter.
     * @param {number} [u ∈ [0,a]] - the u parameter of curve.
     * @retun {Vector2}
     */
    p(u: number): Vector2 {
        return this.d(u, 0);
    }

    /**
     * the U function return u parameter at a position .
     * @param {Vector2} [point] - the point on curve.
     * @retun {number}
     */
    u(point: Vector2): number {
        debugger;
        return null;
    }

    /**
     * the D(derivative) function return r-order derivative vector at u parameter.
     * @param {number} [u ∈ [0,a]] - the u parameter of curve.
     * @param {number} [r ∈ [0,1,2...]] - r-order.
     * @retun {Vector2}
     */
    d(u: number, r: number = 0): Vector2 {
        debugger;
        return null;
    }

    /**
     * the G(general) function return the value of the general equation for the curve.
     * if point on curve then the return value is zero.
     * f(x,y) = 0
     * 
     * @param {Vector2} [point] - the point baout curve. 
     * @retun {number}
     */
    g(point: Vector2): number {
        debugger;
        return null;
    }

    /**
     * the t(tangent) function return 1-order derivative normalize vector at u parameter.
     *
     * @param {number} [u ∈ [0,a]] - the u parameter of curve.
     * @retun {Vector2}
     */
    t(u: number): Vector2 {
        return this.d(u, 1).normalize();
    }


    /**
     * the N(normal) function return 2-order derivative vector at u parameter.
     *
     * @param {number} [u ∈ [0,a]] - the u parameter of curve.
     * @retun {Vector2}
     */
    n(u: number): Vector2 {
        return this.d(u, 2);
    }

    /**
     * the K function return curvature at u parameter.
     *
     * @param {number} [u ∈ [0,a]] - the u parameter of curve.
     * @retun {number}
     */
    k(u: number): number {
        let t = this.t(u);
        let n = this.n(u);
        let k = t.length() / n.lengthSq();
        return k;
    }

    /**
     * the R function return radius of curvature at u parameter.
     *
     * @param {number} [u ∈ [0,a]] - the u parameter of curve.
     * @retun {number}
     */
    r(u: number): number {
        let k = this.k(u);
        if (k == 0) {
            return Infinity;
        }
        return 1.0 / k;
    }

    /**
     * the TN(tn rotation matrix) function return tbn matrix at u parameter.
     *
     * @param {number} [u ∈ [0,a]] - the u parameter of curve.
     * @retun {Matrix2}
     */
    tn(u: number): Matrix2 {
        let t = this.t(u).normalize();
        let n = this.n(u).normalize();
        let m = new Matrix2();
        m.extractBasis(t, n);
        return m;
    }
}

export { Curve2Algo };