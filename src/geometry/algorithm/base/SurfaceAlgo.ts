import { Matrix3, Vector2, Vector3 } from "../../../math/Math";
import { SurfaceData } from "../../data/base/SurfaceData";

/**
 * surface algorithm.
 * uv parameter [(0,0) , (1,1)]
 */
class SurfaceAlgo {

    /**
     * The data struct of this surface algorithm.
     *
     * @type {SurfaceData}
     */
    public dat: SurfaceData;

    /**
     * Constructs a surface algorithm.
     *
     * @param {SurfaceData} [dat=SurfaceData] - The data struct of this surface algorithm.
     */
    constructor(dat: SurfaceData) {
        this.dat = dat;
    }

    /**
     * the P function return a point at uv parameter.
     * @param {Vector2} [uv∈[(0,0),(1,1)]] - the uv parameter of curve.
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
     * @param {Vector2} [t∈[0,1]] - the uv parameter of curve.
     * @param {number} [r∈[0,1,3...]] - r-order.
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
     * the TG function return 1-order derivative vector at uv parameter.
     *
     * @retun {Vector3}
     */
    tg(uv: Vector2): Vector3 {
        return this.d(uv, 1);
    }

    /**
     * the N(normal) function return 2-order derivative vector at uv parameter.
     *
     * @retun {Vector2}
     */
    n(uv: Vector2): Vector3 {
        return this.d(uv, 2);
    }

    /**
     * the BN(bin normal) function return bin vector at uv parameter.
     *
     * @retun {Vector2}
     */
    bn(uv: Vector2): Vector3 {
        let tg = this.tg(uv);
        let n = this.n(uv);
        return tg.cross(n);
    }

    /**
     * the K function return curvature at uv parameter.
     *
     * @retun {number}
     */
    k(uv: Vector2): number {
        let tg = this.tg(uv);
        let n = this.n(uv);
        let k = tg.length() / n.lengthSq();
        return k;
    }

    /**
     * the R function return radius of curvature at uv parameter.
     *
     * @retun {number}
     */
    r(uv: Vector2): number {
        let k = this.k(uv);
        if (k == 0) {
            return Infinity;
        }
        return 1.0 / k;
    }

    /**
     * the TBN(tbn rotation matrix) function return tbn matrix at uv parameter.
     *
     * @retun {Matrix3}
     */
    tbn(uv: Vector2): Matrix3 {
        let tg = this.tg(uv).normalize();
        let n = this.n(uv).normalize();
        let bn = tg.clone().cross(n).normalize();
        let m = new Matrix3();
        m.extractBasis(tg, n, bn);
        return m;
    }
}

export { SurfaceAlgo };