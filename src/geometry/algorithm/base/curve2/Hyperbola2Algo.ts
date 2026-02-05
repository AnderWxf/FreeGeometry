import { Vector2 } from "../../../../math/Math";
import * as MATHJS from '../../../../mathjs';
import { MathUtils } from "../../../../math/MathUtils";
import { Hyperbola2Data } from "../../../data/base/curve2/Hyperbola2Data";
import { Curve2Algo } from "../Curve2Algo";
import verb from 'verb-nurbs';

/**
 * 2D Hyperbola algorithm. TODO
 * x = a sec(φ)
 * y = b tan(φ)
 */
class Hyperbola2Algo extends Curve2Algo {
    /**
     * The data struct of this 2D Hyperbola algorithm.
     *
     * @type {Hyperbola2Data}
     */
    protected dat_: Hyperbola2Data;
    public get dat(): Hyperbola2Data {
        return this.dat_;
    }
    public set dat(dat: Hyperbola2Data) {
        this.dat_ = dat;
    }
    /**
     * Constructs a 2D Hyperbola algorithm.
     *
     * @param {Curve2Data} [dat=Hyperbola2Data] - The data struct of this 2D Hyperbola algorithm.
     */
    constructor(dat = new Hyperbola2Data()) {
        super(dat);
        this.dat = dat;
    }

    /**
     * to ver-nurbs object.
     * @retun {any}
     */
    vernurbs(u: Vector2 = new Vector2(-Math.PI / 4, Math.PI / 4)): Array<any> {
        let ret = [];
        // ret.push(...this.vernurbs0(u));
        ret.push(...this.vernurbs1(u));
        return ret;
    }
    vernurbs0(u: Vector2 = new Vector2(-Math.PI / 4, Math.PI / 4)): Array<any> {
        const a: number = this.dat.radius.x;
        const b: number = this.dat.radius.y;
        const m = this.dat.trans.makeLocalMatrix();

        // P0=(a cosh(u0),b sinh(u0) )
        // P1=(a cosh(um​)/cosh(Δu/2),b sinh(um)/cosh(Δu/2))
        // P1=(a cosh(u1),b sinh(u1))
        // 其中 um=(u0+u1)/2,Δu=u1−u0,w=cosh(Δu/2)

        let ret = [];
        // 右支（对称）
        {
            let u0 = u.x + 1e-10;
            let u1 = u.y - 1e-10;
            let um = (u0 + u1) * 0.5;
            let Δu = u1 - u0;
            let w = Math.cosh(Δu / 2);

            // u0 = Math.log(1 / Math.cos(u0) + Math.tan(u0));
            // u1 = Math.log(1 / Math.cos(u1) + Math.tan(u1));
            const ws = [1.0, w, 1.0];
            let p0 = new Vector2(a * Math.cosh(u0), b * Math.sinh(u0));
            let p1 = new Vector2(a * Math.cosh(um) / w, b * Math.sinh(um) / w);
            let p2 = new Vector2(a * Math.cosh(u1), b * Math.sinh(u1));
            p0.applyMatrix3(m);
            p1.applyMatrix3(m);
            p2.applyMatrix3(m);
            const points = [
                [p0.x, p0.y, ws[0]],
                [p1.x, p1.y, ws[1]],
                [p2.x, p2.y, ws[2]],
            ];
            // 构建曲线
            const nurbs = new verb.geom.NurbsCurve({ controlPoints: points, knots: [0, 0, 0, 1, 1, 1], degree: 2 })
            ret.push(nurbs);
        }
        // 左支（对称）
        {
            let u0 = u.x + Math.PI + 1e-10;
            let u1 = u.y + Math.PI - 1e-10;
            let um = (u0 + u1) * 0.5;
            let Δu = u1 - u0;
            let w = Math.cosh(Δu / 2);

            // u0 = Math.log(1 / Math.cos(u0) + Math.tan(u0));
            // u1 = Math.log(1 / Math.cos(u1) + Math.tan(u1));
            const ws = [1.0, w, 1.0];
            let p0 = new Vector2(a * Math.cosh(u0), b * Math.sinh(u0));
            let p1 = new Vector2(a * Math.cosh(um) / Math.cosh(Δu / 2), b * Math.sinh(um) / Math.cosh(Δu / 2));
            let p2 = new Vector2(a * Math.cosh(u1), b * Math.sinh(u1));
            p0.applyMatrix3(m);
            p1.applyMatrix3(m);
            p2.applyMatrix3(m);
            const points = [
                [p0.x, p0.y, ws[0]],
                [p1.x, p1.y, ws[1]],
                [p2.x, p2.y, ws[2]],
            ];
            // 构建曲线
            const nurbs = new verb.geom.NurbsCurve({ controlPoints: points, knots: [0, 0, 0, 1, 1, 1], degree: 2 })
            // ret.push(nurbs);
        }
        return ret;
    }
    vernurbs1(u: Vector2 = new Vector2(-Math.PI / 4, Math.PI / 4)): Array<any> {
        const a = MATHJS.bignumber(this.dat.radius.x);
        const b = MATHJS.bignumber(this.dat.radius.y);
        const m = this.dat.trans.makeLocalMatrix();

        // P0=(a sec(θ0),b tan(θ0))
        // P1=(a sec(θm​) / s,b tan(θm) / s)
        // P2=(a sec(u1),b tan(u1))
        // 其中 θm = (θ0 + θ1) / 2,Δθ = θ1 − u0,w = s = sec(Δθ / 2)
        let ret = [];
        let θ = Math.PI / 6;
        // 右支（对称）
        {
            let θ0 = MATHJS.bignumber(0 + u.x + 1e-10);
            let θ1 = MATHJS.bignumber(0 + u.y - 1e-10);
            let θm = MATHJS.multiply(MATHJS.add(θ0, θ1), 0.5) as MATHJS.BigNumber;
            let Δθ = MATHJS.subtract(θ1, θ0) as MATHJS.BigNumber;
            let s = MATHJS.sec(MATHJS.divide(Δθ, 2) as MATHJS.BigNumber);
            let w = s;
            const ws = [1.0, w.toNumber(), 1.0];
            let p0 = new Vector2(
                (MATHJS.multiply(a, MATHJS.sec(θ0)) as MATHJS.BigNumber).toNumber(),
                (MATHJS.multiply(b, MATHJS.tan(θ0)) as MATHJS.BigNumber).toNumber()
            );
            let p1 = new Vector2(
                (MATHJS.divide(MATHJS.multiply(a, MATHJS.sec(θm)), s) as MATHJS.BigNumber).toNumber(),
                (MATHJS.divide(MATHJS.multiply(b, MATHJS.tan(θm)), s) as MATHJS.BigNumber).toNumber()
            );
            let p2 = new Vector2(
                (MATHJS.multiply(a, MATHJS.sec(θ1)) as MATHJS.BigNumber).toNumber(),
                (MATHJS.multiply(b, MATHJS.tan(θ1)) as MATHJS.BigNumber).toNumber()
            );
            p0.applyMatrix3(m);
            p1.applyMatrix3(m);
            p2.applyMatrix3(m);
            const points = [
                [p0.x, p0.y, ws[0]],
                [p1.x, p1.y, ws[1]],
                [p2.x, p2.y, ws[2]],
            ];
            // 构建曲线
            const nurbs = new verb.geom.NurbsCurve({ controlPoints: points, knots: [0, 0, 0, 1, 1, 1], degree: 2 })
            ret.push(nurbs);
        }
        // 左支（对称）
        {
            let θ0 = MATHJS.bignumber(Math.PI + u.x + 1e-10);
            let θ1 = MATHJS.bignumber(Math.PI + u.y - 1e-10);
            let θm = MATHJS.multiply(MATHJS.add(θ0, θ1), 0.5) as MATHJS.BigNumber;
            let Δθ = MATHJS.subtract(θ1, θ0) as MATHJS.BigNumber;
            let s = MATHJS.sec(MATHJS.divide(Δθ, 2) as MATHJS.BigNumber);
            let w = s;
            const ws = [1.0, w.toNumber(), 1.0];
            let p0 = new Vector2(
                (MATHJS.multiply(a, MATHJS.sec(θ0)) as MATHJS.BigNumber).toNumber(),
                (MATHJS.multiply(b, MATHJS.tan(θ0)) as MATHJS.BigNumber).toNumber()
            );
            let p1 = new Vector2(
                (MATHJS.divide(MATHJS.multiply(a, MATHJS.sec(θm)), s) as MATHJS.BigNumber).toNumber(),
                (MATHJS.divide(MATHJS.multiply(b, MATHJS.tan(θm)), s) as MATHJS.BigNumber).toNumber()
            );
            let p2 = new Vector2(
                (MATHJS.multiply(a, MATHJS.sec(θ1)) as MATHJS.BigNumber).toNumber(),
                (MATHJS.multiply(b, MATHJS.tan(θ1)) as MATHJS.BigNumber).toNumber()
            );
            p0.applyMatrix3(m);
            p1.applyMatrix3(m);
            p2.applyMatrix3(m);
            const points = [
                [p0.x, p0.y, ws[0]],
                [p1.x, p1.y, ws[1]],
                [p2.x, p2.y, ws[2]],
            ];
            // 构建曲线
            const nurbs = new verb.geom.NurbsCurve({ controlPoints: points, knots: [0, 0, 0, 1, 1, 1], degree: 2 })
            ret.push(nurbs);
        }
        return ret;
    }

    /**
     * the U function return u parameter at a position .
     * @param {Vector2} [point] - the point on curve.
     * @retun {number}
     */
    u(point: Vector2): number {
        let v = point.clone();
        v.applyMatrix3(this.dat.trans.makeWorldMatrix().invert());
        const b = MATHJS.bignumber(this.dat.radius.y);
        const y = MATHJS.bignumber(point.y);
        const φ = MATHJS.atan(MATHJS.divide(y, b) as MATHJS.BigNumber);
        if (point.x > 0) {
            return φ.toNumber();
        } else {
            return φ.toNumber() + Math.PI;
        }
    }

    /**
     * the D(derivative) function return r-order derivative vector at u parameter.
     * @param {number} [u ∈ [0,a]] - the u parameter of curve.
     * @param {number} [r ∈ [0,1,2...]] - r-order.
     * @retun {Vector2}
     */
    d(u: number, r: number = 0): Vector2 {
        const a = MATHJS.bignumber(this.dat.radius.x);
        const b = MATHJS.bignumber(this.dat.radius.y);
        const m = this.dat.trans.makeLocalMatrix();
        switch (r) {
            case 0:
                {
                    // x = asec(φ)
                    // y = btan(φ)         
                    const x = MATHJS.multiply(a, MATHJS.sec(u)) as MATHJS.BigNumber;
                    const y = MATHJS.multiply(b, MATHJS.tan(u)) as MATHJS.BigNumber;
                    let ret = new Vector2(x.toNumber(), y.toNumber());
                    ret.applyMatrix3(m);
                    return ret;
                }
            case 1:
                {
                    // x' = asec(φ)tan(φ)
                    // y' = bsec(φ)sec(φ)              
                    const x = MATHJS.multiply(a, MATHJS.sec(u), MATHJS.tan(u)) as MATHJS.BigNumber;
                    const y = MATHJS.multiply(b, MATHJS.tan(u), MATHJS.sec(u)) as MATHJS.BigNumber;
                    let ret = new Vector2(x.toNumber(), y.toNumber());
                    ret.applyMatrix3(m);
                    return ret;
                }
            case 2:
                {
                    // x'' = a(sec(φ)tan(φ)tan(φ) + sec(φ)sec(φ)sec(φ)) = a(sec(φ)tan^2(φ) + sec^3(φ))
                    // y'' = b(2sec(φ)sec(φ)tan(φ)) = 2bsec^2(φ)tan(φ)  
                    const su = MATHJS.sec(u);
                    const tu = MATHJS.tan(u);
                    const x = MATHJS.add(MATHJS.multiply(su, tu, tu), MATHJS.multiply(su, su, su)) as MATHJS.BigNumber;
                    const y = MATHJS.multiply(b, su, su, tu, 2) as MATHJS.BigNumber;
                    let ret = new Vector2(x.toNumber(), y.toNumber());
                    ret.applyMatrix3(m);
                    return ret;
                }
            case 3:
                {
                    // x'' = a(sec(φ)tan^3(φ) + 2tan(φ)sec^3(φ) + 3sec^3(φ)tan(φ))
                    // y'' = 2b(2sec^2(φ)tan^2(φ) + sec^4(φ))
                    let su = MATHJS.sec(u);
                    let tu = MATHJS.tan(u);
                    let x = MATHJS.add(MATHJS.multiply(a, su, tu, tu, tu), MATHJS.multiply(a, tu, su, su, su, 2), MATHJS.multiply(a, su, su, su, tu, 3)) as MATHJS.BigNumber;
                    let y = MATHJS.add(MATHJS.multiply(b, su, su, tu, tu, 4), MATHJS.multiply(b, su, su, su, su, 2)) as MATHJS.BigNumber;
                    let ret = new Vector2(x.toNumber(), y.toNumber());
                    ret.applyMatrix3(m);
                    return ret;
                }
            default:
                debugger;
                return;
        }
    }

    /**
     * the G(general) function return the value of the general equation for the curve.
     * if point on curve then the return value is zero.
     * f(x,y) = 0
     * x²/a² - y²/b² - 1 = 0
     * @param {Vector2} [point] - the point baout curve. 
     * @retun {number}
     */
    g(point: Vector2): number {
        let v = point.clone();
        v.applyMatrix3(this.dat.trans.makeWorldMatrix().invert());
        const x = MATHJS.bignumber(v.x);
        const y = MATHJS.bignumber(v.y);
        let a = MATHJS.bignumber(this.dat.radius.x);
        let b = MATHJS.bignumber(this.dat.radius.y);
        return (MATHJS.add(
            MATHJS.divide(MATHJS.multiply(x, x), MATHJS.multiply(a, a)),
            MATHJS.divide(MATHJS.multiply(y, y), MATHJS.unaryMinus(MATHJS.multiply(b, b))),
            -1) as MATHJS.BigNumber).toNumber();
    }

    /**
     * the GE function return general equation coefficients of 2D Hyperbola.
     * @param {Hyperbola2Data} [c = Hyperbola2Data] - The data struct of 2D Hyperbola.
     * @retun {A B C D E F} - General equation coefficients.
     */
    ge(): { A: MATHJS.BigNumber, B: MATHJS.BigNumber, C: MATHJS.BigNumber, D: MATHJS.BigNumber, E: MATHJS.BigNumber, F: MATHJS.BigNumber } {
        //设中心在 (x0,y0)，长半轴 a（沿旋转前 X 轴方向），短半轴 b（沿旋转前 Y 轴方向），旋转角为 φ（绕中心逆时针转）。
        // 曲线系数计算
        // A = cos²φ/a² - sin²φ/b², 
        // B = (1/a² + 1/b²)sin2φ
        // C = sin²φ/a² - cos²φ/b², 
        // D = −2 A x0 − B y0 
        // E = −2 C y0 − B x0
        // F = A x0² + B x0 y0 + C y0² − 1     
        // 曲线的二元二次方程组
        // Ax² + Bxy + Cy² + Dx + Ey + F = 0
        const c = this.dat;
        const a = MATHJS.bignumber(c.radius.x);
        const b = MATHJS.bignumber(c.radius.y);
        const φ = MATHJS.bignumber(c.trans.rot);
        const x0 = MATHJS.bignumber(c.trans.pos.x);
        const y0 = MATHJS.bignumber(c.trans.pos.y);
        const aa = MATHJS.divide(MATHJS.bignumber(1), MATHJS.multiply(a, a));// 1/a²
        const bb = MATHJS.divide(MATHJS.bignumber(1), MATHJS.multiply(b, b));// 1/b²
        const sinφ = MATHJS.sin(φ);
        const cosφ = MATHJS.cos(φ);
        const sin2φ = MATHJS.sin(MATHJS.multiply(φ, 2) as MATHJS.BigNumber);

        const A = MATHJS.subtract(
            MATHJS.multiply(cosφ, cosφ, aa),
            MATHJS.multiply(sinφ, sinφ, bb)
        ) as MATHJS.BigNumber;
        const B = MATHJS.multiply(MATHJS.add(aa, bb), sin2φ) as MATHJS.BigNumber;
        const C = MATHJS.subtract(
            MATHJS.multiply(aa, sinφ, sinφ),
            MATHJS.multiply(bb, cosφ, cosφ)
        ) as MATHJS.BigNumber;
        const D = MATHJS.add(
            MATHJS.unaryMinus(MATHJS.multiply(A, x0, 2)),
            MATHJS.unaryMinus(MATHJS.multiply(B, y0))
        ) as MATHJS.BigNumber;
        const E = MATHJS.add(
            MATHJS.unaryMinus(MATHJS.multiply(C, y0, 2)),
            MATHJS.unaryMinus(MATHJS.multiply(B, x0))
        ) as MATHJS.BigNumber;
        const F = MATHJS.add(
            MATHJS.multiply(A, x0, x0),
            MATHJS.multiply(B, x0, y0),
            MATHJS.multiply(C, y0, y0),
            MATHJS.bignumber(-1),
        ) as MATHJS.BigNumber;
        return { A, B, C, D, E, F };
    }
}

export { Hyperbola2Algo };