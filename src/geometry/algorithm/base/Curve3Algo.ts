import { Matrix3, Vector2, Vector3 } from "../../../math/Math";
import { Curve3Data } from "../../data/base/Curve3Data";

/**
 * 3D curvr algorithm.
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
     * @param {Curve3Data} [dat=Curve3Data] - The data struct of this 3D curvr algorithm.
     */
    constructor(dat = new Curve3Data()) {
        this.dat = dat;
    }

    /**
     * the P function return a point at t parameter.
     * @param {number} [t∈[0,1]] - the t parameter of curve.
     * @retun {Vector3}
     */
    p(t: number): Vector3 {
        return this.d(t, 0);
    }

    /**
     * the T function return t parameter at a point on curve.
     * @param {Vector3} [point] - the point on curve.
     * @retun {number}
     */
    t(point: Vector3): number {
        debugger;
        return null;
    }

    /**
     * the D function return r-order derivative vector at t parameter.
     * @param {number} [t∈[0,1]] - the t parameter of curve.
     * @param {r} [t∈[0,1,3...]] - r-order.
     * @retun {Vector3}
     */
    d(t: number, r: number = 0): Vector3 {
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
     * the TG function return 1-order derivative vector at t parameter.
     *
     * @retun {Vector3}
     */
    tg(t: number): Vector3 {
        return this.d(t, 1);
    }

    /**
     * the N(normal) function return 2-order derivative vector at t parameter.
     *
     * @retun {Vector2}
     */
    n(t: number): Vector3 {
        return this.d(t, 2);
    }

    /**
     * the BN(bin normal) function return bin vector at t parameter.
     *
     * @retun {Vector2}
     */
    bn(t: number): Vector3 {
        let tg = this.tg(t);
        let n = this.n(t);
        return tg.cross(n);
    }

    /**
     * the K function return curvature at t parameter.
     *
     * @retun {number}
     */
    k(t: number): number {
        let tg = this.tg(t);
        let n = this.n(t);
        let k = tg.length() / n.lengthSq();
        return k;
    }

    /**
     * the R function return radius of curvature at t parameter.
     *
     * @retun {number}
     */
    r(t: number): number {
        let k = this.k(t);
        if (k == 0) {
            return Infinity;
        }
        return 1.0 / k;
    }

    /**
     * the TBN(tbn rotation matrix) function return tbn matrix at t parameter.
     *
     * @retun {Matrix3}
     */
    tbn(t: number): Matrix3 {
        let tg = this.tg(t).normalize();
        let n = this.n(t).normalize();
        let bn = tg.clone().cross(n).normalize();
        let m = new Matrix3();
        m.extractBasis(tg, n, bn);
        return m;
    }

    /**
     * get begin point.
     *
     * @retun {Vector3}
     */
    getBeginPoint(): Vector3 {
        return this.p(0);
    }

    /**
     * get end point.
     *
     * @retun {Vector3}
     */
    getEndPoint(): Vector3 {
        return this.p(1);
    }

    /**
     * get begin tangent.
     *
     * @retun {Vector3}
     */
    getBeginTangent(): Vector3 {
        return this.tg(0);
    }

    /**
     * get end tangent.
     *
     * @retun {Vector3}
     */
    getEndTangent(): Vector3 {
        return this.tg(1);
    }

}

export { Curve3Algo };