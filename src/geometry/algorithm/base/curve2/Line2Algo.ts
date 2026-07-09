import { Matrix3, Vector2 } from "../../../../math/Math";
import * as MATHJS from '../../../../mathjs';
import { Line2Data } from "../../../data/base/curve2/Line2Data";
import { Curve2Algo } from "../Curve2Algo";

/**
 * 2D line algorithm.
 *
 */
class Line2Algo extends Curve2Algo {
  /**
   * The data struct of this 2D line algorithm.
   *
   * @type {Line2Data}
   */
  protected _dat: Line2Data;
  public get dat(): Line2Data {
    return this._dat;
  }
  public set dat(dat: Line2Data) {
    this._dat = dat;
  }
  /**
   * Constructs a 2D line algorithm.
   *
   * @param {Curve2Data} [dat=Line2Data] - The data struct of this 2D line algorithm.
   */
  constructor(dat = new Line2Data()) {
    super(dat);
    this.dat = dat;
  }

  /**
   * the D(derivative) function return r-order derivative vector at u parameter.
   * @param {number} [u ∈ [0,a]] - the u parameter of curve.
   * @param {number} [r ∈ [0,1,2...]] - r-order.
   * @retun {Vector2}
   */
  d(u: number, r: number = 0): Vector2 {
    switch (r) {
      case 0:
        let m = this.dat.trans.makeLocalMatrix();
        let ret = new Vector2(u, 0);
        ret.applyMatrix3(m);
        return ret;
      case 1:
        return new Vector2(Math.cos(this.dat.trans.rot), Math.sin(this.dat.trans.rot));
      default:
        return new Vector2(0, 0);
    }
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
    let v = point.clone();
    v.applyMatrix3(this.dat.trans.makeLocalMatrix().invert());
    return v.y;
  }

  /**
   * the U function return u parameter at a position .
   * @param {Vector2} [point] - the point on curve.
   * @retun {number}
   */
  u(point: Vector2): number {
    let v0 = point.clone().sub(this.dat.trans.pos);
    let u = v0.length() * (v0.dot(new Vector2(Math.cos(this.dat.trans.rot), Math.sin(this.dat.trans.rot))) > 0 ? 1 : -1);
    return u
  }

  /**
   * the GE function return general equation coefficients of 2D line.
   * @param {Line2Data} [c = Line2Data] - The data struct of 2D line.
   * @retun {A B C} - General equation coefficients.
   */
  ge(): { A: MATHJS.BigNumber, B: MATHJS.BigNumber, C: MATHJS.BigNumber } {
    // Qnew = T^-T * Qold * T^-1
    let dat = this.dat;
    let t_1 = dat.trans.makeLocalMatrix().invert();
    let t_t = t_1.clone().transpose();
    let e = 0.5;
    let Qold = new Matrix3().set(
      0, 0, 0,
      0, 0, e,
      0, e, 0
    );
    let Qnew = t_t.multiply(Qold).multiply(t_1);

    let A = Qnew.elements[2] + Qnew.elements[6];
    let B = Qnew.elements[5] + Qnew.elements[7];
    let C = Qnew.elements[8];
    return { A: MATHJS.bignumber(A), B: MATHJS.bignumber(B), C: MATHJS.bignumber(C) };
  }

  /**
   * Calculate the integral of the second type curve using Green's formula
   * A = 0.5 * ∫(x dy - y dx) = 0.5 * ∫(x y' - y x') du
   * @param {number} [u0 ∈ [0,a]] - the u0 parameter of curve.
   * @param {number} [u1 ∈ [0,a]] - the u1 parameter of curve.* 
   * @retun {number} 
   */
  green(u0: number, u1: number): number {
    return 0;// 直线在局部坐标下的有向面积贡献为0
  }

  /**
   * Use Green's theorem to calculate the area of the curve between u0 and u1.
   * A = 0.5 * ∫(x dy - y dx) = 0.5 * ∫(x y' - y x') du
   * 带有仿射变换：X=Mx+T 的曲线段：0.5​ (x1y2​ − x2y1)
   * @param {number} [u0 ∈ [0,a]] - the u0 parameter of curve.
   * @param {number} [u1 ∈ [0,a]] - the u1 parameter of curve.* 
   * @retun {number} 
   */
  da(u0: number, u1: number): number {
    let p0 = this.p(u0);
    let p1 = this.p(u1)
    return 0.5 * (p0.x * p1.y - p1.x * p0.y);
  }
}

export { Line2Algo };