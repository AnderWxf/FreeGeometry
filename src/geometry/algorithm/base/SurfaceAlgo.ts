import { Matrix3, Vector2, Vector3 } from "../../../math/Math";
import { Curve3Data } from "../../data/base/Curve3Data";
import { SurfaceData } from "../../data/base/SurfaceData";
import { Curve3Algo } from "./Curve3Algo";

/**
 * surface algorithm.
 * u parameter is general parameters.
 * u ∈ [a,b], the a and b is diffent for surface type : 
 * in case plane, a = (-Infinity,-Infinity) * 0.5,b = (Infinity,Infinity) * 0.5
 * in case conical, a = (0,-Infinity), b = (2π-1/Infinity,Infinity).
 * in case cylinder, a = (0,-Infinity), b = (2π-1/Infinity,Infinity).
 * in case ellipsoid, a = (0,-π/2+1/Infinity), b = (2π,π/2-1/Infinity).
 * in case sphere, a = (0,-π/2+1/Infinity), b = (2π,π/2-1/Infinity).
 * in case nurbs, a = (0,0), b = (1,1).
 * surface separates xyz space to parts;
 * 
 */
class SurfaceAlgo {

    /**
     * The data struct of this surface algorithm.
     *
     * @type {SurfaceData}
     */
    dat: SurfaceData;

    /**
     * Constructs a surface algorithm.
     *
     * @param {SurfaceData} [dat = SurfaceData] - The data struct of this surface algorithm.
     */
    constructor(dat: SurfaceData) {
        this.dat = dat;
    }

    /**
     * the P function return a point at uv parameter.
     * @param {Vector2} [uv ∈ R] - the uv parameter of curve.
     * @retun {Vector3}
     */
    p(uv: Vector2): Vector3 {
        return this.d(uv, 0);
    }

    /**
     * the T function return uv parameter at a point on curve.
     * @param {Vector3} [point] - the point on curve.
     * @retun {Vector2}
     */
    uv(point: Vector3): Vector2 {
        debugger;
        return null;
    }

    /**
     * the D function return r-order derivative vector at uv parameter.
     * @param {Vector2} [t ∈ [0,1]] - the uv parameter of curve.
     * @param {number} [r ∈ [0,1,3...]] - r-order.
     * @retun {Vector3}
     */
    d(uv: Vector2, r: number = 0): Vector3 {
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
    g(point: Vector3): number {
        debugger;
        return null;
    }

    /**
     * the N(normal) function return unit normal vector at uv parameter.
     *
     * @param {Vector2} [uv ∈ R] - the uv parameter of surface.
     * @retun {Vector3}
     */
    n(uv: Vector2): Vector3 {
        let uc = this.ucurve(uv.v);
        let vc = this.vcurve(uv.u);
        let ut = new Curve3Algo(uc).t(uv.u);
        let vt = new Curve3Algo(vc).t(uv.v);
        let n = new Vector3();
        n.crossVectors(ut, vt);
        return n;
    }

    /**
     * the curve at v parameter.
     *
     * @retun {Curve3Data}
     */
    ucurve(v: number): Curve3Data {
        debugger;
        return null;
    }
    /**
     * the curve at u parameter.
     *
     * @retun {Curve3Data}
     */
    vcurve(u: number): Curve3Data {
        debugger;
        return null;
    }


    /**
     * the t function return 1-order direction derivative vector at uv parameter.
     *
     * @param {Vector2} [uv ∈ R] - the uv parameter of surface.
     * @param {Vector2} [dir ∈ (cos(a),sin(a)),a ∈ (0,2π)] - the uv parameter of surface.
     * @retun {Vector3}
     */
    t(uv: Vector2, dir: Vector2): Vector3 {
        return this.d(uv, 1);
    }

    /**
     * the BN(bin normal) function return bin vector at uv parameter.
     *
     * @param {Vector2} [uv ∈ R] - the uv parameter of surface.
     * @retun {Vector2}
     */
    bn(uv: Vector2): Vector3 {
        let uc = this.ucurve(uv.v);
        let vc = this.vcurve(uv.u);
        let ut = new Curve3Algo(uc).t(uv.u);
        let vt = new Curve3Algo(vc).t(uv.v);

        let n = new Vector3();
        n.crossVectors(ut, vt).normalize();
        let bn = new Vector3();
        bn.crossVectors(n, ut);
        return bn;
    }

    /**
     * the K1 function return max main curvature at uv parameter.
     *
     * @param {Vector2} [uv ∈ R] - the uv parameter of surface.
     * @retun {number}
     */
    k1(uv: Vector2): number {
        debugger;
        return null;
    }

    /**
     * the K2 function return min maincurvature at uv parameter.
     *
     * @param {Vector2} [uv ∈ R] - the uv parameter of surface.
     * @retun {number}
     */
    k2(uv: Vector2): number {
        debugger;
        return null;
    }

    /**
     * the K function return gaussian curvature at uv parameter.
     *
     * @param {Vector2} [uv ∈ R] - the uv parameter of surface.
     * @retun {number}
     */
    k(uv: Vector2): number {
        let k1 = this.k1(uv);
        let k2 = this.k2(uv);
        let k = k1 * k2;
        return k;
    }

    /**
     * the H function return mean curvature at uv parameter.
     *
     * @param {Vector2} [uv ∈ R] - the uv parameter of surface.
     * @retun {number}
     */
    h(uv: Vector2): number {
        let k1 = this.k1(uv);
        let k2 = this.k2(uv);
        let h = (k1 + k2) * 0.5;
        return h;
    }

    /**
     * the RK function return radius of gaussian curvature at uv parameter.
     *
     * @param {Vector2} [uv ∈ R] - the uv parameter of surface.
     * @retun {number}
     */
    rk(uv: Vector2): number {
        let k = this.k(uv);
        if (k == 0) {
            return Infinity;
        }
        return 1.0 / k;
    }

    /**
     * the RH function return radius of mean curvature at uv parameter.
     *
     * @param {Vector2} [uv ∈ R] - the uv parameter of surface.
     * @retun {number}
     */
    rh(uv: Vector2): number {
        let h = this.h(uv);
        if (h == 0) {
            return Infinity;
        }
        return 1.0 / h;
    }

    /**
     * the TBN(tbn rotation matrix) function return tbn matrix at uv parameter.
     *
     * @param {Vector2} [uv ∈ R] - the uv parameter of surface.
     * @retun {Matrix3}
     */
    tbn(uv: Vector2): Matrix3 {
        let uc = this.ucurve(uv.v);
        let vc = this.vcurve(uv.u);
        let ut = new Curve3Algo(uc).t(uv.u);
        let vt = new Curve3Algo(vc).t(uv.v);

        let n = new Vector3();
        n.crossVectors(ut, vt).normalize();
        let bn = new Vector3();
        bn.crossVectors(n, ut).normalize();
        let m = new Matrix3();
        m.extractBasis(ut, bn, n);
        return m;
    }
}

export { SurfaceAlgo };