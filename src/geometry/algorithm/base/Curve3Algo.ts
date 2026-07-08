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
  protected dat_: Curve3Data;
  public get dat(): Curve3Data {
    return this.dat_;
  }
  public set dat(dat: Curve3Data) {
    this.dat_ = dat;
  }
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

export { Curve3Algo };