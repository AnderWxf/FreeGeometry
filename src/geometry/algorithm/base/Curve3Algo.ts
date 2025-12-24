import { Matrix3, Vector2, Vector3 } from "../../../math/Math";
import { Curve3Data } from "../../data/base/Curve3Data";

/**
 * 3D curvr algorithm.
 * u parameter is general parameters.
 * u ∈ [0,a], the a is diffent for curve type : 
 * in case line, a = distance to o.
 * in case arc, a = 2π-1/Infinity.
 * in case hyperbola, u = x ∈ R.
 * in case parabola, u = x ∈ R.
 * in case nurbs, a = 1 , when u < 0 or u > 1 curve extend with 1-order derivative vector.
 * in case uvcurve, a = uvcurve.curve.a.
 * 
 */
class Curve3Algo {

    /**
     * The data struct of this 3D curvr algorithm.
     *
     * @type {Curve3Data}
     */
    public dat: Curve3Data;

    /**
     * Constructs a 3D curvr algorithm.
     *
     * @param {Curve3Data} [dat = Curve3Data] - The data struct of this 3D curvr algorithm.
     */
    constructor(dat: Curve3Data) {
        this.dat = dat;
    }

    /**
     * the P function return a point at u parameter.
     * @param {number} [u ∈ [0,a]] - the u parameter of curve.
     * @retun {Vector3}
     */
    p(u: number): Vector3 {
        return this.d(u, 0);
    }

    /**
     * the U function return u parameter at a point on curve.
     * @param {Vector3} [point] - the point on curve.
     * @retun {number}
     */
    u(point: Vector3): number {
        debugger;
        return null;
    }

    /**
     * the D function return r-order derivative vector at u parameter.
     * @param {number} [u ∈ [0,a]] - the u parameter of curve.
     * @param {number} [r ∈ [0,1,3...]] - r-order.
     * @retun {Vector3}
     */
    d(u: number, r: number = 0): Vector3 {
        debugger;
        return null;
    }

    /**
     * the g function return the value of the general equation for the curve.
     * if point on curve then the return value is zero vector.
     * f1(x,y,z) = 0
     * f2(x,y,z) = 0
     * the return vector.x is the value fo f1 equation for the curve.
     * the return vector.y is the value fo f2 equation for the curve.
     * 
     * @param {Vector3} [point] - the point baout curve. 
     * @retun {Vector2}
     */
    g(point: Vector3): Vector2 {
        debugger;
        return null;
    }

    /**
     * the T function return 1-order derivative vector at u parameter.
     *
     * @param {number} [u ∈ [0,a]] - the u parameter of curve.
     * @retun {Vector3}
     */
    t(u: number): Vector3 {
        return this.d(u, 1);
    }

    /**
     * the N(normal) function return 2-order derivative vector at u parameter.
     *
     * @param {number} [u ∈ [0,a]] - the u parameter of curve.
     * @retun {Vector2}
     */
    n(u: number): Vector3 {
        return this.d(u, 2);
    }

    /**
     * the BN(bin normal) function return bin vector at u parameter.
     *
     * @param {number} [u ∈ [0,a]] - the u parameter of curve.
     * @retun {Vector2}
     */
    bn(u: number): Vector3 {
        let t = this.t(u);
        let n = this.n(u);
        return t.cross(n);
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
     * the TBN(tbn rotation matrix) function return tbn matrix at u parameter.
     *
     * @param {number} [u ∈ [0,a]] - the u parameter of curve.
     * @retun {Matrix3}
     */
    tbn(u: number): Matrix3 {
        let t = this.t(u).normalize();
        let n = this.n(u).normalize();
        let b = t.clone().cross(n).normalize();
        n = b.clone().cross(t).normalize();
        let m = new Matrix3();
        m.extractBasis(t, n, b);
        return m;
    }
}

export { Curve3Algo };