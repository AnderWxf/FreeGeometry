import { Matrix3, Vector2 } from "../../../../math/Math";
import * as MATHJS from 'mathjs';
import type { BigNumber } from 'mathjs';
import { MathUtils } from "../../../..//math/MathUtils";
import { Arc2Data } from "../../../data/base/curve2/Arc2Data";
import { Curve2Algo } from "../Curve2Algo";
import { multiply as mul, add, unaryMinus as un, bignumber as big, subtract as sub, equal, largerEq, divide as div } from 'mathjs';

/**
 * 2D arc algorithm.
 * x = acos(φ)
 * y = bsin(φ)
 */
class Arc2Algo extends Curve2Algo {
  /**
   * The data struct of this 2D arc algorithm.
   *
   * @type {Arc2Data}
   */
  protected _dat: Arc2Data;
  public get dat(): Arc2Data {
    return this._dat;
  }
  public set dat(dat: Arc2Data) {
    this._dat = dat;
  }
  /**
   * Constructs a 2D arc algorithm.
   *
   * @param {Curve2Data} [dat=Arc2Data] - The data struct of this 2D arc algorithm.
   */
  constructor(dat = new Arc2Data()) {
    super(dat);
    this.dat = dat;
  }

  /**
   * the U function return u parameter at a position .
   * @param {Vector2} [point] - the point on curve.
   * @retun {number}
   */
  u(point: Vector2): number {
    let v = point.clone();
    v.applyMatrix3(this.dat.trans.makeLocalMatrix().invert());
    // const x = big(v.x);
    // const y = big(v.y);
    // let a = MathUtils.clamp((div(x, big(this.dat.radius.x)) as BigNumber).toNumber(), -1, 1);
    // let b = MathUtils.clamp((div(y, big(this.dat.radius.y)) as BigNumber).toNumber(), -1, 1);

    let x = MathUtils.clamp(v.x / this.dat.radius.x, -1, 1);
    let y = MathUtils.clamp(v.y / this.dat.radius.y, -1, 1);

    let r = Math.atan2(y, x);
    if (r < 0) {
      r += Math.PI * 2
    }
    return r;

    // a = Math.acos(a);
    // b = Math.asin(b);
    // if (b >= 0) {
    //     return a;
    // } else {
    //     return Math.PI * 2 - a;
    // }
  }

  /**
   * the D(derivative) function return r-order derivative vector at u parameter.
   * @param {number} [u ∈ [0,a]] - the u parameter of curve.
   * @param {number} [r ∈ [0,1,2...]] - r-order.
   * @retun {Vector2}
   */
  override d(u: number, r: number = 0): Vector2 {
    switch (r % 4) {
      case 0:
        {
          let m = this.dat.trans.makeLocalMatrix();
          let ret = new Vector2(this.dat.radius.x * Math.cos(u), this.dat.radius.y * Math.sin(u));
          ret.applyMatrix3(m);
          return ret;
        }
      case 1:
        {
          let m = this.dat.trans.makeLinearMatrix();
          let ret = new Vector2(-this.dat.radius.x * Math.sin(u), this.dat.radius.y * Math.cos(u));
          ret.applyMatrix3(m);
          return ret;
        }
      case 2:
        {
          let m = this.dat.trans.makeLinearMatrix();
          let ret = new Vector2(-this.dat.radius.x * Math.cos(u), -this.dat.radius.y * Math.sin(u));
          ret.applyMatrix3(m);
          return ret;
        }
      case 3:
        {
          let m = this.dat.trans.makeLinearMatrix();
          let ret = new Vector2(this.dat.radius.x * Math.sin(u), -this.dat.radius.y * Math.cos(u));
          ret.applyMatrix3(m);
          return ret;
        }
    }
  }

  /**
   * the G(general) function return the value of the general equation for the curve.
   * if point on curve then the return value is zero.
   * f(x,y) = 0
   * x²/a² + y²/b² - 1 = 0
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
      div(mul(y, y), mul(b, b)),
      -1) as BigNumber).toNumber();
  }

  /**
   * the GE function return general equation coefficients of 2D Arc.
   * @param {Arc2Data} [c = Arc2Data] - The data struct of 2D arc.
   * @retun {A B C D E F} - General equation coefficients.
   */
  ge(): { A: BigNumber, B: BigNumber, C: BigNumber, D: BigNumber, E: BigNumber, F: BigNumber } {
    // Qnew = T^-T * Qold * T^-1
    let dat = this.dat;
    let T = dat.trans.makeLocalMatrix();
    let T_1 = T.clone().invert();
    let T_T = T_1.clone().transpose();
    let a = (div(big(1), mul(dat.radius.x, dat.radius.x)) as BigNumber).toNumber();
    let c = (div(big(1), mul(dat.radius.y, dat.radius.y)) as BigNumber).toNumber();
    let Qold = new Matrix3().set(
      a, 0, 0,
      0, c, 0,
      0, 0, -1
    );
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
   *  the green's function return the directed area from u0 to u1 parameter.
   * I = 0.5 * ∫(x dy - y dx) = 0.5 * ∫(x y' - y x') du
   * Green's formula integral in standard formula:0.5 * abΔθ
   * @param {number} [u0 ∈ [0,a]] - the u0 parameter of curve.
   * @param {number} [u1 ∈ [0,a]] - the u1 parameter of curve.* 
   * @retun {number} 
   */
  green(u0: number, u1: number): number {
    return 0.5 * this.dat.radius.x * this.dat.radius.y * (u1 - u0);
  }
}

export { Arc2Algo };