import type { BigNumber } from '../../../../mathjs';
import { multiply as mul, add, unaryMinus as un, bignumber as big, subtract as sub, equal, largerEq, divide as div } from '../../../../mathjs';
import { Matrix2, Vector2 } from "../../../../math/Math";
import * as MATHJS from '../../../../mathjs';
import { Arc2Data } from "../../../data/base/curve2/Arc2Data";
import { Line2Data } from "../../../data/base/curve2/Line2Data";
import { Nurbs2Data } from "../../../data/base/curve2/Nurbs2Data";
import type { Curve2Data } from "../../../data/base/Curve2Data";
import { Arc2Algo } from "../../base/curve2/Arc2Algo";
import { Line2Algo } from "../../base/curve2/Line2Algo";
import { CurveBuilder } from "../../builder/CurveBuilder";
import { SolveEquation } from "../../base/SolveEquation";
import { Hyperbola2Data } from "../../../data/base/curve2/Hyperbola2Data";
import { Hyperbola2Algo } from "../../base/curve2/Hyperbola2Algo";
import { Parabola2Data } from "../../../data/base/curve2/Parabola2Data";
import { Parabola2Algo } from "../../base/curve2/Parabola2Algo";
import type { Curve2Algo } from "../../base/Curve2Algo";
import verb from 'verb-nurbs';
import { Nurbs2Algo } from '../../base/curve2/Nurbs2Algo';
import { Brep2Builder } from '../../builder/Brep2Builder';
import { Brep2Inter } from './Brep2Inter';
import { Face2Algo } from '../../brep/Brep2Algo';
// import { multiply } from 'mathjs';
// import * as SVD from "svd-js";

/**
 * compute curve intersection point utility.
 *
 */
export type InterOfCurve2 = {
  p: Vector2; // Position of intersection point.
  u0: number; // The u parameter of intersection point on curve0.
  u1: number; // The u parameter of intersection point on curve1.
}

/**
 * temp value of binary search.
 *
 */
type ValueOfBinary = {
  p: Vector2; // Position of curve0.
  u: number;  // The u of curve0.
  g: number;  // The g value of p on curve1.
}
class Curve2Inter {

  /**
   * compute line to line intersection point.
   *
   * @param {Line2Data} [c0] - The frist curve.
   * @param {Line2Data} [c1] - The second curve.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   * @param {number} [n] - The max number of intersection points.
   */
  static LineXLine(c0: Line2Data, c1: Line2Data, tol0: number, tol1: number, n: number = 1): Array<InterOfCurve2> {
    let ret = new Array<InterOfCurve2>();
    if (Math.abs(c0.trans.rot - c1.trans.rot) % Math.PI === 0) {
      return ret;
    }

    let c0a = new Line2Algo(c0);
    let c1a = new Line2Algo(c1);
    // 获取一般方程参数
    let { A: A0, B: B0, C: C0 } = c0a.ge();
    let { A: A1, B: B1, C: C1 } = c1a.ge();
    let c0_ = un(C0);
    let c1_ = un(C1);

    // 克莱姆法则求解方程组
    // A0x + B0y + C0 = 0
    // A1x + B2y + C1 = 0
    let det = MATHJS.det([[A0, B0], [A1, B1]]);
    let detx = MATHJS.det([[c0_, B0], [c1_, B1]]);
    let dety = MATHJS.det([[A0, c0_], [A1, c1_]]);

    let x = div(detx, det);
    let y = div(dety, det);

    if (typeof x === 'object') {
      x = (x as BigNumber).toNumber();
    }
    if (typeof y === 'object') {
      y = (y as BigNumber).toNumber();
    }
    let p = new Vector2(x, y);

    let u0 = c0a.u(p);
    let u1 = c1a.u(p);
    ret.push({ p, u0, u1 });
    return ret;
  }

  /**
   * compute line to arc intersection point.
   *
   * @param {Line2Data} [c0] - The frist curve.
   * @param {Arc2Data} [c1] - The second curve.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   * @param {number} [n] - The max number of intersection points.
   */
  static LineXArc(c0: Line2Data, c1: Arc2Data, tol0: number, tol1: number, n: number = 2): Array<InterOfCurve2> {
    let ret = new Array<InterOfCurve2>();
    // 直线的二元一次方程
    // A0x + B0y + C0 = 0
    let c0a = new Line2Algo(c0);
    // 曲线的二元二次方程
    // A1x² + B1xy + C1y² + D1x + E1y + F1 = 0 (2)
    let c1a = new Arc2Algo(c1);
    // 求解方程组
    return Curve2Inter.LineXConic(c0a.ge(), c1a.ge(), c0a, c1a, tol0, tol1, n);
  }

  /**
   * compute line to arc intersection point.
   *
   * @param {Line2Data} [c0] - The frist curve.
   * @param {Arc2Data} [c1] - The second curve.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   * @param {number} [n] - The max number of intersection points.
   */
  static LineXHyperbola(c0: Line2Data, c1: Hyperbola2Data, tol0: number, tol1: number, n: number = 2): Array<InterOfCurve2> {
    let ret = new Array<InterOfCurve2>();
    // 直线的二元一次方程
    // A0x + B0y + C0 = 0
    let c0a = new Line2Algo(c0);
    // 曲线的二元二次方程
    // A1x² + B1xy + C1y² + D1x + E1y + F1 = 0 (2)
    let c1a = new Hyperbola2Algo(c1);
    return Curve2Inter.LineXConic(c0a.ge(), c1a.ge(), c0a, c1a, tol0, tol1, n);
  }

  /**
   * compute line to arc intersection point.
   *
   * @param {Line2Data} [c0] - The frist curve.
   * @param {Arc2Data} [c1] - The second curve.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   * @param {number} [n] - The max number of intersection points.
   */
  static LineXParabola(c0: Line2Data, c1: Parabola2Data, tol0: number, tol1: number, n: number = 2): Array<InterOfCurve2> {
    let ret = new Array<InterOfCurve2>();
    // 直线的二元一次方程
    // A0x + B0y + C0 = 0
    let c0a = new Line2Algo(c0);
    // 曲线的二元二次方程
    // A1x² + B1xy + C1y² + D1x + E1y + F1 = 0 (2)
    let c1a = new Parabola2Algo(c1);
    return Curve2Inter.LineXConic(c0a.ge(), c1a.ge(), c0a, c1a, tol0, tol1, n);
  }

  /**
   * compute line to arc intersection point.
   *
   * @param {Line2Data} [c0] - The frist curve.
   * @param {Arc2Data} [c1] - The second curve.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   * @param {number} [n] - The max number of intersection points.
   */
  static LineXConic(c0: { A: BigNumber, B: BigNumber, C: BigNumber },
    c1: { A: BigNumber, B: BigNumber, C: BigNumber, D: BigNumber, E: BigNumber, F: BigNumber },
    c0a: Curve2Algo,
    c1a: Curve2Algo,
    tol0: number,
    tol1: number,
    n: number = 2,
  ): Array<InterOfCurve2> {

    let ret = new Array<InterOfCurve2>();
    // 直线的二元一次方程
    // A0x + B0y + C0 = 0
    let { A: A0, B: B0, C: C0 } = c0;
    // 曲线的二元二次方程
    // A1x² + B1xy + C1y² + D1x + E1y + F1 = 0 (2)
    let { A: A1, B: B1, C: C1, D: D1, E: E1, F: F1 } = c1;

    console.log('=== LineXConic 调试 ===');
    console.log('直线:', `A0=${A0.toNumber()}, B0=${B0.toNumber()}, C0=${C0.toNumber()}`);
    console.log('二次曲线:', `A1=${A1.toNumber()}, B1=${B1.toNumber()}, C1=${C1.toNumber()}, D1=${D1.toNumber()}, E1=${E1.toNumber()}, F1=${F1.toNumber()}`);

    const ZERO = big(0);
    // 求解方程组
    // A0x + B0y + C0 = 0 (1) 
    // A1x² + B1xy + C1y² + D1x + E1y + F1 = 0 (2)
    // (1) >> x = (-C0 - B0y) / A0 带入方程（2）
    if (!equal(A0, ZERO) && !equal(B0, ZERO)) {
      // 关于x的方程 Ax² + Bx + C = 0
      // A​ = A1 B0² - B1 A0 B0 + C1 A0²​
      // B =-B1​ B0​ C0​ + 2C1​ A0​ C0 + D1​ B0²​ - E1 A0 B0​
      // C​ = C1​ C0²​ - E1​ B0​ C0​ + F1​ B0²​
      let A = add(
        mul(A1, B0, B0),
        un(mul(B1, A0, B0)),
        mul(C1, A0, A0)
      ) as BigNumber;
      let B = add(
        un(mul(B1, B0, C0)),
        mul(C1, A0, C0, 2),
        mul(D1, B0, B0),
        un(mul(E1, A0, B0))
      ) as BigNumber;
      let C = add(
        mul(C1, C0, C0),
        un(mul(E1, B0, C0)),
        mul(F1, B0, B0)
      ) as BigNumber;

      console.log('二次方程系数:', `A=${A.toNumber()}, B=${B.toNumber()}, C=${C.toNumber()}`);
      let xs = SolveEquation.SolveQuadraticEquation(A, B, C);
      console.log(`解出的 x : ${xs}`);
      for (let i = 0; i < xs.length; i++) {
        let xi = xs[i];
        let x: BigNumber;
        if (MATHJS.typeOf(xi) === 'Complex') {
          xi = xi as MATHJS.Complex;
          if (Math.abs(xi.im) > tol0) {
            continue;
          }
          x = big(xi.re);
        }
        if (MATHJS.typeOf(xi) === 'BigNumber') {
          x = xi as BigNumber;
        }
        // y= -(A0/B0​)x − C0/B0​ ​ = - (xA0 + c0)/B0
        let y = un(div(add((mul(x, A0)), C0), B0)) as BigNumber;
        let p = new Vector2(x.toNumber(), y.toNumber());
        let u0 = c0a?.u(p);
        let u1 = c1a?.u(p);
        ret.push({ p, u0, u1 });
      }
    } else if (!equal(A0, ZERO) && equal(B0, ZERO)) {
      // 关于y的方程 A0x + B0y + C0 = 0 >> x = -C0/A0
      let x = un(div(C0, A0)) as BigNumber;
      // 带入二次方程得到关于y的方程
      // A1x² + B1xy + C1y² + D1x + E1y + F1 = 0             
      // A​ = C1
      // B = B1x + E1​
      // C​ = A1x²​ + D1x + F1​
      let A = C1 as BigNumber;
      let B = add(
        mul(B1, x),
        E1
      ) as BigNumber;
      let C = add(
        mul(A1, x, x),
        mul(D1, x),
        F1) as BigNumber;
      console.log('二次方程系数:', `A=${A.toNumber()}, B=${B.toNumber()}, C=${C.toNumber()}`);
      let ys = SolveEquation.SolveQuadraticEquation(A, B, C);
      console.log(`解出的 y : ${ys}`);
      for (let i = 0; i < ys.length; i++) {
        let yi = ys[i];
        let y: BigNumber;
        if (MATHJS.typeOf(yi) === 'Complex') {
          yi = yi as MATHJS.Complex;
          if (Math.abs(yi.im) > tol0) {
            continue;
          }
          y = big(yi.re);
        }
        if (MATHJS.typeOf(yi) === 'BigNumber') {
          y = yi as BigNumber;
        }
        let p = new Vector2(x.toNumber(), y.toNumber());
        let u0 = c0a?.u(p);
        let u1 = c1a?.u(p);
        ret.push({ p, u0, u1 });
      }
    } else if (equal(A0, ZERO) && !equal(B0, ZERO)) {
      // 关于y的方程 A0x + B0y + C0 = 0 >> y = -C0/B0
      let y = un(div(C0, B0)) as BigNumber;
      // 带入二次方程得到关于x的方程
      // A1x² + B1xy + C1y² + D1x + E1y + F1 = 0 
      // A​ = A1​
      // B = B1y + D1​
      // C​ = C1y²​ + E1y + F1​
      let A = A1 as BigNumber;
      let B = add(
        mul(B1, y),
        D1) as BigNumber;
      let C = add(
        mul(C1, y, y),
        mul(E1, y),
        F1) as BigNumber;
      console.log('二次方程系数:', `A=${A.toNumber()}, B=${B.toNumber()}, C=${C.toNumber()}`);
      let xs = SolveEquation.SolveQuadraticEquation(A, B, C);
      console.log(`解出的 x : ${xs}`);
      for (let i = 0; i < xs.length; i++) {
        let xi = xs[i];
        let x: BigNumber;
        if (MATHJS.typeOf(xi) === 'Complex') {
          xi = xi as MATHJS.Complex;
          if (Math.abs(xi.im) > tol0) {
            continue;
          }
          x = big(xi.re);
        }
        if (MATHJS.typeOf(xi) === 'BigNumber') {
          x = xi as BigNumber;
        }
        let p = new Vector2(x.toNumber(), y.toNumber());
        let u0 = c0a?.u(p);
        let u1 = c1a?.u(p);
        ret.push({ p, u0, u1 });
      }
    }
    return ret;
  }

  /**
   * compute line to nurbs intersection point.
   *
   * @param {Line2Data} [c0] - The frist curve.
   * @param {Nurbs2Data} [c1] - The second curve.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   * @param {number} [n] - The max number of intersection points.
   */
  static LineXNurbs(c0: Line2Data, c1: Nurbs2Data, tol0: number, tol1: number, n: number = -1): Array<InterOfCurve2> {
    let segment = c1.controls.length * c1.degree * 2;
    return Curve2Inter.SwapU(Curve2Inter.CurveXCurve(c1, c0, segment, tol0, tol1, n));
  }

  /**
   * compute arc to arc intersection point.
   *
   * @param {Arc2Data} [c0] - The frist curve.
   * @param {Arc2Data} [c1] - The second curve.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   * @param {number} [n] - The max number of intersection points.
   */
  static QuadraticXQuadratic(c0: Arc2Data | Hyperbola2Data | Parabola2Data, c1: Arc2Data | Hyperbola2Data | Parabola2Data, tol0: number, tol1: number, n: number = 4): Array<InterOfCurve2> {
    if (c0 instanceof Arc2Data && c1 instanceof Arc2Data) {
      if (c0.trans.pos.distanceTo(c1.trans.pos) > Math.max(c0.radius.x, c0.radius.y) + Math.max(c1.radius.x, c1.radius.y)) {
        return new Array<InterOfCurve2>();
      }
      if (c0.trans.pos.distanceTo(c1.trans.pos) < Math.min(c0.radius.x, c0.radius.y) - Math.max(c1.radius.x, c1.radius.y)) {
        return new Array<InterOfCurve2>();
      }
      if (c0.trans.pos.distanceTo(c1.trans.pos) < Math.min(c1.radius.x, c1.radius.y) - Math.max(c0.radius.x, c0.radius.y)) {
        return new Array<InterOfCurve2>();
      }
      if (c0.trans.pos.distanceTo(c1.trans.pos) < tol0 && c0.radius.x == c0.radius.y && c1.radius.x == c1.radius.y) {
        return new Array<InterOfCurve2>();
      }
      // if (Math.max(c0.radius.x, c0.radius.y) > Math.max(c1.radius.x, c1.radius.y)) {
      //   return Curve2Inter.SwapU(Curve2Inter.CurveXCurve(c1, c0, Math.round(Math.max(c1.radius.x, c1.radius.y) * Math.PI * 2), tol0, tol1, n, 0, Math.PI * 2));
      // } else {
      //   return Curve2Inter.CurveXCurve(c0, c1, Math.round(Math.max(c0.radius.x, c0.radius.y) * Math.PI * 2), tol0, tol1, n, 0, Math.PI * 2);
      // }
    }
    // if (c0 instanceof Arc2Data) {
    //   if (c0.radius.x > c0.radius.y) {
    //     return Curve2Inter.CurveXCurve(c0, c1, Math.round(c0.radius.x * Math.PI * 2), tol0, tol1, n, 0, Math.PI * 2);
    //   } else {
    //     return Curve2Inter.CurveXCurve(c0, c1, Math.round(c0.radius.y * Math.PI * 2), tol0, tol1, n, 0, Math.PI * 2);
    //   }
    // }
    // if (c1 instanceof Arc2Data) {
    //   if (c1.radius.x > c1.radius.y) {
    //     return Curve2Inter.SwapU(Curve2Inter.CurveXCurve(c1, c0, Math.round(c1.radius.x * Math.PI * 2), tol0, tol1, n, 0, Math.PI * 2));
    //   } else {
    //     return Curve2Inter.SwapU(Curve2Inter.CurveXCurve(c1, c0, Math.round(c1.radius.y * Math.PI * 2), tol0, tol1, n, 0, Math.PI * 2));
    //   }
    // }
    let c0a = CurveBuilder.Algorithm2ByData(c0) as Arc2Algo | Hyperbola2Algo | Parabola2Algo;
    let c1a = CurveBuilder.Algorithm2ByData(c1) as Arc2Algo | Hyperbola2Algo | Parabola2Algo;

    // if (c0a instanceof Hyperbola2Algo || c0a instanceof Parabola2Algo
    //     && c1a instanceof Hyperbola2Algo || c1a instanceof Parabola2Algo
    // ) {
    //     let c0a_ = c0a as Hyperbola2Algo | Parabola2Algo;
    //     let c1a_ = c1a as Hyperbola2Algo | Parabola2Algo
    //     let ns0 = c0a_.vernurbs();
    //     let ns1 = c1a_.vernurbs();
    //     let ret = new Array<InterOfCurve2>();
    //     for (let i = 0; i < ns0.length; i++) {
    //         let nurbs0 = ns0[i];
    //         for (let j = 0; j < ns1.length; j++) {
    //             let nurbs1 = ns1[j];
    //             verb.eval.Intersect.curves(nurbs0._data, nurbs1._data, tol0).forEach((inter: any) => {
    //                 let p = new Vector2(inter.point0[0], inter.point0[1]);
    //                 ret.push({ p, u0: inter.u1, u1: inter.u2 });
    //             });
    //         }
    //     }
    //     return ret;
    // }

    // return Curve2Inter.ConicXConicMatrixPencil(c0a.ge(), c1a.ge(), c0a, c1a, tol0, tol1, n);
    return Curve2Inter.ConicXConicResultant(c0a.ge(), c1a.ge(), c0a, c1a, tol0, tol1, n);
  }

  /**
   * compute arc to arc intersection point.
   *
   * @param {Arc2Data} [c0] - The frist curve.
   * @param {Arc2Data} [c1] - The second curve.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   * @param {number} [n] - The max number of intersection points.
   */
  static QuadraticXNurbs(c0: Arc2Data | Hyperbola2Data | Parabola2Data, c1: Nurbs2Data, tol0: number, tol1: number, n: number = -1): Array<InterOfCurve2> {
    let segment = c1.controls.length * c1.degree * 2;
    return Curve2Inter.SwapU(Curve2Inter.CurveXCurve(c1, c0, segment, tol0, tol1, n));
  }

  /**
   * compute arc to arc intersection point.
   * 结式方法
   * 结式方法是求解两个多项式方程组的经典代数方法。对于两条二次曲线：
   * F1(x,y) = Ax^2 + Bxy + Cy^2 + Dx + Ey + F = 0 
   * F2(x,y) = Ax^2 + Bxy + Cy^2 + Dx + Ey + F = 0 
   * 将y 视为参数，x 视为变量，计算两个多项式关于 x 的结式（Resultant）：
   * R(y) = Resx(F1,F2) 得到关于 y 的四次方程：
   * R(y) = R4y^4 + R3y^3 + R2y^2 + R1y + R0 = 0
   * 解四次方程，得到 4 个 y 值回代求 x，得到 4 个交点
   * 验证 候选点在两条曲线上，并去重。
   * @param {Arc2Data} [c0] - The frist curve.
   * @param {Arc2Data} [c1] - The second curve.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   * @param {number} [n] - The max number of intersection points.
   */
  static ConicXConicResultant(
    c0: { A: BigNumber, B: BigNumber, C: BigNumber, D: BigNumber, E: BigNumber, F: BigNumber },
    c1: { A: BigNumber, B: BigNumber, C: BigNumber, D: BigNumber, E: BigNumber, F: BigNumber },
    c0a: Curve2Algo,
    c1a: Curve2Algo,
    tol0: number,
    tol1: number,
    n: number = 4
  ): Array<InterOfCurve2> {
    let isExist = (p: Vector2): boolean => {
      let isExist = false;
      for (let k = 0; k < ret.length; k++) {
        let exist = ret[k];
        if (p.distanceTo(exist.p) < tol0) {
          isExist = true;
          break;
        }
      }
      return isExist;
    }
    // 6. 验证 候选点在两条曲线上，并去重。
    let checkAndPush = (inters: Array<InterOfCurve2>) => {
      for (let j = 0; j < inters.length; j++) {
        let inter = inters[j];
        if (isExist(inter.p)) {
          continue
        }
        let g0 = c0a.g(inter.p);
        let g1 = c1a.g(inter.p);
        if (Math.abs(g0) < tol1 && Math.abs(g1) < tol1) {
          inter.u0 = c0a.u(inter.p); inter.u1 = c1a.u(inter.p);
          ret.push(inter);
        }
        else if (Math.abs(g0) < tol1 /*&& Math.abs(g1) < 1*/) {
          inter.u0 = c0a.u(inter.p);
          // Curve2Inter.Binary(c0a, c1a, inter, tol0, tol1);
          Curve2Inter.Newton(c0, c1, c0a, c1a, inter, tol0, tol1);
          g0 = c0a.g(inter.p);
          g1 = c1a.g(inter.p);
          if (Math.abs(g0) < tol1 && Math.abs(g1) < tol1) {
            if (!isExist(inter.p)) {
              inter.u0 = c0a.u(inter.p); inter.u1 = c1a.u(inter.p);
              ret.push(inter);
            }

          }
        }
        else if (Math.abs(g1) < tol1 /*&& Math.abs(g0) < 1*/) {
          inter.u0 = c1a.u(inter.p);
          // Curve2Inter.Binary(c1a, c0a, inter, tol0, tol1);
          Curve2Inter.Newton(c0, c1, c0a, c1a, inter, tol0, tol1);
          g0 = c0a.g(inter.p);
          g1 = c1a.g(inter.p);
          if (Math.abs(g0) < tol1 && Math.abs(g1) < tol1) {
            if (!isExist(inter.p)) {
              inter.u0 = c0a.u(inter.p); inter.u1 = c1a.u(inter.p);
              ret.push(inter);
            }
          }
        }
        else {
          // console.log("Error: g0 " + format(g0) + " g1 " + format(g1));
        }
      }
    }

    let ret = new Array<InterOfCurve2>();

    // 1. 构造对称矩阵 ( A1, A2 ) 表示两条二次曲线。
    let a_1 = c0.A, b_1 = c0.B, c_1 = c0.C, d_1 = c0.D, e_1 = c0.E, f_1 = c0.F;
    let a_2 = c1.A, b_2 = c1.B, c_2 = c1.C, d_2 = c1.D, e_2 = c1.E, f_2 = c1.F;
    console.log(`曲线参数 c0 a_1:${a_1.toNumber()}, b_1:${b_1.toNumber()}, c_1:${c_1.toNumber()}, d_1:${d_1.toNumber()}, e_1:${e_1.toNumber()}, f_1:${f_1.toNumber()}`);
    console.log(`曲线参数 c1 a_2:${a_2.toNumber()}, b_2:${b_2.toNumber()}, c_2:${c_2.toNumber()}, d_2:${d_2.toNumber()}, e_2:${e_2.toNumber()}, f_2:${f_2.toNumber()}`);
    // 计算中间变量
    // const ΔD = a_1 * c_2 - a_2 * c_1;
    // const ΔE = a_1 * e_2 - a_2 * e_1;
    // const ΔF = a_1 * f_2 - a_2 * f_1;
    // const αE = a_1 * b_2 - a_2 * b_1;
    // const βE = a_1 * d_2 - a_2 * d_1;
    // const αF = b_1 * c_2 - b_2 * c_1;
    // const βF = b_1 * e_2 + d_1 * c_2 - b_2 * e_1 - d_2 * c_1;
    // const γF = b_1 * f_2 + d_1 * e_2 - b_2 * f_1 - d_2 * e_1;
    // const δF = d_1 * f_2 - d_2 * f_1;
    // 计算 R4, R3, R2, R1, R0
    // const R4 = ΔD * ΔD - αE * αF;
    // const R3 = 2 * ΔD * ΔE - (αE * βF + βE * αF);
    // const R2 = ΔE * ΔE + 2 * ΔD * ΔF - (αE * γF + βE * βF);
    // const R1 = 2 * ΔE * ΔF - (αE * δF + βE * γF);
    // const R0 = ΔF * ΔF - βE * δF;    
    // 计算中间变量
    const ΔD = sub(mul(a_1, c_2), mul(a_2, c_1));
    const ΔE = sub(mul(a_1, e_2), mul(a_2, e_1));
    const ΔF = sub(mul(a_1, f_2), mul(a_2, f_1));
    const αE = sub(mul(a_1, b_2), mul(a_2, b_1));
    const βE = sub(mul(a_1, d_2), mul(a_2, d_1));
    const αF = sub(mul(b_1, c_2), mul(b_2, c_1));
    const βF = sub(sub(add(mul(b_1, e_2), mul(d_1, c_2)), mul(b_2, e_1)), mul(d_2, c_1));
    const γF = sub(sub(add(mul(b_1, f_2), mul(d_1, e_2)), mul(b_2, f_1)), mul(d_2, e_1));
    const δF = sub(mul(d_1, f_2), mul(d_2, f_1));

    // 计算 R4, R3, R2, R1, R0
    const R4 = sub(mul(ΔD, ΔD), mul(αE, αF)) as BigNumber;
    const R3 = sub(mul(ΔD, ΔE, 2), add(mul(αE, βF), mul(βE, αF))) as BigNumber;
    const R2 = sub(add(mul(ΔE, ΔE), mul(ΔD, ΔF, 2)), add(mul(αE, γF), mul(βE, βF))) as BigNumber;
    const R1 = sub(mul(ΔE, ΔF, 2), add(mul(αE, δF), mul(βE, γF))) as BigNumber;
    const R0 = sub(mul(ΔF, ΔF), mul(βE, δF)) as BigNumber;

    // 解四次方程
    console.log(`四次方程 R4 y^4 + R3 y^3 + R2 y^2 + R1 y + R0 => R4:${R4.toNumber()}, R3:${R3.toNumber()}, R2:${R2.toNumber()}, R1:${R1.toNumber()}, R0:${R0.toNumber()}`);
    let begin = new Date();
    const Rs = SolveEquation.SolveQuarticNumberical(R4, R3, R2, R1, R0, big(tol1 * 0.01));
    console.log(`四次方程根 Rs: ${Rs[0]}, ${Rs[1]}, ${Rs[2]}, ${Rs[3]}`);
    let end0 = new Date();
    console.log(`Time Rs: ${end0.getTime() - begin.getTime()}`);
    // const Rs1 = SolveEquation.SolveQuarticNerdamer(R4, R3, R2, R1, R0);
    // let end1 = new Date();
    // console.log(`四次方程根 Rs1: ${Rs1[0]}, ${Rs1[1]}, ${Rs1[2]}, ${Rs1[3]}`);
    // console.log(`Time Rs1: ${end1.getTime() - end0.getTime()}`);
    for (let i = 0; i < Rs.length; i++) {
      if (ret.length >= n) {
        break;
      }
      let y: BigNumber = null;
      let R = Rs[i];
      if (MATHJS.typeOf(R) === "Complex") {
        // if (MATHJS.abs((R as MATHJS.Complex).im) > tol0) {
        //   continue;
        // } else {
        y = big((R as MATHJS.Complex).re);
        // }
      } else {
        y = R as BigNumber;
      }
      if (y === null) {
        continue;
      }

      // y 代入 F1(x, y) = 0，得到关于 x 的二次方程
      // A1*x² + B1*x + C1 = 0
      // const A1 = a1;
      // const B1 = b1 * y + d1;
      // const C1 = c1 * y * y + e1 * y + f1;      
      const A1 = a_1;
      const B1 = add(mul(b_1, y), d_1) as BigNumber;
      const C1 = add(mul(c_1, y, y), mul(e_1, y), f_1) as BigNumber;
      console.log(`二次方程 A1*x² + B1*x + C1 = 0 => A1:${A1.toNumber()}, B1:${B1.toNumber()}, C1:${C1.toNumber()}`);
      const Xs1 = SolveEquation.SolveQuadraticEquation(A1, B1, C1);
      console.log(`二次方程根 Xs1: ${Xs1[0]}, ${Xs1[1]}`);
      let inters = new Array<InterOfCurve2>();
      let intersX1 = new Array<Vector2>();
      let intersX2 = new Array<Vector2>();
      for (let j = 0; j < Xs1.length; j++) {
        let x: BigNumber = null;
        let X = Xs1[j];
        if (MATHJS.typeOf(X) === "Complex") {
          if (MATHJS.abs((X as MATHJS.Complex).im) > tol0) {
            continue;
          } else {
            x = big((X as MATHJS.Complex).re);
          }
        } else {
          x = X as BigNumber;
        }
        if (x === null) {
          continue;
        }
        intersX1.push(new Vector2(x.toNumber(), y.toNumber()));
      }
      // y F2(x, y) = 0，得到关于 x 的二次方程
      // A2*x² + B2*x + C2 = 0
      // const A2 = a2;
      // const B2 = b2 * y + d2;
      // const C2 = c2 * y * y + e2 * y + f2;
      const A2 = a_2;
      const B2 = add(mul(b_2, y), d_2) as BigNumber;
      const C2 = add(mul(c_2, y, y), mul(e_2, y), f_2) as BigNumber;
      console.log(`二次方程 A2*x² + B2*x + C2 = 0 => A2:${A2.toNumber()}, B2:${B1.toNumber()}, C2:${C2.toNumber()}`);
      const Xs2 = SolveEquation.SolveQuadraticEquation(A2, B2, C2);
      console.log(`二次方程根 Xs2: ${Xs2[0]}, ${Xs2[1]}`);
      for (let j = 0; j < Xs2.length; j++) {
        let x: BigNumber = null;
        let X = Xs2[j];
        if (MATHJS.typeOf(X) === "Complex") {
          if (MATHJS.abs((X as MATHJS.Complex).im) > tol0) {
            continue;
          } else {
            x = big((X as MATHJS.Complex).re);
          }
        } else {
          x = X as BigNumber;
        }
        if (x === null) {
          continue;
        }
        intersX2.push(new Vector2(x.toNumber(), y.toNumber()));
      }

      // // 两个关于x的二次方程结果都存在的才是交点
      // for (let j = intersX1.length - 1; j > -1; j--) {
      //   let p1 = intersX1[j];
      //   let isFound = false;
      //   for (let k = intersX2.length - 1; k > -1; k--) {
      //     let p2 = intersX2[k];
      //     if (p1.distanceTo(p2) < tol0) {
      //       inters.push({ p: p1, u0: null, u1: null });
      //       intersX2.splice(k, 1);
      //       isFound = true;
      //       break;
      //     }
      //   }
      //   if (isFound) {
      //     intersX1.splice(j, 1);
      //   }
      // }
      for (let j = 0; j < intersX1.length; j++) {
        let p1 = intersX1[j];
        inters.push({ p: p1, u0: null, u1: null });
      }
      for (let j = 0; j < intersX2.length; j++) {
        let p2 = intersX2[j];
        inters.push({ p: p2, u0: null, u1: null });
      }
      console.log(`结式多项式计算的未验证交点 :`);
      for (let j = 0; j < inters.length; j++) {
        console.log(`Point${j} , x:${inters[j].p.x} ,y:${inters[j].p.y} , u0:${inters[j].u0},u1:${inters[j].u1}`);
      }
      checkAndPush(inters);
      if (ret.length >= n) {
        break;
      }
    }

    console.log(`结式多项式计算的已验证交点 :`);
    for (let i = 0; i < ret.length; i++) {
      console.log(`Point${i} , x:${ret[i].p.x} ,y:${ret[i].p.y} , u0:${ret[i].u0},u1:${ret[i].u1}`);
    }
    return ret;
  }
  /**
   * compute arc to arc intersection point.
   * 1. 构造对称矩阵 ( A1, A2 ) 表示两条二次曲线。
   * 2. 解广义特征值问题 (det(A1 + λA2) = 0)，得到 λ（最多三个）。
   * 3. 对每个 λ 构造 ( B = A1 + λ A2 )。
   * 4. 分解 B 为两条直线。
   * 5. 每条直线与原二次曲线之一求交（解二次方程），得到候选交点。
   * 6. 验证 候选点在两条曲线上，并去重。
   * @param {Arc2Data} [c0] - The frist curve.
   * @param {Arc2Data} [c1] - The second curve.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   * @param {number} [n] - The max number of intersection points.
   */
  static ConicXConicMatrixPencil(
    c0: { A: BigNumber, B: BigNumber, C: BigNumber, D: BigNumber, E: BigNumber, F: BigNumber },
    c1: { A: BigNumber, B: BigNumber, C: BigNumber, D: BigNumber, E: BigNumber, F: BigNumber },
    c0a: Curve2Algo,
    c1a: Curve2Algo,
    tol0: number,
    tol1: number,
    n: number = 4
  ): Array<InterOfCurve2> {
    let isExist = (p: Vector2): boolean => {
      let isExist = false;
      for (let k = 0; k < ret.length; k++) {
        let exist = ret[k];
        if (p.distanceTo(exist.p) < tol0) {
          isExist = true;
          break;
        }
      }
      return isExist;
    }
    // 6. 验证 候选点在两条曲线上，并去重。
    let checkAndPush = (inters: Array<InterOfCurve2>) => {
      for (let j = 0; j < inters.length; j++) {
        let inter = inters[j];
        if (isExist(inter.p)) {
          continue
        }
        let g0 = c0a.g(inter.p);
        let g1 = c1a.g(inter.p);
        if (Math.abs(g0) < tol1 && Math.abs(g1) < tol1) {
          inter.u0 = c0a.u(inter.p); inter.u1 = c1a.u(inter.p);
          ret.push(inter);
        }
        else if (Math.abs(g0) < tol1) {
          inter.u0 = c0a.u(inter.p);
          Curve2Inter.Binary(c0a, c1a, inter, tol0, tol1);
          g0 = c0a.g(inter.p);
          g1 = c1a.g(inter.p);
          if (Math.abs(g0) < tol1 && Math.abs(g1) < tol1) {
            if (!isExist(inter.p)) {
              inter.u0 = c0a.u(inter.p); inter.u1 = c1a.u(inter.p);
              ret.push(inter);
            }

          }
        }
        else if (Math.abs(g1) < tol1) {
          inter.u0 = c1a.u(inter.p);
          Curve2Inter.Binary(c1a, c0a, inter, tol0, tol1);
          g0 = c0a.g(inter.p);
          g1 = c1a.g(inter.p);
          if (Math.abs(g0) < tol1 && Math.abs(g1) < tol1) {
            if (!isExist(inter.p)) {
              inter.u0 = c0a.u(inter.p); inter.u1 = c1a.u(inter.p);
              ret.push(inter);
            }
          }
        }
        else {
          // console.log("Error: g0 " + format(g0) + " g1 " + format(g1));
        }
      }
    }

    let ret = new Array<InterOfCurve2>();

    // 1. 构造对称矩阵 ( A1, A2 ) 表示两条二次曲线。
    let a_1 = c0.A, b_1 = c0.B, c_1 = c0.C, d_1 = c0.D, e_1 = c0.E, f_1 = c0.F;
    let a_2 = c1.A, b_2 = c1.B, c_2 = c1.C, d_2 = c1.D, e_2 = c1.E, f_2 = c1.F;

    let A_1 = Curve2Inter.QuadraticMatrix(c0);
    let A_2 = Curve2Inter.QuadraticMatrix(c1);

    //2. 解广义特征值问题 (det(A1 + λA2) = 0)，得到 λ（最多三个）。
    // det(A_1 + λ A_2) = C_3 λ^3 + C_2 λ^2 + C_1 λ + C_0 = 0
    // C_0 = a_1 c_1 f_1 
    //     + (b_1 d_1 e_1)/4 
    //     - (a_1 e_1^2 + c_1 d_1^2 + f_1 b_1^2)/4
    const C_0 = add(
      mul(a_1, c_1, f_1),
      mul(b_1, d_1, e_1, 0.25),
      mul(add(mul(a_1, e_1, e_1), mul(c_1, d_1, d_1), mul(f_1, b_1, b_1)), -0.25),
    ) as BigNumber;
    // C_3 = a_2 c_2 f_2 
    //    + (b_2 d_2 e_2)/4 
    //    - (a_2 e_2^2 + c_2 d_2^2 + f_2 b_2^2)/4
    const C_3 = add(
      mul(a_2, c_2, f_2),
      mul(b_2, d_2, e_2, 0.25),
      mul(add(mul(a_2, e_2, e_2), mul(c_2, d_2, d_2), mul(f_2, b_2, b_2)), -0.25),
    ) as BigNumber;
    // C_1 =   (c_1 f_1 - e_1^2/4) a_2 
    //       + (a_1 f_1 - d_1^2/4) c_2 
    //       + (a_1 c_1 - b_1^2/4) f_2 
    //       + ((b_1 f_1 - (d_1 e_1)/2) b_2 0.5
    //       + ((b_1 e_1)/2 - c_1 d_1) d_2 0.5
    //       + ((a_1 e_1 - (b_1 d_1)/2) e_2 0.5        
    const C_1 = add(
      mul(add(mul(c_1, f_1), mul(e_1, e_1, -0.25)), a_2),
      mul(add(mul(a_1, f_1), mul(d_1, d_1, -0.25)), c_2),
      mul(add(mul(a_1, c_1), mul(b_1, b_1, -0.25)), f_2),
      mul(add(mul(b_1, f_1), mul(d_1, e_1, -0.5)), b_2, 0.5),
      mul(add(mul(b_1, e_1, 0.5), mul(c_1, d_1, -1)), d_2, 0.5),
      mul(add(mul(a_1, e_1), mul(b_1, d_1, -0.5)), e_2, 0.5),
    ) as BigNumber;
    // C_2 =   (c_2 f_2 - e_2^2/4) a_1 
    //       + (a_2 f_2 - d_2^2/4) c_1 
    //       + (a_2 c_2 - b_2^2/4) f_1 
    //       + ((b_2 f_2 - (d_2 e_2)/2) b_1 0.5
    //       + ((b_2 e_2)/2 - c_2 d_2) d_1 0.5
    //       + ((a_2 e_2 - (b_2 d_2)/2) e_1 0.5
    const C_2 = add(
      mul(add(mul(c_2, f_2), mul(e_2, e_2, -0.25)), a_1),
      mul(add(mul(a_2, f_2), mul(d_2, d_2, -0.25)), c_1),
      mul(add(mul(a_2, c_2), mul(b_2, b_2, -0.25)), f_1),
      mul(add(mul(b_2, f_2), mul(d_2, e_2, -0.5)), b_1, 0.5),
      mul(add(mul(b_2, e_2, 0.5), mul(c_2, d_2, -1)), d_1, 0.5),
      mul(add(mul(a_2, e_2), mul(b_2, d_2, -0.5)), e_1, 0.5),
    ) as BigNumber;

    // const C3 = bignumber(1);
    // const C2 = div(C_2, C_3) as BigNumber;
    // const C1 = div(C_1, C_3) as BigNumber;
    // const C0 = div(C_0, C_3) as BigNumber;

    console.log(`曲线c0参数：a_1:${a_1.toNumber()}, b_1:${b_1.toNumber()}, c_1:${c_1.toNumber()}, d_1:${d_1.toNumber()}, e_1:${e_1.toNumber()}, f_1:${f_1.toNumber()}`);
    console.log(`曲线c1参数：a_2:${a_2.toNumber()}, b_2:${b_2.toNumber()}, c_2:${c_2.toNumber()}, d_2:${d_2.toNumber()}, e_2:${e_2.toNumber()}, f_2:${f_2.toNumber()}`);

    //3. 对每个 λ 构造 ( B = A1 + λ A2 )。
    console.log(`C_3 λ^3 + C_2 λ^2 + C_1 λ + C_0=> C_3:${C_3.toNumber()}, C_2:${C_2.toNumber()}, C_1:${C_1.toNumber()}, C_0:${C_0.toNumber()}`);
    const λs = SolveEquation.SolveCubicNumberical(C_3, C_2, C_1, C_0);
    console.log(`特征值 λs: ${λs[0]}, ${λs[1]}, ${λs[2]}`);
    for (let i = 0; i < λs.length; i++) {
      if (ret.length >= n) {
        break;
      }
      let λ = λs[i];
      if (MATHJS.typeOf(λ) === "Complex") {
        continue;
      }
      if (i > 0 && λ == λs[i - 1]) {
        continue;
      }
      let B = new Array<Array<BigNumber>>(3);
      let row0 = new Array<BigNumber>(3);
      let row1 = new Array<BigNumber>(3);
      let row2 = new Array<BigNumber>(3);
      row0[0] = add(A_1[0][0], mul(λ, A_2[0][0])) as BigNumber;
      row0[1] = add(A_1[0][1], mul(λ, A_2[0][1])) as BigNumber;
      row0[2] = add(A_1[0][2], mul(λ, A_2[0][2])) as BigNumber;
      row1[0] = add(A_1[1][0], mul(λ, A_2[1][0])) as BigNumber;
      row1[1] = add(A_1[1][1], mul(λ, A_2[1][1])) as BigNumber;
      row1[2] = add(A_1[1][2], mul(λ, A_2[1][2])) as BigNumber;
      row2[0] = add(A_1[2][0], mul(λ, A_2[2][0])) as BigNumber;
      row2[1] = add(A_1[2][1], mul(λ, A_2[2][1])) as BigNumber;
      row2[2] = add(A_1[2][2], mul(λ, A_2[2][2])) as BigNumber;

      B[0] = row0;
      B[1] = row1;
      B[2] = row2;

      // 4. 分解 B 为两条直线
      let isSVD = false;
      let isEigs = true;
      // 特征值分解
      if (isEigs && ret.length < n) {
        // console.log("特征值分解");
        const eigenvectors = MATHJS.eigs(B, { precision: 1e-25, eigenvectors: true }).eigenvectors;
        // 按特征值的绝对值降序排列
        eigenvectors.sort((a, b): number => {
          let va = MATHJS.abs(a.value) as BigNumber;
          let vb = MATHJS.abs(b.value) as BigNumber;
          return MATHJS.compare(vb, va) as number;
        });


        let λ0 = eigenvectors[0].value as BigNumber;
        let λ1 = eigenvectors[1].value as BigNumber;
        let λ2 = eigenvectors[2].value as BigNumber;

        let rank = 0;
        rank += MATHJS.abs(λ0).toNumber() > tol0 ? 1 : 0;
        rank += MATHJS.abs(λ1).toNumber() > tol0 ? 1 : 0;
        rank += MATHJS.abs(λ2).toNumber() > tol0 ? 1 : 0;

        console.log(`特征值 λ0 λ1 λ2: ${λ0.toNumber()}, ${λ1.toNumber()}, ${λ2.toNumber()}`);
        console.log(`矩阵的秩 rank: ${rank}`);

        // // 🔥 检查是否为零特征值（用于零空间向量法）
        // const zeroIdx = eigenvectors.reduce((min, ev, idx) => {
        //   const val = MATHJS.abs(ev.value);
        //   return val < MATHJS.abs(eigenvectors[min].value) ? idx : min;
        // }, 0);

        // // 如果零特征值对应的向量给出实交点
        // const nullVec = eigenvectors[zeroIdx].vector as Array<BigNumber>;
        // const W = nullVec[2];
        // if (MATHJS.abs(W).toNumber() > 1e-10) {
        //   const x = div(nullVec[0], W) as BigNumber;
        //   const y = div(nullVec[1], W) as BigNumber;
        //   console.log(`零空间交点: (${x}, ${y})`);

        //   let inters = new Array<InterOfCurve2>();
        //   inters.push({ p: new Vector2(x.toNumber(), y.toNumber()), u0: 0, u1: 0 });
        //   checkAndPush(inters);
        //   // 如果已经找到足够的点，可以 break
        //   if (ret.length >= n) break;
        // }

        let u = eigenvectors[0].vector as Array<BigNumber>;
        let v = eigenvectors[1].vector as Array<BigNumber>;
        let w = eigenvectors[1].vector as Array<BigNumber>;
        console.log(`特征值向量 v0: ${u}`);
        console.log(`特征值向量 v1: ${v}`);
        console.log(`特征值向量 v2: ${w}`);

        // 虚数特征值跳过
        if (MATHJS.typeOf(λ0) === 'Complex' || MATHJS.typeOf(λ1) === 'Complex') {
          continue
        }
        // λ0 * λ1 < 0 两个实数特征值
        if (!largerEq(mul(λ0, λ1), 0)) {
          let λ0_sqrt = MATHJS.sqrt(MATHJS.abs(λ0)) as BigNumber;
          let λ1_sqrt = MATHJS.sqrt(MATHJS.abs(λ1)) as BigNumber;

          let p = mul(u, λ0_sqrt) as BigNumber[];
          let q = mul(v, λ1_sqrt) as BigNumber[];
          if (!MATHJS.largerEq(λ1, 0)) {
            q = un(q);
          }
          let l0 = add(p, q) as BigNumber[];
          let l1 = sub(p, q) as BigNumber[];

          // 5. 每条直线与原二次曲线之一求交（解二次方程），得到候选交点。
          console.log(`l0: ${l0[0].toNumber()} ${l0[1].toNumber()} ${l0[2].toNumber()}`);
          let l = l0;
          let inters = Curve2Inter.LineXConic({ A: l[0], B: l[1], C: l[2] }, c0, null, c0a, tol0, tol1, 2);
          console.log(`inters.length : ${inters.length}`);
          if (inters.length > 0) console.log(`inters: ${inters[0].p.x} ${inters[0].p.y}`);
          if (inters.length > 1) console.log(`inters: ${inters[1].p.x} ${inters[1].p.y}`);
          checkAndPush(inters);
          if (ret.length >= n) {
            break;
          }
          inters = Curve2Inter.LineXConic({ A: l[0], B: l[1], C: l[2] }, c1, null, c1a, tol0, tol1, 2);
          console.log(`inters.length : ${inters.length}`);
          if (inters.length > 0) console.log(`inters: ${inters[0].p.x} ${inters[0].p.y}`);
          if (inters.length > 1) console.log(`inters: ${inters[1].p.x} ${inters[1].p.y}`);
          checkAndPush(inters);
          if (ret.length >= n) {
            break;
          }
          console.log(`l1: ${l1[0].toNumber()} ${l1[1].toNumber()} {${l1[2].toNumber()}`);
          l = l1;
          inters = Curve2Inter.LineXConic({ A: l[0], B: l[1], C: l[2] }, c0, null, c0a, tol0, tol1, 2);
          console.log(`inters.length : ${inters.length}`);
          if (inters.length > 0) console.log(`inters: ${inters[0].p.x} ${inters[0].p.y}`);
          if (inters.length > 1) console.log(`inters: ${inters[1].p.x} ${inters[1].p.y}`);
          checkAndPush(inters);
          if (ret.length >= n) {
            break;
          }
          inters = Curve2Inter.LineXConic({ A: l[0], B: l[1], C: l[2] }, c1, null, c1a, tol0, tol1, 2);
          console.log(`inters.length : ${inters.length}`);
          if (inters.length > 0) console.log(`inters: ${inters[0].p.x} ${inters[0].p.y}`);
          if (inters.length > 1) console.log(`inters: ${inters[1].p.x} ${inters[1].p.y}`);
          checkAndPush(inters);
          if (ret.length >= n) {
            break;
          }
        }
      }
    }

    return ret;
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
  static totaltimes = 0;
  static Binary(
    c0a: Curve2Algo,
    c1a: Curve2Algo,
    p0: InterOfCurve2,
    tol0: number,
    tol1: number): void {
    let ret = p0;
    let g = c1a.g(p0.p);
    let s = Math.log(Math.abs(g));
    let du = 0.75 * (s > 1 ? s : 1);
    let du_ = 0;
    let times = 0;

    // 符号相反二分法递归细分
    let bin = (a: ValueOfBinary, b: ValueOfBinary) => {
      let maxg = Math.max(Math.abs(a.g), Math.abs(b.g));
      while (true) {
        times++;
        let u = (a.u + b.u) * 0.5;
        let p = c0a.p(u);
        let g = c1a.g(p);
        // 一般方程返回值是0，则恰好是交点。
        if (Math.abs(g) < tol1 /*|| Math.abs(a.u - b.u) < tol1 && a.p.distanceTo(b.p) < tol0*/) {
          ret.p = p;
          ret.u0 = u;
          ret.u1 = c1a.u(p);
          break;
        } else {
          //中间的参数带来了扩张的g值，说明没有跨过根，直接返回。
          if (Math.abs(g) / maxg > 10) {
            break;
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
          bin(a, b);
        } else {
          bin(b, a);
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
      if (Math.abs(dg) < tol1) {
        ret.p = dp;
        ret.u1 = c1a.u(dp);
        break;
      }
      // 迭代结果不变，认为已经收敛，或者du已经很小。
      else if (Math.abs(g - dg) < tol1 && du_ == du || Math.abs(du) < 1e-15) {
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
    Curve2Inter.totaltimes += times;
  }

  /**
   * 计算某点在曲线c上的偏微分
   * c是f(x,y)= Ax^2 + Bxy + Cy^2 + Dx + Ey + F= 0 的一般形式的系数。
   * @param {A,B,C,D,E,F} [c] - The curve.
   * @param {Vector2} [p] - The point. 
   */
  static Differential(c: { A: BigNumber, B: BigNumber, C: BigNumber, D: BigNumber, E: BigNumber, F: BigNumber }, p: Vector2): Vector2 {
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
  static General(c: { A: BigNumber, B: BigNumber, C: BigNumber, D: BigNumber, E: BigNumber, F: BigNumber }, p: Vector2): number {
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
  static Newton(
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
    let fp = Curve2Inter.General(c0, P);
    let gp = Curve2Inter.General(c1, P);
    if (Math.abs(fp) < tol1 && Math.abs(gp) < tol1) {
      return;
    }
    while (true) {
      let df = Curve2Inter.Differential(c0, P);
      let dg = Curve2Inter.Differential(c1, P);
      let JP_ = new Matrix2();
      JP_.set(
        df.x, df.y,
        dg.x, dg.y
      );
      // 矩阵奇异，行列式≈0
      if (Math.abs(JP_.determinant()) < tol1) {
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
      if (Math.abs(f) < tol1 && Math.abs(g) > tol1) {
        P_ = c0a.p(c0a.u(P_));
      }
      // 目标点已经在c1上，从c1上取一点。
      if (Math.abs(f) > tol1 && Math.abs(g) < tol1) {
        P_ = c1a.p(c1a.u(P_));
      }
      let f_ = c0a.g(P_);
      let g_ = c1a.g(P_);
      // 已经满足要求
      if (Math.abs(f_) < tol1 && Math.abs(g_) < tol1) {
        P.set(P_.x, P_.y);
        return;
      }
      // 已经发生扩张了
      if (Math.abs(f) < tol1 && Math.abs(g) > tol1) {
        if (Math.abs(g_) > Math.abs(g)) {
          return;
        }
      }
      // 已经发生扩张了
      if (Math.abs(f) > tol1 && Math.abs(g) < tol1) {
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
      fp = Curve2Inter.General(c0, P);
      gp = Curve2Inter.General(c1, P);
    }
  }

  // 构建二次型矩阵
  static QuadraticMatrix(c: { A: BigNumber, B: BigNumber, C: BigNumber, D: BigNumber, E: BigNumber, F: BigNumber }): Array<Array<BigNumber>> {
    let A = new Array<Array<BigNumber>>(3);
    let row0 = new Array<BigNumber>(3);
    let row1 = new Array<BigNumber>(3);
    let row2 = new Array<BigNumber>(3);
    row0[0] = c.A;
    row0[1] = mul(c.B, 0.5) as BigNumber;
    row0[2] = mul(c.D, 0.5) as BigNumber;
    row1[0] = mul(c.B, 0.5) as BigNumber;
    row1[1] = c.C;
    row1[2] = mul(c.E, 0.5) as BigNumber;
    row2[0] = mul(c.D, 0.5) as BigNumber;
    row2[1] = mul(c.E, 0.5) as BigNumber;
    row2[2] = c.F;
    A[0] = row0;
    A[1] = row1;
    A[2] = row2;
    return A;
  }

  /**
   * compute arc to nurbs intersection point.
   *
   * @param {Arc2Data} [c0] - The frist curve.
   * @param {Nurbs2Data} [c1] - The second curve.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   * @param {number} [n] - The max number of intersection points.
   */
  static ArcXNurbs(c0: Arc2Data, c1: Nurbs2Data, tol0: number, tol1: number, n: number = 2): Array<InterOfCurve2> {
    let segment = c1.controls.length * 2;
    return Curve2Inter.SwapU(Curve2Inter.CurveXCurve(c1, c0, segment, tol0, tol1, n));
  }

  /**
   * compute nurbs to nurbs intersection point.
   *
   * @param {Nurbs2Data} [c0] - The frist curve.
   * @param {Nurbs2Data} [c1] - The second curve.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   * @param {number} [n] - The max number of intersection points.
   */
  static NurbsXNurbs(c0: Nurbs2Data, c1: Nurbs2Data, tol0: number, tol1: number, n: number = -1): Array<InterOfCurve2> {
    if (1) {
      // // 先判断两条nurbs的凸包是否相交，如果不相交，则直接返回空
      // let algor0 = new Nurbs2Algo(c0);
      // let algor1 = new Nurbs2Algo(c1);
      // let pos0 = new Array<Vector2>();
      // let pos1 = new Array<Vector2>();
      // let m0 = c0.trans.makeLocalMatrix();
      // let m1 = c1.trans.makeLocalMatrix();
      // for (let i = 0; i < algor0.dat.controls.length; i++) {
      //   let p = new Vector2(algor0.dat.controls[i].x, algor0.dat.controls[i].y);
      //   p.applyMatrix3(m0);
      //   pos0.push(p);
      // }
      // for (let i = 0; i < algor1.dat.controls.length; i++) {
      //   let p = new Vector2(algor1.dat.controls[i].x, algor1.dat.controls[i].y);
      //   p.applyMatrix3(m1);
      //   pos1.push(p);
      // }
      // let polygon0 = new Face2Algo(Brep2Builder.BuildPolygonFace(pos0));
      // let polygon1 = new Face2Algo(Brep2Builder.BuildPolygonFace(pos1));
      // if (Brep2Inter.FaceXFace(polygon0, polygon1, tol0, tol1).length == 0) {
      //   return [];
      // }
      if (c0.controls.length <= c1.controls.length) {
        let segment = c0.controls.length * 2;
        return Curve2Inter.CurveXCurve(c0, c1, segment, tol0, tol1, n);
      } else {
        let segment = c1.controls.length * 2;
        return Curve2Inter.SwapU(Curve2Inter.CurveXCurve(c1, c0, segment, tol0, tol1, n));
      }
    } else {
      // 使用verb求交，算法结果不稳定，精度只能稳定在1e-7左右。
      let ret = new Array<InterOfCurve2>();
      let algor0 = new Nurbs2Algo(c0);
      let algor1 = new Nurbs2Algo(c1);

      let verb0 = algor0.getVernurbs();
      let verb1 = algor1.getVernurbs();

      let inters0 = verb.eval.Intersect.curves(verb0._data, verb1._data, tol0);
      let inters1 = verb.eval.Intersect.curves(verb0._data, verb1._data, tol0);
      let inters2 = verb.eval.Intersect.curves(verb0._data, verb1._data, tol0);
      let inters = verb.eval.Intersect.curves(verb0._data, verb1._data, tol0);
      inters.forEach((inter: any) => {
        let p = new Vector2(inter.point0[0], inter.point0[1]);
        let u0 = inter.u0;
        let u1 = inter.u1;
        ret.push({ p, u0, u1 });
      });
      return ret;
    }
  }

  /**
   * compute curve to curve intersection point.
   * 此函数使用交叉逼近的方式获得近似解，适用于圆锥曲线间的求交计算无法处理的情况。
   *
   * @param {Curve2Data} [c0] - The frist curve , binary search curve.
   * @param {Curve2Data} [c1] - The second curve , general equation curve.
   * @param {number} [segment] - The segment of frist curve.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   * @param {number} [n] - The max number of intersection points.
   * @param {number} [u0] - The min u number of frist curve.
   * @param {number} [u1] - The max u number of frist curve.
   */
  public static CurveXCurve(c0: Curve2Data, c1: Curve2Data, segment: number, tol0: number, tol1: number, n: number = -1, u0: number = 0, u1: number = 1): Array<InterOfCurve2> {
    let algor0 = CurveBuilder.Algorithm2ByData(c0);
    let algor1 = CurveBuilder.Algorithm2ByData(c1);
    let ret = new Array<InterOfCurve2>();
    let ps = new Array<ValueOfBinary>();

    // 计算初始的g值
    for (let i = 0; i <= segment; i++) {
      let u = (u1 - u0) * i / segment;
      let p = algor0.p(u);
      let g = algor1.g(p);
      ps.push({ u, p, g });
    }
    let times = 0;
    // 符号相反二分法递归细分
    let bin = (a: ValueOfBinary, b: ValueOfBinary) => {
      let maxg = Math.max(Math.abs(a.g), Math.abs(b.g));
      while (true) {
        times++;
        let u = (a.u + b.u) * 0.5;
        let p = algor0.p(u);
        let g = algor1.g(p);
        // 一般方程返回值是0，则恰好是交点。
        if (Math.abs(g) < tol1 || Math.abs(a.u - b.u) < tol1 && a.p.distanceTo(b.p) < tol0) {
          ret.push({ p: p, u0: u, u1: algor1.u(p) });
          break;
        } else {
          //中间的参数带来了扩张的g值，说明没有跨过根，直接返回。
          if (Math.abs(g) / maxg > 10) {
            break;
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

    // 局部最小递归细分
    let close = (a: ValueOfBinary, du: number) => {
      let du_ = 0;
      while (true) {
        times++;
        let u = a.u + du;
        let p = algor0.p(u);
        let g = algor1.g(p);
        // 一般方程返回值是0，则恰好是交点。
        if (Math.abs(g) < tol1 /*|| Math.abs(du) < tol1 && a.p.distanceTo(p) < tol0*/) {
          ret.push({ p: p, u0: u, u1: algor1.u(p) });
          break;
        } else {
          // 符号相反
          if (a.g * g < 0) {
            bin(a, { p, u, g });
            break;
          }
          // 迭代结果不变，认为已经收敛，或者du已经很小。
          else if (Math.abs(g - a.g) < tol1 || Math.abs(du) < 1e-15) {
            break;
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

    // 查找g值为0的点，g值符号相反的点，g值局部最小的点。
    for (let i = 0; i < ps.length; i++) {
      let pre = i > 0 ? ps[i - 1] : undefined;
      let cur = ps[i - 0];
      let nex = i < ps.length - 1 ? ps[i + 1] : undefined;
      // g值是0，则恰好是交点。
      if (Math.abs(cur.g) < tol1) {
        ret.push({ p: cur.p, u0: cur.u, u1: algor1.u(cur.p) });
        continue;
      }
      // 与前一个符号相反，则至少一个交点在这个区间内。
      if (pre?.g * cur?.g < 0) {
        bin(pre, cur);
        continue;
      }
      // 与后一个符号相反，直接跳过
      if (cur?.g * nex?.g < 0) {
        continue;
      }
      // 起点局部最小，附近可能有交点。
      if (i == 0) {
        let curg = Math.abs(cur.g);
        let nexg = Math.abs(nex.g);
        if (curg < nexg) {
          close(cur, (u1 - u0) / segment);
        }
        continue;
      }
      // 终点局部最小，附近可能有交点。
      else if (i == ps.length - 1) {
        let preg = Math.abs(pre.g);
        let curg = Math.abs(cur.g);
        if (curg < preg) {
          close(cur, (u1 - u0) / segment);
        }
        continue;
      }
      else {
        // 中部局部最小，附近可能有交点。
        let preg = Math.abs(pre.g);
        let curg = Math.abs(cur.g);
        let nexg = Math.abs(nex.g);
        if (curg < preg && curg < nexg) {
          close(cur, (u1 - u0) / segment);
          continue;
        }
      }
    }
    // 去重
    ret.sort((a: InterOfCurve2, b: InterOfCurve2): number => {
      if (a.u0 < b.u0) {
        return -1;
      }
      if (a.u0 > b.u0) {
        return 1;
      }
      if (a.u1 < b.u1) {
        return -1;
      }
      if (a.u1 > b.u1) {
        return 1;
      }
      return 0;
    });
    for (let i = ret.length - 1; i > 0; i--) {
      for (let j = 0; j < i; j++) {
        if (ret[i].p.distanceTo(ret[j].p) < tol0) {
          ret.splice(i, 1);
          break;
        }
      }
    }

    if (times > 100) {
      console.warn("times :" + times);
    } else {
      console.log("times :" + times);
    }
    Curve2Inter.totaltimes += times;
    // 数量超出理论上限，曲线是重合的
    if (n != -1 && ret.length > n) {
      return [];
    }
    return ret;
  }

  /**
   * compute curve to curve intersection point.
   *
   * @param {Curve2Data} [c0] - The frist curve.
   * @param {Curve2Data} [c1] - The second curve.
   * @param {number} [tol0] - The tolerance of geometric.
   * @param {number} [tol1] - The tolerance of algebraic.
   */
  public static X(c0: Curve2Data, c1: Curve2Data, tol0: number, tol1: number): Array<InterOfCurve2> {
    let inters: Array<InterOfCurve2> = [];
    if (c0 instanceof Line2Data) {
      if (c1 instanceof Line2Data) {
        inters.push(...Curve2Inter.LineXLine(c0, c1, tol0, tol1));
      }
      else if (c1 instanceof Arc2Data) {
        inters.push(...Curve2Inter.LineXArc(c0, c1, tol0, tol1));
      }
      else if (c1 instanceof Hyperbola2Data) {
        inters.push(...Curve2Inter.LineXHyperbola(c0, c1, tol0, tol1));
      }
      else if (c1 instanceof Parabola2Data) {
        inters.push(...Curve2Inter.LineXParabola(c0, c1, tol0, tol1));
      }
      else if (c1 instanceof Nurbs2Data) {
        inters.push(...Curve2Inter.LineXNurbs(c0, c1, tol0, tol1));
      }
    }
    else if (c1 instanceof Line2Data) {
      if (c0 instanceof Arc2Data) {
        inters.push(...Curve2Inter.SwapU(Curve2Inter.LineXArc(c1, c0, tol0, tol1)));
      }
      else if (c0 instanceof Hyperbola2Data) {
        inters.push(...Curve2Inter.SwapU(Curve2Inter.LineXHyperbola(c1, c0, tol0, tol1)));
      }
      else if (c0 instanceof Parabola2Data) {
        inters.push(...Curve2Inter.SwapU(Curve2Inter.LineXParabola(c1, c0, tol0, tol1)));
      }
      else if (c0 instanceof Nurbs2Data) {
        inters.push(...Curve2Inter.SwapU(Curve2Inter.LineXNurbs(c1, c0, tol0, tol1)));
      }
    }
    else if (c0 instanceof Arc2Data || c0 instanceof Hyperbola2Data || c0 instanceof Parabola2Data) {
      if (c1 instanceof Arc2Data || c1 instanceof Hyperbola2Data || c1 instanceof Parabola2Data) {
        inters.push(...Curve2Inter.QuadraticXQuadratic(c0, c1, tol0, tol1, 4));
      }
      else if (c1 instanceof Nurbs2Data) {
        inters.push(...Curve2Inter.QuadraticXNurbs(c0, c1, tol0, tol1));
      }
    }
    else if (c1 instanceof Arc2Data || c1 instanceof Hyperbola2Data || c1 instanceof Parabola2Data) {
      if (c0 instanceof Nurbs2Data) {
        inters.push(...Curve2Inter.SwapU(Curve2Inter.QuadraticXNurbs(c1, c0, tol0, tol1)));
      }
    }
    else if (c0 instanceof Nurbs2Data && c1 instanceof Nurbs2Data) {
      inters.push(...Curve2Inter.NurbsXNurbs(c0, c1, tol0, tol1));
    }
    return inters;
  }

  /**
   * swap u of curve to curve intersection point.
   *
   * @param {InterOfCurve2} [inters] - The intersection of curve to curve.
   */
  private static SwapU(inters: Array<InterOfCurve2>): Array<InterOfCurve2> {
    inters.forEach((inter) => {
      let temp = inter.u0;
      inter.u0 = inter.u1;
      inter.u1 = temp;
    });
    return inters;
  }
}

export { Curve2Inter };
