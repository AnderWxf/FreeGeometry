import { Matrix2, Vector2 } from '../../../../math/Math';
import type { BigNumber } from 'mathjs';
import type { Curve2Algo } from "../../base/Curve2Algo";
import { multiply as mul, add } from 'mathjs';
import type { InterOfCurve2, ValueOfBinary } from './Curve2Inter';

// 符号相反二分法递归细分
export function Bin(algor0: Curve2Algo, algor1: Curve2Algo, a: ValueOfBinary, b: ValueOfBinary, tol0: number, tol1: number, ret: InterOfCurve2): boolean {
  let maxg = Math.max(Math.abs(a.g), Math.abs(b.g));
  while (true) {
    let u = (a.u + b.u) * 0.5;
    let p = algor0.p(u);
    let g = algor1.g(p);
    // 一般方程返回值是0，则恰好是交点。
    if (Math.abs(g) <= tol1 || Math.abs(a.u - b.u) <= tol1 && a.p.distanceTo(b.p) <= tol0) {
      ret.p = p;
      ret.u0 = u;
      ret.u1 = algor1.u(p);
      return true;
    } else {
      //中间的参数带来了扩张的g值，说明没有跨过根，直接返回。
      if (Math.abs(g) / maxg > 10) {
        return false;
      }
      else if (a.g * g < 0) {
        b = { p, u, g };
      }
      else if (b.g * g < 0) {
        a = { p, u, g };
      }
    }
  }
}

/**
 * 用二分逼近在c0上寻找与c1的交点。
 * 在c0的参数空间内迭代。
 * 寻找一个c0的参数u0，使得c0.p(u0)在c1上，即满足c1的一般方程。
 * 误差小于tol时停止。
 * p0为c0上的初始猜测点。
 * 
 * @param {Curve2Algo} [c0] - The frist curve.
 * @param {Curve2Algo} [c1] - The second curve.
 * @param {number} [tol0] - The tolerance of geometric.
 * @param {number} [tol1] - The tolerance of algebraic.
 */
export function Binary(c0a: Curve2Algo, c1a: Curve2Algo, p0: InterOfCurve2, tol0: number, tol1: number): void {
  let ret = p0;
  let g = c1a.g(p0.p);
  let s = Math.log(Math.abs(g));
  let du = 0.75 * (s > 1 ? s : 1);
  let du_ = 0;
  let times = 0;

  while (true) {
    times++;
    ret.u0 += du;
    let u = ret.u0;
    let dp = c0a.p(u);
    let dg = c1a.g(dp);
    // 异号时，说明跨过了根，减小步长并反向
    if (g * dg < 0) {
      let a = { p: ret.p, u: ret.u0 - du, g: g };
      let b = { p: dp, u, g: dg };
      if (a.u < b.u) {
        Bin(c0a, c1a, a, b, tol0, tol1, ret);
      } else {
        Bin(c0a, c1a, b, a, tol0, tol1, ret);
      }
      break;
    }
    // 扩张时，反向
    else if (Math.abs(dg) > Math.abs(g)) {
      du = -du * 0.75;
    }
    // 收缩时
    // else if (Math.abs(dg) < Math.abs(g)) {
    //     // let s = Math.log(Math.abs(dg));
    //     // if (s > 1) {
    //     //     du = du * s;
    //     // }
    // }
    // 满足要求,找到了在c1上的点
    if (Math.abs(dg) <= tol1) {
      ret.p = dp;
      ret.u1 = c1a.u(dp);
      break;
    }
    // 迭代结果不变，认为已经收敛，或者du已经很小。
    else if (Math.abs(g - dg) <= tol1 && du_ == du || Math.abs(du) < 1e-15) {
      ret.p = dp;
      ret.u1 = c1a.u(dp);
      break;
    }
    else {
      g = dg;
      du_ = du;
    }
  }
  if (times > 100) {
    console.warn("times :" + times);
  } else {
    console.log("times :" + times);
  }
}

/**
 * 计算某点在曲线c上的偏微分
 * c是f(x,y)= Ax^2 + Bxy + Cy^2 + Dx + Ey + F= 0 的一般形式的系数。
 * @param {A,B,C,D,E,F} [c] - The curve.
 * @param {Vector2} [p] - The point. 
 */
export function Differential(c: { A: BigNumber, B: BigNumber, C: BigNumber, D: BigNumber, E: BigNumber, F: BigNumber }, p: Vector2): Vector2 {
  // F'x = 2Ax + By + D
  // F'y = Bx + 2Cy + E
  let dx = add(mul(c.A, p.x, 2), mul(c.B, p.y), c.D) as BigNumber;
  let dy = add(mul(c.B, p.x), mul(c.C, p.y, 2), c.E) as BigNumber;
  return new Vector2(dx.toNumber(), dy.toNumber());
}

/**
 * 计算某点在曲线c上的一般方程值
 * c是f(x,y)= Ax^2 + Bxy + Cy^2 + Dx + Ey + F= 0 的一般形式的系数。
 * @param {A,B,C,D,E,F} [c] - The curve.
 * @param {Vector2} [p] - The point. 
 */
export function General(c: { A: BigNumber, B: BigNumber, C: BigNumber, D: BigNumber, E: BigNumber, F: BigNumber }, p: Vector2): number {
  let g = add(mul(c.A, p.x, p.x), mul(c.B, p.x, p.y), mul(c.C, p.y, p.y), mul(c.D, p.x), mul(c.E, p.y), c.F) as BigNumber;
  return g.toNumber();
}

/**
 * 用牛顿下降法在c0上寻找与c1的交点。
 * 在c0的曲线上迭代。
 * 寻找一个c0上的一点p，使得p在c1上，满足c1的一般方程。
 * 误差小于tol时停止。
 * p0为c0上的初始猜测点。
 * 
 * @param {Curve2Algo} [c0a] - The frist curve.
 * @param {Curve2Algo} [c1a] - The second curve.
 * @param {number} [tol0] - The tolerance of geometric.
 * @param {number} [tol1] - The tolerance of algebraic.
 */
export function Newton(
  c0: { A: BigNumber, B: BigNumber, C: BigNumber, D: BigNumber, E: BigNumber, F: BigNumber },
  c1: { A: BigNumber, B: BigNumber, C: BigNumber, D: BigNumber, E: BigNumber, F: BigNumber },
  c0a: Curve2Algo,
  c1a: Curve2Algo,
  p: InterOfCurve2,
  tol0: number,
  tol1: number): void {
  let P = p.p;
  let f = c0a.g(P);
  let g = c1a.g(P);
  let fp = General(c0, P);
  let gp = General(c1, P);
  if (Math.abs(fp) <= tol1 && Math.abs(gp) <= tol1) {
    return;
  }
  while (true) {
    let df = Differential(c0, P);
    let dg = Differential(c1, P);
    let JP_ = new Matrix2();
    JP_.set(
      df.x, df.y,
      dg.x, dg.y
    );
    // 矩阵奇异，行列式≈0
    if (Math.abs(JP_.determinant()) <= tol1) {
      return;
    }
    JP_.invert();
    let FP = new Vector2(fp, gp);
    FP.applyMatrix2(JP_);
    if (FP.length() > 1 && Math.max(Math.abs(fp), Math.abs(gp)) < 1) {
      FP.normalize();
      // FP.multiplyScalar(0.1);
    }
    let P_ = P.clone();
    P_.sub(FP);
    // 目标点已经在c0上，从c0上取一点。
    if (Math.abs(f) <= tol1 && Math.abs(g) > tol1) {
      P_ = c0a.p(c0a.u(P_));
    }
    // 目标点已经在c1上，从c1上取一点。
    if (Math.abs(f) > tol1 && Math.abs(g) <= tol1) {
      P_ = c1a.p(c1a.u(P_));
    }
    let f_ = c0a.g(P_);
    let g_ = c1a.g(P_);
    // 已经满足要求
    if (Math.abs(f_) <= tol1 && Math.abs(g_) <= tol1) {
      P.set(P_.x, P_.y);
      return;
    }
    // 已经发生扩张了
    if (Math.abs(f) <= tol1 && Math.abs(g) > tol1) {
      if (Math.abs(g_) > Math.abs(g)) {
        return;
      }
    }
    // 已经发生扩张了
    if (Math.abs(f) > tol1 && Math.abs(g) <= tol1) {
      if (Math.abs(f_) > Math.abs(f)) {
        return;
      }
    }
    // 已经发生扩张了
    if (Math.abs(f) > tol1 && Math.abs(f_) > Math.abs(f)
      || Math.abs(g) > tol1 && Math.abs(g_) > Math.abs(g)) {
      return;
    }
    P.set(P_.x, P_.y);
    f = f_;
    g = g_;
    fp = General(c0, P);
    gp = General(c1, P);
  }
}

// 局部最小递归细分
export function Close(algor0: Curve2Algo, algor1: Curve2Algo, a: ValueOfBinary, du: number, tol0: number, tol1: number, ret: InterOfCurve2): boolean {
  let du_ = 0;
  while (true) {
    let u = a.u + du;
    let p = algor0.p(u);
    let g = algor1.g(p);
    // 一般方程返回值是0，则恰好是交点。
    if (Math.abs(g) <= tol1 || Math.abs(du) <= tol1 && a.p.distanceTo(p) <= tol0) {
      ret.p = p;
      ret.u0 = u;
      ret.u1 = algor1.u(p);
      return true;
    } else {
      // 符号相反
      if (a.g * g < 0) {
        return Bin(algor0, algor1, a, { p, u, g }, tol0, tol1, ret);
      }
      // 迭代结果不变，认为已经收敛，或者du已经很小。
      else if (Math.abs(g - a.g) <= tol1 || Math.abs(du) < 1e-15) {
        return false;
      }
      // 扩张时，反向
      else if (Math.abs(g) > Math.abs(a.g)) {
        du = -du * 0.75;
      }
      // 收缩时
      else if (Math.abs(g) < Math.abs(a.g)) {
        a.u = u;
        a.g = g;
        a.p = p;
      }
      else {
        a.g = g;
        du_ = du;
      }
    }
  }
}