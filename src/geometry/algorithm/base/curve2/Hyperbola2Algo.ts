import { Matrix2, Matrix3, Vector2 } from "../../../../math/Math";
import * as MATHJS from 'mathjs';
import { Hyperbola2Data } from "../../../data/base/curve2/Hyperbola2Data";
import { CurveBuilder } from "../../builder/CurveBuilder";
import { Curve2Inter } from "../../relation/intersection/Curve2Inter";
import { Curve2Algo } from "../Curve2Algo";
import verb from 'verb-nurbs';
import type { BigNumber } from "mathjs";
import { multiply as mul, add, unaryMinus as un, bignumber as big, subtract as sub, equal, largerEq, divide as div } from 'mathjs';

/**
 * 2D Hyperbola algorithm. 
 * 定义A:
 * x = a sec(φ)
 * y = b tan(φ)
 * φ != kπ/2，k∈Z
 * 
 */
class Hyperbola2Algo extends Curve2Algo {
  /**
   * The data struct of this 2D Hyperbola algorithm.
   *
   * @type {Hyperbola2Data}
   */
  protected _dat: Hyperbola2Data;
  public get dat(): Hyperbola2Data {
    return this._dat;
  }
  public set dat(dat: Hyperbola2Data) {
    this._dat = dat;
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
    ret.push(...this.vernurbs2(u));
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
    const a = big(this.dat.radius.x);
    const b = big(this.dat.radius.y);
    const m = this.dat.trans.makeLocalMatrix();

    // P0=(a sec(θ0),b tan(θ0))
    // P1=(a sec(θm​) / s,b tan(θm) / s)
    // P2=(a sec(u1),b tan(u1))
    // 其中 θm = (θ0 + θ1) / 2,Δθ = θ1 − u0,w = s = sec(Δθ / 2)
    let ret = [];
    let θ = Math.PI / 6;
    // 右支（对称）
    {
      let θ0 = big(0 + u.x + 1e-10);
      let θ1 = big(0 + u.y - 1e-10);
      let θm = mul(add(θ0, θ1), 0.5) as BigNumber;
      let Δθ = sub(θ1, θ0) as BigNumber;
      let s = MATHJS.sec(div(Δθ, 2) as BigNumber);
      let w = s;
      const ws = [1.0, w.toNumber(), 1.0];
      let p0 = new Vector2(
        (mul(a, MATHJS.sec(θ0)) as BigNumber).toNumber(),
        (mul(b, MATHJS.tan(θ0)) as BigNumber).toNumber()
      );
      let p1 = new Vector2(
        // (div(mul(a, MATHJS.sec(θm)), s) as BigNumber).toNumber(),
        // (div(mul(b, MATHJS.tan(θm)), s) as BigNumber).toNumber()
        0, 0
      );
      let p2 = new Vector2(
        (mul(a, MATHJS.sec(θ1)) as BigNumber).toNumber(),
        (mul(b, MATHJS.tan(θ1)) as BigNumber).toNumber()
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
      let θ0 = big(Math.PI + u.x + 1e-10);
      let θ1 = big(Math.PI + u.y - 1e-10);
      let θm = mul(add(θ0, θ1), 0.5) as BigNumber;
      let Δθ = sub(θ1, θ0) as BigNumber;
      let s = MATHJS.sec(div(Δθ, 2) as BigNumber);
      let w = s;
      const ws = [1.0, w.toNumber(), 1.0];
      let p0 = new Vector2(
        (mul(a, MATHJS.sec(θ0)) as BigNumber).toNumber(),
        (mul(b, MATHJS.tan(θ0)) as BigNumber).toNumber()
      );
      let p1 = new Vector2(
        // (div(mul(a, MATHJS.sec(θm)), s) as BigNumber).toNumber(),
        // (div(mul(b, MATHJS.tan(θm)), s) as BigNumber).toNumber()
        0, 0
      );
      let p2 = new Vector2(
        (mul(a, MATHJS.sec(θ1)) as BigNumber).toNumber(),
        (mul(b, MATHJS.tan(θ1)) as BigNumber).toNumber()
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
  vernurbs2(u: Vector2 = new Vector2(-Math.PI / 4, Math.PI / 4)): Array<any> {
    const a = big(this.dat.radius.x);
    const b = big(this.dat.radius.y);
    const m = this.dat.trans.makeLocalMatrix();

    let ret = [];
    // let θ = Math.PI / 6;
    // 右支（对称）
    {
      let θ0 = big(0 + u.x + 1e-10);
      let θ1 = big(0 + u.y - 1e-10);
      let θm = mul(add(θ0, θ1), 0.5) as BigNumber;
      let p0 = new Vector2(
        mul(a, MATHJS.sec(θ0)) as number,
        mul(b, MATHJS.tan(θ0)) as number
      );
      let p2 = new Vector2(
        mul(a, MATHJS.sec(θ1)) as number,
        mul(b, MATHJS.tan(θ1)) as number
      );
      // 从二次曲线到有理二次Bézier曲线的转换（期刊） 施法中 工程图学学报 1989 (02)

      // 计算p0 p2 处的切线，计算控制点p1
      let v0 = new Vector2(
        mul(a, MATHJS.sec(θ0), MATHJS.tan(θ0)) as number,
        mul(b, MATHJS.sec(θ0), MATHJS.sec(θ0)) as number
      );
      let v2 = new Vector2(
        mul(a, MATHJS.sec(θ1), MATHJS.tan(θ1)) as number,
        mul(b, MATHJS.sec(θ1), MATHJS.sec(θ1)) as number
      );
      let line0 = CurveBuilder.BuildLine2FromPointAndVector(p0, v0);
      let line2 = CurveBuilder.BuildLine2FromPointAndVector(p2, v2);
      let ls = Curve2Inter.LineXLine(line0, line2, 0, 0);
      let p1 = ls[0].p;
      p1.x = (p1.x as any).toNumber();
      p1.y = (p1.y as any).toNumber();
      // 线上点p
      let p = new Vector2(
        mul(a, MATHJS.sec(θm)) as number,
        mul(b, MATHJS.tan(θm)) as number
      );

      // p0.set(-1, 0);
      // p1.set(0, 1);
      // p2.set(1, 0);
      // p.set(1 / 2, 3 / 8);

      let x = big(p.x);
      let y = big(p.y);
      let x0 = big(p0.x);
      let y0 = big(p0.y);
      let x1 = big(p1.x);
      let y1 = big(p1.y);
      let x2 = big(p2.x);
      let y2 = big(p2.y);

      let detA = sub(
        mul(sub(x, x1), sub(y2, y1)),
        mul(sub(y, y1), sub(x2, x1))
      );
      let detB = sub(
        mul(sub(x0, x1), sub(y, y1)),
        mul(sub(y0, y1), sub(x, x1))
      );
      let det = sub(
        mul(sub(x0, x1), sub(y2, y1)),
        mul(sub(y0, y1), sub(x2, x1))
      );

      let α = div(detA, det) as BigNumber;
      let β = div(detB, det) as BigNumber;
      let v10 = p0.clone().sub(p1);
      let v12 = p2.clone().sub(p1);
      let αv10 = v10.clone().multiplyScalar(α.toNumber());
      let βv12 = v12.clone().multiplyScalar(β.toNumber());
      let pp = p1.clone().add(αv10).add(βv12);
      let λ = div(mul(α, β), add(mul(α, β), MATHJS.pow(add(α, β, -1), 2)));
      let w1 = mul(MATHJS.sqrt(div(sub(big(1), λ), λ) as BigNumber), 0.5);
      let w = div(
        sub(big(1), add(α, β)),
        mul(MATHJS.sqrt(mul(α, β) as BigNumber), 2));
      // w = 1.25;
      const ws = [1.0, w, 1.0];

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
      let θ0 = big(Math.PI + u.x + 1e-10);
      let θ1 = big(Math.PI + u.y - 1e-10);
      let θm = mul(add(θ0, θ1), 0.5) as BigNumber;
      let Δθ = sub(θ1, θ0) as BigNumber;
      let s = MATHJS.sec(div(Δθ, 2) as BigNumber);
      let w = s;
      const ws = [1.0, w.toNumber(), 1.0];
      let p0 = new Vector2(
        (mul(a, MATHJS.sec(θ0)) as BigNumber).toNumber(),
        (mul(b, MATHJS.tan(θ0)) as BigNumber).toNumber()
      );
      let p1 = new Vector2(
        // (div(mul(a, MATHJS.sec(θm)), s) as BigNumber).toNumber(),
        // (div(mul(b, MATHJS.tan(θm)), s) as BigNumber).toNumber()
        0, 0
      );
      let p2 = new Vector2(
        (mul(a, MATHJS.sec(θ1)) as BigNumber).toNumber(),
        (mul(b, MATHJS.tan(θ1)) as BigNumber).toNumber()
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
    v.applyMatrix3(this.dat.trans.makeLocalMatrix().invert());
    const b = big(this.dat.radius.y);
    const y = big(v.y);
    const φ = MATHJS.atan(div(y, b) as BigNumber);
    if (v.x > 0) {
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
    const a = big(this.dat.radius.x);
    const b = big(this.dat.radius.y);

    const secu = MATHJS.sec(u);
    const tanu = MATHJS.tan(u);
    switch (r) {
      case 0:
        {
          // x = a sec(u)
          // y = b tan(u)         
          const m = this.dat.trans.makeLocalMatrix();
          const x = mul(a, secu) as BigNumber;
          const y = mul(b, tanu) as BigNumber;
          let ret = new Vector2(x.toNumber(), y.toNumber());
          ret.applyMatrix3(m);
          return ret;
        }
      case 1:
        {
          // x' = a sec(u) tan(u)
          // y' = b sec(u) sec(u)    
          const m = this.dat.trans.makeLinearMatrix();
          const x = mul(a, secu, tanu) as BigNumber;
          const y = mul(b, secu, secu) as BigNumber;
          let ret = new Vector2(x.toNumber(), y.toNumber());
          ret.applyMatrix3(m);
          return ret;
        }
      case 2:
        {
          // x'' = a(sec(u)tan(u)tan(u) + sec(u)sec(u)sec(u)) = a(sec(u)tan^2(u) + sec^3(u))
          // y'' = b(2sec(u)sec(u)tan(u)) = 2bsec^2(u)tan(u)  
          const m = this.dat.trans.makeLinearMatrix();
          const x = add(mul(secu, tanu, tanu), mul(secu, secu, secu)) as BigNumber;
          const y = mul(b, secu, secu, tanu, 2) as BigNumber;
          let ret = new Vector2(x.toNumber(), y.toNumber());
          ret.applyMatrix3(m);
          return ret;
        }
      case 3:
        {
          // x'' = a(sec(u)tan^3(u) + 2tan(u)sec^3(u) + 3sec^3(u)tan(u))
          // y'' = 2b(2sec^2(u)tan^2(u) + sec^4(u))
          const m = this.dat.trans.makeLinearMatrix();
          let x = add(mul(a, secu, tanu, tanu, tanu), mul(a, tanu, secu, secu, secu, 2), mul(a, secu, secu, secu, tanu, 3)) as BigNumber;
          let y = add(mul(b, secu, secu, tanu, tanu, 4), mul(b, secu, secu, secu, secu, 2)) as BigNumber;
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
    v.applyMatrix3(this.dat.trans.makeLocalMatrix().invert());
    const x = big(v.x);
    const y = big(v.y);
    let a = big(this.dat.radius.x);
    let b = big(this.dat.radius.y);
    return (add(
      div(mul(x, x), mul(a, a)),
      div(mul(y, y), un(mul(b, b))),
      -1) as BigNumber).toNumber();
  }

  /**
   * the GE function return general equation coefficients of 2D Hyperbola.
   * @param {Hyperbola2Data} [c = Hyperbola2Data] - The data struct of 2D Hyperbola.
   * @retun {A B C D E F} - General equation coefficients.
   */
  ge(): { A: BigNumber, B: BigNumber, C: BigNumber, D: BigNumber, E: BigNumber, F: BigNumber } {
    // Qnew = T^-T * Qold * T^-1
    let dat = this.dat;
    let T = dat.trans.makeLocalMatrix();
    let T_1 = T.clone().invert();
    let T_T = T_1.clone().transpose();
    let a = (div(big(1), mul(dat.radius.x, dat.radius.x)) as BigNumber).toNumber();
    let c = -(div(big(1), mul(dat.radius.y, dat.radius.y)) as BigNumber).toNumber();
    let Qold = new Matrix3().set(
      a, 0, 0,
      0, c, 0,
      0, 0, -1
    )
    let Qnew = T_T.clone();
    Qnew.multiply(Qold);
    Qnew.multiply(T_1);
    return {
      A: big(Qnew.elements[0]),
      B: big(Qnew.elements[1] + Qnew.elements[3]),
      C: big(Qnew.elements[4]),
      D: big(Qnew.elements[2] + Qnew.elements[6]),
      E: big(Qnew.elements[5] + Qnew.elements[7]),
      F: big(Qnew.elements[8])
    };
  }

  /**
   * the green's function return the directed area from u0 to u1 parameter.
   * Use Green's theorem to calculate the area of the curve between u0 and u1.
   * A = 0.5 * ∫(x dy - y dx) = 0.5 * ∫(x y' - y x') du
   * Green's formula integral in standard formula:0.5 * abln|(sec(u1) + tan(u1)) / (sec(u0) + tan(u0))|.
   * @param {number} [u0 ∈ [0,a]] - the u0 parameter of curve.
   * @param {number} [u1 ∈ [0,a]] - the u1 parameter of curve.*
   * @retun {number}
   */
  green(u0: number, u1: number): number {
    return 0.5 * this.dat.radius.x * this.dat.radius.y * MATHJS.log(MATHJS.abs((MATHJS.sec(u1) + MATHJS.tan(u1)) / (MATHJS.sec(u0) + MATHJS.tan(u0))));
  }
}

export { Hyperbola2Algo };