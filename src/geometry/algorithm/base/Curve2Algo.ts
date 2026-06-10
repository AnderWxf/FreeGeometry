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
  protected _dat: Curve2Data;
  public get dat(): Curve2Data {
    return this._dat;
  }
  public set dat(dat: Curve2Data) {
    this._dat = dat;
  }
  /**
   * Constructs a 2D curvr algorithm.
   *
   * @param {Curve2Data} [dat = Curve2Data] - The data struct of this 2D curvr algorithm.
   */
  constructor(dat: Curve2Data) {
    this._dat = dat;
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

  /**
   * the green's function return the directed area from u0 to u1 parameter.
   * I = 0.5 * ∫(x dy - y dx) = 0.5 * ∫(x y' - y x') du
   * @param {number} [u0 ∈ [0,a]] - the u0 parameter of curve.
   * @param {number} [u1 ∈ [0,a]] - the u1 parameter of curve.* 
   * @retun {number} 
   */
  green(u0: number, u1: number): number {
    return 0;
  }

  /**
   * Use Green's theorem to calculate the area of the curve between u0 and u1.
   * A = 0.5 * ∫(x dy - y dx) = 0.5 * ∫(x y' - y x') du
   * 带有仿射变换：X=Mx+T 的曲线段：
   * Iworld = det⁡(M)⋅ Ilocal + 1/2(TxΔY−TyΔX)
   * 符号	        含义	                            备注
   * M	          线性变换矩阵（含旋转、缩放、错切）	2×2 矩阵
   * det⁡(M) 或 Δ	 行列式	                           面积缩放因子
   * T=(Tx,Ty)    平移向量	
   * Ilocal     	局部坐标系下的有向面积贡献	        由标准曲线公式计算
   * ΔX=X2−X1 	  曲线段在世界系下 x 坐标差	          端点值
   * ΔY=Y2−Y1 	  曲线段在世界系下 y 坐标差	          端点值
    * @param {number} [u0 ∈ [0,a]] - the u0 parameter of curve.
   * @param {number} [u1 ∈ [0,a]] - the u1 parameter of curve.* 
   * @retun {number} 
   */
  da(u0: number, u1: number): number {
    let Ilocal = this.green(u0, u1);
    let m = this.dat.trans.makeLocalMatrix();
    let a = m.elements[0];
    let b = m.elements[1];
    let c = m.elements[3];
    let d = m.elements[4];
    let Tx = m.elements[2];
    let Ty = m.elements[5];
    let Δ = a * d - b * c;
    let begin = this.p(u0);
    let end = this.p(u1);
    let ΔX = end.x - begin.x;
    let ΔY = end.y - begin.y;
    let Iworld = Δ * Ilocal + 0.5 * (Tx * ΔY - Ty * ΔX);
    return Iworld;
  }
}

export { Curve2Algo };