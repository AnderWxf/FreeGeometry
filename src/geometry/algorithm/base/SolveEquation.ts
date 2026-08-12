import type { BigNumber } from '../../../mathjs';
import { multiply as mul, add, unaryMinus as un, bignumber as big, subtract as sub, equal, largerEq, divide as div, abs } from '../../../mathjs';
import * as MATHJS from '../../../mathjs';
import { PI2, PI4, PI_4 } from '../../../math/MathUtils';

class SolveEquation {

  /**
   * 使用MATHJS.js求解一元二次方程
   * @param {number} a - 二次项系数
   * @param {number} b - 一次项系数  
   * @param {number} c - 常数项
   * @returns {Object} 解的结果
   */
  static SolveQuadraticEquation(a_: number | BigNumber, b_: number | BigNumber, c_: number | BigNumber, tol1: BigNumber = big(1e-12)): Array<MATHJS.Complex | BigNumber> {
    let roots = new Array<MATHJS.Complex | BigNumber>();
    let a = big(a_);
    let b = big(b_);
    let c = big(c_);
    const ZERO = big(0);
    // 输入验证
    if (abs(a).lessThanOrEqualTo(tol1)) {
      // 这不是一元二次方程（a不能为0）, 解一元一次方程 bx + c = 0
      if (abs(b).lessThanOrEqualTo(tol1)) {
        // 这不是一元一次方程（b不能为0）
        return roots;
      }
      const root = div(un(c), b) as BigNumber;
      roots.push(root);
      return roots;
    }
    let _b = un(b);
    let _2a = mul(a, 2);
    // 计算判别式
    const Δ = sub(mul(b, b), mul(a, c, 4)) as BigNumber;

    if (MATHJS.larger(Δ, ZERO)) {
      // 两个不等实根
      const sqrtΔ = MATHJS.sqrt(Δ);
      const root1 = div(MATHJS.add(_b, sqrtΔ), _2a) as BigNumber;
      const root2 = div(sub(_b, sqrtΔ), _2a) as BigNumber;
      roots.push(root1, root2);
    } else if (abs(sub(Δ, ZERO)).lessThanOrEqualTo(tol1)) {
      // 两个相等实根
      const root = div(_b, _2a) as BigNumber;
      roots = [root, root];
    } else {
      // 两个共轭复根
      const realPart = div(_b, _2a) as BigNumber;
      const imaginaryPart = div(MATHJS.sqrt(un(Δ)), _2a) as BigNumber;
      roots.push(MATHJS.complex(realPart.toNumber(), imaginaryPart.toNumber()), MATHJS.complex(realPart.toNumber(), un(imaginaryPart).toNumber()));
    }
    return roots;
  }
  static testExecQuadraticSolver(a: number, b: number, c: number) {
    let str =
      (a >= 0 ? '   ' + a + 'x²' : ' - ' + (-a) + 'x²') +
      (b >= 0 ? ' + ' + b + 'x ' : ' - ' + (-b) + 'x ') +
      (c >= 0 ? ' + ' + c + '  ' : ' - ' + (-c) + '  ');
    const numbericals = SolveEquation.SolveQuadraticEquation(a, b, c);
    let mean2 = big(0);
    // console.log('解析式法解:', numbericals);
    if (numbericals) {
      numbericals.forEach(root => {
        const v = MATHJS.add(
          MATHJS.add(
            mul(MATHJS.pow(root, 2), a),
            mul(root, b)),
          c);
        // console.log('验证: x = ' + MATHJS.format(root, { precision: 20 }) + ' => ' + str + ' = ' + MATHJS.format(v, { precision: 20 }));
        mean2 = MATHJS.add(mean2, abs(v)) as BigNumber;
      });
      mean2 = div(mean2, numbericals.length) as BigNumber;
    } else {
      mean2 = big(Infinity);
    }
    if (!mean2.lessThanOrEqualTo(1e-10)) {
      console.warn(str + ' = 0' + ' 解析法平均距离 Mean2:', MATHJS.format(mean2, { precision: 20 }));
    }
    return false;
  }
  // /**
  //  * 使用MATHJS.js求解一元三次方程
  //  * @param {number} a - 三次项系数
  //  * @param {number} b - 二次项系数
  //  * @param {number} c - 一次项系数
  //  * @param {number} d - 常数项
  //  * @returns {Object} 解的结果
  //  */
  // static SolveCubicNumberical0(a_: number | BigNumber, b_: number | BigNumber, c_: number | BigNumber, d_: number | BigNumber): Array<MATHJS.Complex | BigNumber> {
  //   let a = big(a_);
  //   let b = big(b_);
  //   let c = big(c_);
  //   let d = big(d_);
  //   // 输入验证
  //   if (a.equals(0)) {
  //     // 这不是一元三次方程（a不能为0），解一元二次方程 bx² + cx + d = 0
  //     let roots = SolveEquation.SolveQuadraticEquation(b, c, d);
  //     return roots;
  //   }

  //   // 将方程化为简化形式: x³ + px² + qx + r = 0
  //   const p = div(b, a) as BigNumber;
  //   const q = div(c, a) as BigNumber;
  //   const r = div(d, a) as BigNumber;
  //   const p_3 = div(p, 3) as BigNumber;

  //   // 进一步化为 depressed cubic: t³ + pt + q = 0 (通过代换 x = t - p/3)

  //   //depressedP = q - MATHJS.pow(p, 2) / 3;
  //   const depressedP = MATHJS.add(q, mul(p, p), -1 / 3) as BigNumber;
  //   //depressedQ = (2 * MATHJS.pow(p, 3)) / 27 - (p * q) / 3 + r
  //   const depressedQ = MATHJS.add(
  //     mul(mul(p, p, p, 2), 1 / 27),
  //     mul(p, q, -1 / 3),
  //     r) as BigNumber;

  //   // 计算判别式
  //   //Δ = MATHJS.pow(depressedQ / 2, 2) + MATHJS.pow(depressedP / 3, 3)
  //   const depressedQ_2 = mul(depressedQ, 0.5) as BigNumber;
  //   const depressedP_3 = mul(depressedP, 1 / 3) as BigNumber;

  //   const Δ = MATHJS.add(
  //     mul(depressedQ_2, depressedQ_2),
  //     mul(depressedP_3, depressedP_3, depressedP_3)) as BigNumber;

  //   // Δ = 18bcd−4b^3d + b^2c^2 − 4c^3 − 27d^2
  //   let Δ = MATHJS.add(
  //     mul(b, c, d, 18),
  //     mul(b, b, b, d, -4),
  //     mul(b, b, c, c),
  //     mul(c, c, c, -4),
  //     mul(d, d, -27),
  //   )

  //   let roots = new Array<MATHJS.Complex | BigNumber>();
  //   if (MATHJS.larger(Δ, 0)) {
  //     // 一个实根，两个共轭复根
  //     // const u = MATHJS.cubeRoot(-depressedQ / 2 + MATHJS.sqrt(Δ));
  //     // const v = MATHJS.cubeRoot(-depressedQ / 2 - MATHJS.sqrt(Δ));      

  //     const dep_ = un(depressedQ_2);//-depressedQ / 2
  //     const sqrt_ = MATHJS.sqrt(Δ);
  //     const u = MATHJS.cbrt(MATHJS.add(dep_, sqrt_));
  //     const v = MATHJS.cbrt(sub(dep_, sqrt_));

  //     //u + v - p / 3
  //     const realRoot = MATHJS.add(u, v, -p_3) as BigNumber;
  //     //-(u + v) / 2 - p / 3
  //     const realPart = MATHJS.add(mul(MATHJS.add(u, v), -0.5), -p_3) as BigNumber;
  //     //(u - v) * MATHJS.sqrt(3) / 2
  //     const imaginaryPart = mul(sub(u, v), mul(MATHJS.sqrt(3), 0.5)) as BigNumber;
  //     const complexRoot1 = MATHJS.complex(realPart.toNumber(), imaginaryPart.toNumber());
  //     const complexRoot2 = MATHJS.complex(realPart.toNumber(), -imaginaryPart.toNumber());
  //     roots.push(realRoot, complexRoot1, complexRoot2);

  //   } else if (equal(Δ, 0)) {
  //     // 三个实根（至少两个相等）
  //     // const u = MATHJS.cubeRoot(-depressedQ / 2);
  //     // const root1 = 2 * u - p / 3;
  //     // const root2 = -u - p / 3;
  //     // const root3 = -u - p / 3;            
  //     const u = MATHJS.cbrt(un(depressedQ_2));//-depressedQ / 2
  //     const root1 = MATHJS.add(mul(u, 2), -p_3) as BigNumber;//2 * u - p / 3
  //     const root2 = MATHJS.add(un(u), -p_3) as BigNumber; //-u - p / 3;
  //     const root3 = root2; //-u - p / 3;

  //     roots.push(root1, root2, root3);
  //   } else {
  //     // 三个不等实根（需要三角函数解）
  //     // const r = MATHJS.sqrt(MATHJS.pow(-depressedP / 3, 3));
  //     // const theta = MATHJS.acos(-depressedQ / (2 * r));
  //     // const root1 = 2 * MATHJS.cubeRoot(r) * MATHJS.cos(theta / 3) - p / 3;
  //     // const root2 = 2 * MATHJS.cubeRoot(r) * MATHJS.cos((theta + 2 * MATHJS.pi) / 3) - p / 3;
  //     // const root3 = 2 * MATHJS.cubeRoot(r) * MATHJS.cos((theta + 4 * MATHJS.pi) / 3) - p / 3;

  //     const r = MATHJS.sqrt(MATHJS.pow(un(depressedP_3), 3) as BigNumber);
  //     let angle = div(depressedQ, mul(r, -2)) as BigNumber;
  //     angle = MATHJS.max(big(-1), MATHJS.min(big(1), angle));
  //     const theta = MATHJS.acos(angle);

  //     const theta_3 = div(theta, 3) as BigNumber;
  //     const r_2_3 = mul(MATHJS.cbrt(r), 2) as BigNumber;
  //     const pi_2 = MATHJS.add(big(MATHJS.pi), big(MATHJS.pi)) as BigNumber;
  //     const pi_4 = MATHJS.add(pi_2, pi_2) as BigNumber;

  //     const root1 = MATHJS.add(mul(r_2_3, MATHJS.cos(theta_3)), -p_3) as BigNumber;
  //     const root2 = MATHJS.add(mul(r_2_3, MATHJS.cos(div(MATHJS.add(theta, pi_2), 3) as BigNumber)), -p_3) as BigNumber;
  //     const root3 = MATHJS.add(mul(r_2_3, MATHJS.cos(div(MATHJS.add(theta, pi_4), 3) as BigNumber)), -p_3) as BigNumber;
  //     roots.push(root1, root2, root3);
  //   }
  //   roots.sort();
  //   return roots;
  // }
  /**
   * 使用MATHJS.js求解一元三次方程
   * @param {number} a - 三次项系数为1
   * @param {number} b - 二次项系数
   * @param {number} c - 一次项系数
   * @param {number} d - 常数项
   * @returns {Object} 解的结果
   */
  static SolveCubicNumberical(a_: number | BigNumber, b_: number | BigNumber, c_: number | BigNumber, d_: number | BigNumber, tol1: BigNumber = big(1e-12)): Array<MATHJS.Complex | BigNumber> {
    const ZERO = big(0);
    // 输入验证
    if (abs(big(a_)).lessThanOrEqualTo(tol1)) {
      // 这不是一元三次方程（a不能为0），解一元二次方程 bx² + cx + d = 0
      let roots = SolveEquation.SolveQuadraticEquation(b_, c_, d_, tol1);
      return roots;
    }

    let roots = new Array<MATHJS.Complex | BigNumber>();

    // 后面使用归一化方程： λ^3 + aλ^2 + bλ + c = 0;
    let a = div(b_, a_) as BigNumber;
    let b = div(c_, a_) as BigNumber;
    let c = div(d_, a_) as BigNumber;
    console.log(`归一化方程: λ^3 + aλ^2 + bλ + c = 0 => a:${a.toNumber()}, b:${b.toNumber()}, c:${c.toNumber()}`);

    // 输入验证,c不是0，其他是0。

    if (abs(a).lessThanOrEqualTo(tol1)
      && abs(b).lessThanOrEqualTo(tol1)
      && !abs(c).lessThanOrEqualTo(tol1)) {
      // 实根
      let realRoot = MATHJS.cbrt(un(c));
      roots.push(realRoot);
      // 两个共轭复根：旋转 120° 和 240°
      // 复根 = realRoot * (-1/2 ± i*sqrt(3)/2)
      const half = big(-0.5);
      const sqrt3over2 = div(MATHJS.sqrt(3), 2);

      roots.push(MATHJS.complex((mul(realRoot, half) as BigNumber).toNumber(), (mul(realRoot, sqrt3over2) as BigNumber).toNumber()));
      roots.push(MATHJS.complex((mul(realRoot, half) as BigNumber).toNumber(), (mul(un(realRoot), sqrt3over2) as BigNumber).toNumber()));
      return roots;
    }

    // 输入验证,c是0，其他不是0。
    if (!abs(a).lessThanOrEqualTo(tol1)
      && !abs(b).lessThanOrEqualTo(tol1)
      && abs(c).lessThanOrEqualTo(tol1)) {
      let roots = SolveEquation.SolveQuadraticEquation(1, a, b);
      roots.push(ZERO);
      return roots;
    }

    let rs = MATHJS.polynomialRoot(c.toNumber(), b.toNumber(), a.toNumber(), 1);
    console.log(`MATHJS.polynomialRoot rs:${rs}`);
    rs.forEach(root => {
      if (MATHJS.typeOf(root) === 'Complex') {
        roots.push(root as MATHJS.Complex);
      }
      if (MATHJS.typeOf(root) === 'number') {
        roots.push(big(root as number));
      }
    });
    return roots;

    // Δ = 18abc − 4a^3c + a^2b^2 − 4b^3 − 27c^2
    let Δ0 = MATHJS.add(
      mul(a, b, c, 18),
      mul(a, a, a, c, -4),
      mul(a, a, b, b),
      mul(b, b, b, -4),
      mul(c, c, -27),
    )
    console.log(`Δ = 18abc − 4a^3c + a^2b^2 − 4b^3 − 27c^2 => Δ:${Δ0.toString()}`);

    // 令λ = x − a/3​ ，方程变为：x^3 + px + q = 0 
    // p = b − a^2/3
    // q = 2a^3/27 ​− ab/3 + c
    const p = sub(b, div(mul(a, a), 3)) as BigNumber;
    const q = MATHJS.add(
      div(mul(mul(a, a, a), 2), 27),
      div(mul(a, b), -3),
      c
    ) as BigNumber;
    console.log(`p = b − a^2/3 => p:${p.toNumber()}`);
    console.log(`q = 2a^3/27 ​− ab/3 + c => q:${q.toNumber()}`);
    // 判别式简化公式
    // Δ = − 4p^3 − 27q^2
    let Δ = MATHJS.add(
      mul(p, p, p, -4),
      mul(q, q, -27),
    ) as BigNumber;
    console.log(`Δ = − 4p^3 − 27q^2 => Δ:${Δ.toNumber()}`);

    const shift = div(a, 3) as BigNumber;
    console.log(`λ = x − a/3 => shift:${shift.toNumber()}`);


    // Δ = 0：有重根(abs(Δ) < 1e-5)
    if (MATHJS.larger(1e-5, abs(Δ))) {
      // 三个实根（至少两个相等）
      // x1​ = 3 (−q/2) ^ 1/3 ,
      // x2​ = x3​ = −3 (−q/4) ^ 1/3
      let x1 = mul(MATHJS.cbrt(mul(q, -0.5) as BigNumber), 3) as BigNumber;
      let x2 = mul(MATHJS.cbrt(mul(q, -0.25) as BigNumber), -3) as BigNumber;
      let x3 = mul(MATHJS.cbrt(mul(q, -0.25) as BigNumber), -3) as BigNumber;

      console.log(`x1​ = 3 (−q/2) ^ 1/3 => x1:${x1.toNumber()}`);
      console.log(`x2​ = x3​ = −3 (−q/4) ^ 1/3 => x2:${x2.toNumber()}`);

      let λ1 = sub(x1, shift) as BigNumber;
      let λ2 = sub(x2, shift) as BigNumber;
      let λ3 = sub(x3, shift) as BigNumber;
      roots.push(λ1, λ2, λ3);
    }
    // Δ > 0：三个不同的实根
    else if (MATHJS.larger(Δ, 0)) {
      // R = sqrt(−p^3/27)
      // θ = arccos(−q/2R)
      let R = MATHJS.sqrt(div(mul(p, p, p), -27) as BigNumber);
      let θ = MATHJS.acos(div(mul(-q, -0.5), R) as BigNumber);
      console.log(`R = sqrt(−p^3/27) => R:${R.toNumber()}`);
      console.log(`θ = arccos(−q/2R) => θ:${θ.toNumber()}`);
      // x1​ =2R^1/3​ cos(θ / 3)
      // x2 =2R^1/3 cos⁡(θ+2π / 3)
      // x3 =2R^1/3 cos⁡(θ+4π / 3)
      let x1 = mul(MATHJS.cbrt(R), MATHJS.cos(div(θ, 3) as BigNumber), 2) as BigNumber;
      let x2 = mul(MATHJS.cbrt(R), MATHJS.cos(div(MATHJS.add(θ, PI2), 3) as BigNumber), 2) as BigNumber;
      let x3 = mul(MATHJS.cbrt(R), MATHJS.cos(div(MATHJS.add(θ, PI4), 3) as BigNumber), 2) as BigNumber;
      console.log(`x1​ =2R^1/3​ cos(θ / 3) => x1​:${x1.toNumber()}`);
      console.log(`x2 =2R^1/3 cos⁡(θ+2π / 3) => x2:${x2.toNumber()}`);
      console.log(`x3 =2R^1/3 cos⁡(θ+4π / 3) => x3​:${x3.toNumber()}`);
      let λ1 = sub(x1, shift) as BigNumber;
      let λ2 = sub(x2, shift) as BigNumber;
      let λ3 = sub(x3, shift) as BigNumber;
      roots.push(λ1, λ2, λ3);
    }
    // Δ < 0：一个实根 + 两个复根
    else {
      // 三个不等实根（需要三角函数解）
      // A = (-q/2 + (-Δ/108)^1/2)^1/3
      // B = (-q/2 - (-Δ/108)^1/2)^1/3
      // x1 = A + B
      // x2 = -x1/2 + isqrt(3)/2(A - B)
      // x3 = -x1/2 - isqrt(3)/2(A - B)
      let A = MATHJS.cbrt(MATHJS.add(mul(q, -0.5), MATHJS.sqrt(div(Δ, -108) as BigNumber)) as BigNumber);
      let B = MATHJS.cbrt(MATHJS.add(mul(q, -0.5), un(MATHJS.sqrt(div(Δ, -108) as BigNumber))) as BigNumber);
      console.log(`A = (-q/2 + (-Δ/108)^1/2)^1/3 => A:${A.toNumber()}`);
      console.log(`B = (-q/2 - (-Δ/108)^1/2)^1/3 => B:${B.toNumber()}`);

      let x1 = MATHJS.add(A, B) as BigNumber;
      let x2_r = mul(x1, -0.5) as BigNumber;
      const x2_i = mul(MATHJS.sqrt(big(3)), MATHJS.add(A, un(B)), 0.5) as BigNumber;
      let x3_r = mul(x1, -0.5) as BigNumber;
      const x3_i = mul(MATHJS.sqrt(big(3)), MATHJS.add(A, un(B)), -0.5) as BigNumber;

      console.log(`x1 = A + B => x1:${x1.toNumber()}`);
      console.log(`x2 = -x1/2 + isqrt(3)/2(A - B) => x2_r:${x2_r.toNumber()},x2_i:${x2_i.toNumber()}`);
      console.log(`x3 = -x1/2 - isqrt(3)/2(A - B) => x3_r:${x2_r.toNumber()},x3_i:${x3_i.toNumber()}`);

      let λ1 = sub(x1, shift) as BigNumber;
      let λ2_r = sub(x2_r, shift) as BigNumber;
      let λ2_i = x2_i;
      let λ3_r = sub(x3_r, shift) as BigNumber;
      let λ3_i = x3_i;

      roots.push(λ1, MATHJS.complex(λ2_r.toNumber(), λ2_i.toNumber()), MATHJS.complex(λ3_r.toNumber(), λ3_i.toNumber()));
    }
    // roots.sort();
    return roots;
  }
  /**
   * 更稳定的三次方程求解方法（使用特征值方法）
   */
  static SolveCubicStable(a: number, b: number, c: number, d: number): Array<MATHJS.Complex | BigNumber> {
    if (a === 0)
      throw new Error('a不能为0');

    // 构造伴随矩阵
    // const companionMatrix = [
    //     [0, 1, 0],
    //     [0, 0, 1],
    //     [-d / a, -c / a, -b / a]
    // ];
    let companionMatrix = new Array<Array<BigNumber>>(3);
    let row0 = new Array<BigNumber>(3);
    let row1 = new Array<BigNumber>(3);
    let row2 = new Array<BigNumber>(3);
    row0[0] = big(0);
    row0[1] = big(1);
    row0[2] = big(0);
    row1[0] = big(0);
    row1[1] = big(0);
    row1[2] = big(1);
    row2[0] = big(-d / a);
    row2[1] = big(-c / a);
    row2[2] = big(-b / a);
    companionMatrix[0] = row0;
    companionMatrix[1] = row1;
    companionMatrix[2] = row2;
    try {
      // 计算特征值（即方程的根）
      const eigenValues = MATHJS.eigs(companionMatrix).values;
      let roots = new Array<MATHJS.Complex | BigNumber>();
      eigenValues.forEach(element => {
        if (MATHJS.typeOf(element) === 'Complex') {
          roots.push(element);
        }
        else {
          if (MATHJS.typeOf(element) === 'BigNumber') {
            roots.push(element);
          }
        }
      });
      return roots;
    } catch (error) {
      return null;
    }
  }
  /**
   * 使用MATHJS.js求解一元三次方程
   * @param {number} a - 三次项系数
   * @param {number} b - 二次项系数
   * @param {number} c - 一次项系数
   * @param {number} d - 常数项
   * @returns {Object} 解的结果
   */
  static SolveCubicEquation(a: number, b: number, c: number, d: number): Array<MATHJS.Complex | BigNumber> {
    const stables = SolveEquation.SolveCubicStable(a, b, c, d);
    if (!stables) {
      return SolveEquation.SolveCubicNumberical(a, b, c, d)
    }
    const numbericals = SolveEquation.SolveCubicNumberical(a, b, c, d);
    const roots1 = stables;
    const roots2 = numbericals;
    let mean1 = big(0);
    let mean2 = big(0);
    // 比较两个结果，选择更准确的那个
    roots1.forEach(root => {
      const v = MATHJS.add(
        MATHJS.add(
          MATHJS.add(
            mul(MATHJS.pow(root, 4), a),
            mul(MATHJS.pow(root, 3), b)),
          mul(MATHJS.pow(root, 2), c)),
        mul(root, d));
      mean1 = MATHJS.add(mean1, abs(v)) as BigNumber;
    });
    mean1 = div(mean1, roots1.length) as BigNumber;
    roots2.forEach(root => {
      const v =
        MATHJS.add(
          MATHJS.add(
            MATHJS.add(
              mul(MATHJS.pow(root, 4), a),
              mul(MATHJS.pow(root, 3), b)),
            mul(MATHJS.pow(root, 2), c)),
          mul(root, d));
      mean2 = MATHJS.add(mean2, abs(v)) as BigNumber;
    });
    mean2 = div(mean2, roots2.length) as BigNumber;
    if (mean1.lte(mean2)) {
      return roots1;
    } else {
      return roots2;
    }
  }

  static testExecCubicSolver(a: number, b: number, c: number, d: number) {
    let str =
      (a >= 0 ? '   ' + a + 'x³' : ' - ' + (-a) + 'x³') +
      (b >= 0 ? ' + ' + b + 'x²' : ' - ' + (-b) + 'x²') +
      (c >= 0 ? ' + ' + c + 'x ' : ' - ' + (-c) + 'x ') +
      (d >= 0 ? ' + ' + d : ' - ' + (-d));
    const stables = SolveEquation.SolveCubicStable(a, b, c, d);
    // console.log('特征值法解:', stables);
    let mean1 = big(0);
    let mean2 = big(0);
    if (stables) {
      stables.forEach(root => {
        const v = MATHJS.add(
          MATHJS.add(
            MATHJS.add(
              mul(MATHJS.pow(root, 3), a),
              mul(MATHJS.pow(root, 2), b)),
            mul(root, c)),
          d);
        // console.log('验证: x = ' + MATHJS.format(root, { precision: 20 }) + ' => ' + str + ' = ' + MATHJS.format(v, { precision: 20 }));
        mean1 = MATHJS.add(mean1, abs(v)) as BigNumber;
      });
      mean1 = div(mean1, stables.length) as BigNumber;
    } else {
      mean1 = big(Infinity);
    }
    const numbericals = SolveEquation.SolveCubicNumberical(a, b, c, d);
    // console.log('解析式法解:', numbericals);
    if (numbericals) {
      numbericals.forEach(root => {
        const v = MATHJS.add(
          MATHJS.add(
            MATHJS.add(
              mul(MATHJS.pow(root, 3), a),
              mul(MATHJS.pow(root, 2), b)),
            mul(root, c)),
          d);
        // console.log('验证: x = ' + MATHJS.format(root, { precision: 20 }) + ' => ' + str + ' = ' + MATHJS.format(v, { precision: 20 }));
        mean2 = MATHJS.add(mean2, abs(v)) as BigNumber;
      });
      mean2 = div(mean2, numbericals.length) as BigNumber;
    } else {
      mean2 = big(Infinity);
    }
    if (/*!mean1.lessThanOrEqualTo(1e-10) && stables || */!mean2.lessThanOrEqualTo(1e-10) && numbericals) {
      console.warn(str + ' = 0' + ' 特征值法平均距离 Mean1:', MATHJS.format(mean1, { precision: 20 }) + ', 解析法平均距离 Mean2:', MATHJS.format(mean2, { precision: 20 }));
    }
    if (mean1.lessThanOrEqualTo(mean2)) {
      return true;
    } else {
      return false;
    }
  }

  /**
   * 使用math.js求解一元四次方程
   * @param {number} a - 四次项系数
   * @param {number} b - 三次项系数
   * @param {number} c - 二次项系数
   * @param {number} d - 一次项系数
   * @param {number} e - 常数项
   * @returns {Object} 解的结果
   */
  static SolveQuarticNumberical(a_: number | BigNumber, b_: number | BigNumber, c_: number | BigNumber, d_: number | BigNumber, e_: number | BigNumber, tol1: BigNumber = big(1e-12)): Array<MATHJS.Complex | BigNumber> {
    let a = big(a_);
    let b = big(b_);
    let c = big(c_);
    let d = big(d_);
    let e = big(e_);
    const ZERO = big(0);
    // 输入验证
    if (abs(a).lessThanOrEqualTo(tol1)) {
      // 这不是一元四次方程（a不能为0），解一元三次方程 bx³ + cx² + dx + e = 0
      let roots = SolveEquation.SolveCubicNumberical(b, c, d, e, tol1);
      return roots;
    }

    // 将方程化为归一化形式: x⁴ + px³ + qx² + rx + s = 0
    // const p = b / a;
    // const q = c / a;
    // const r = d / a;
    // const s = e / a;
    let p = div(b, a) as BigNumber;
    let q = div(c, a) as BigNumber;
    let r = div(d, a) as BigNumber;
    let s = div(e, a) as BigNumber;
    console.log(`方程化为归一化形式 x⁴ + px³ + qx² + rx + s = 0 p:${p.toNumber()} q :${q.toNumber()}, r:${r.toNumber()}, s:${s.toNumber()}`);

    // 输入验证,s为不是0，其他系数都为0。
    if (abs(p).lessThanOrEqualTo(tol1)
      && abs(q).lessThanOrEqualTo(tol1)
      && abs(r).lessThanOrEqualTo(tol1)
      && !abs(s).lessThanOrEqualTo(tol1)) {
      let roots = new Array<MATHJS.Complex | BigNumber>();
      if (s.lessThan(ZERO)) {
        // s < 0：两个实根 + 两个纯虚根
        const r = MATHJS.pow(un(s), 0.25) as BigNumber;  // 正的四次方根
        roots.push(r);          // +√⁴(-s)
        roots.push(un(r));         // -√⁴(-s)
        roots.push(MATHJS.complex(0, r.toNumber()));          // +i√⁴(-s)
        roots.push(MATHJS.complex(0, -r.toNumber()));         // -i√⁴(-s)
      } else {
        // s > 0：四个复根
        const r = MATHJS.pow(s, 0.25) as BigNumber;  // 正的四次方根
        const sqrt2 = big(Math.SQRT2);
        const half = big(0.5);
        // 四个根在复平面上旋转 45°
        roots.push(MATHJS.complex((mul(r, half, sqrt2) as BigNumber).toNumber(), (mul(r, half, sqrt2) as BigNumber).toNumber()));    // 第一象限
        roots.push(MATHJS.complex((mul(un(r), half, sqrt2) as BigNumber).toNumber(), (mul(r, half, sqrt2) as BigNumber).toNumber()));   // 第二象限
        roots.push(MATHJS.complex((mul(un(r), half, sqrt2) as BigNumber).toNumber(), (mul(un(r), half, sqrt2) as BigNumber).toNumber()));  // 第三象限
        roots.push(MATHJS.complex((mul(r, half, sqrt2) as BigNumber).toNumber(), (mul(un(r), half, sqrt2) as BigNumber).toNumber()));   // 第四象限
      }
      return roots;
    }
    // 输入验证,s是0，其他不是0。
    if (!abs(p).lessThanOrEqualTo(tol1)
      && !abs(q).lessThanOrEqualTo(tol1)
      && !abs(r).lessThanOrEqualTo(tol1)
      && abs(s).lessThanOrEqualTo(tol1)) {
      let roots = SolveEquation.SolveCubicNumberical(1, p, q, r);
      roots.push(ZERO);
      return roots;
    }
    // 输入验证,r、s是0，其他不是0。
    if (!abs(p).lessThanOrEqualTo(tol1)
      && !abs(q).lessThanOrEqualTo(tol1)
      && abs(r).lessThanOrEqualTo(tol1)
      && abs(s).lessThanOrEqualTo(tol1)) {
      let roots = SolveEquation.SolveQuadraticEquation(1, p, q);
      roots.push(ZERO);
      // roots.push(ZERO);
      return roots;
    }
    // 输入验证,q、r、s是0，其他不是0。
    if (!abs(p).lessThanOrEqualTo(tol1)
      && abs(q).lessThanOrEqualTo(tol1)
      && abs(r).lessThanOrEqualTo(tol1)
      && abs(s).lessThanOrEqualTo(tol1)) {
      let roots = new Array<MATHJS.Complex | BigNumber>();
      roots.push(un(p));
      roots.push(ZERO);
      // roots.push(ZERO);
      // roots.push(ZERO);
      return roots;
    }
    // 输入验证,p、q、r、s是0，其他不是0。
    if (abs(p).lessThanOrEqualTo(tol1)
      && abs(q).lessThanOrEqualTo(tol1)
      && abs(r).lessThanOrEqualTo(tol1)
      && abs(s).lessThanOrEqualTo(tol1)) {
      let roots = new Array<MATHJS.Complex | BigNumber>();
      roots.push(ZERO);
      // roots.push(ZERO);
      // roots.push(ZERO);
      // roots.push(ZERO);
      return roots;
    }

    // 原始归一化方程: x⁴ + p x³ + q x² + r x + s = 0
    // 令 x = t * z，则方程变为:
    // t⁴ z⁴ + p t³ z³ + q t² z² + r t z + s = 0
    // 除以 t⁴: z⁴ + (p/t) z³ + (q/t²) z² + (r/t³) z + (s/t⁴) = 0
    // 选择 t 使得系数尽可能接近 1
    const p_abs = abs(p);
    const q_abs = abs(q);
    const r_abs = abs(r);
    const s_abs = abs(s);

    // 选择 t 使得最大缩放后的系数接近 1
    // 简单方法：取 t = max(|p|, |q|^(1/2), |r|^(1/3), |s|^(1/4))
    const t = MATHJS.max(
      MATHJS.pow(p_abs, 1) as BigNumber,
      MATHJS.pow(q_abs, 0.5) as BigNumber,
      MATHJS.pow(r_abs, 1 / 3) as BigNumber,
      MATHJS.pow(s_abs, 1 / 4) as BigNumber
    );
    console.log(`缩放参数t:${t.toNumber()}`);

    // 缩放后的系数
    const p_scaled = div(p, t) as BigNumber;
    const q_scaled = div(q, mul(t, t)) as BigNumber;
    const r_scaled = div(r, mul(t, t, t)) as BigNumber;
    const s_scaled = div(s, mul(t, t, t, t)) as BigNumber;

    p = p_scaled;
    q = q_scaled;
    r = r_scaled;
    s = s_scaled;

    console.log(`缩放形式 x⁴ + px³ + qx² + rx + s = 0 p:${p.toNumber()} q :${q.toNumber()}, r:${r.toNumber()}, s:${s.toNumber()}`);

    const p_4 = div(p, 4) as BigNumber;
    console.log(`p_4:${p_4.toNumber()} `);

    // 转换为缺项四次方程: y⁴ + Ay² + By + C = 0 (通过代换 x = y - p/4)
    // const A = q - (3 * p * p) / 8;
    // const B = r + (p * p * p) / 8 - (p * q) / 2;
    // const C = s - (3 * p * p * p * p) / 256 + (p * p * q) / 16 - (p * r) / 4;

    const A = sub(q, div(mul(mul(p, p), 3), 8)) as BigNumber;
    const B = sub(MATHJS.add(r, div(MATHJS.pow(p, 3), 8)), div(mul(p, q), 2)) as BigNumber;
    const C = sub(MATHJS.add(sub(s, div(mul(MATHJS.pow(p, 4), 3), 256)), div(mul(MATHJS.pow(p, 2), q), 16)), div(mul(p, r), 4)) as BigNumber;

    console.log(`缺项方程 y⁴ + Ay² + By + C = 0: A :${A.toNumber()}, B:${B.toNumber()}, C:${C.toNumber()}`);
    let roots = new Array<MATHJS.Complex | BigNumber>();

    if (abs(B).lessThanOrEqualTo(tol1)) {
      // 退化情况：y⁴ + A*y² + C = 0
      // 令 z = y²，解 z² + A*z + C = 0
      const zRoots = SolveEquation.SolveQuadraticEquation(1, A, C);
      for (const z of zRoots) {
        if (MATHJS.typeOf(z) === 'BigNumber') {
          const y1 = MATHJS.sqrt(z);
          const y2 = un(y1);
          roots.push(sub(y1, p_4));
          roots.push(sub(y2, p_4));
        } else if (MATHJS.typeOf(z) === 'Complex') {
          const zc = z as MATHJS.Complex;
          const y = MATHJS.sqrt(zc);
          roots.push(sub(y, p_4) as (MATHJS.Complex | BigNumber));
          roots.push(sub(un(y), p_4) as (MATHJS.Complex | BigNumber));
        }
      }
      for (let i = 0; i < roots.length; i++) {
        roots[i] = mul(roots[i], t) as (BigNumber | MATHJS.Complex);
      }
      return roots;
    }
    // 求解三次预解方程: m³ - (A/2)m² - Cm + (A*C/2 - B²/8) = 0
    // const cubicA = 1;
    // const cubicB = -A / 2;
    // const cubicC = -C;
    // const cubicD = (A * C) / 2 - (B * B) / 8;

    const cubicA = 1;
    const cubicB = div(A, -2) as BigNumber;
    const cubicC = un(C);
    const cubicD = sub(div(mul(A, C), 2), div(mul(B, B), 8)) as BigNumber;

    // 使用三次方程求解器
    // const mRoots = SolveEquation.SolveCubicEquation(cubicA, cubicB.toNumber(), cubicC.toNumber(), cubicD.toNumber());
    console.log(`求解三次预解方程 C_3 m^3 + C_2 m^2 + C_1 m + C_0=> C_3:${cubicA}, C_2:${cubicB.toNumber()}, C_1:${cubicC.toNumber()}, C_0:${cubicD.toNumber()}`);
    const ms = SolveEquation.SolveCubicNumberical(cubicA, cubicB, cubicC, cubicD);
    console.log(`三次预解方程 ms: ${ms[0]}, ${ms[1]}, ${ms[2]}`);

    // 选择绝对值最小的实数根作为m
    let m: BigNumber = undefined;
    let setm = (r: MATHJS.Complex | BigNumber) => {
      if (MATHJS.typeOf(r) === 'BigNumber') {
        if (m === undefined) {
          m = r as BigNumber;
        } else {
          let root = r as BigNumber;
          if (abs(root) < abs(m)) {
            m = root;
          }
        }
      }
      if (MATHJS.typeOf(r) === 'Complex') {
        let root = r as MATHJS.Complex;
        if (abs(root.im) < 1e-10) {
          if (m === undefined) {
            m = big(root.re);
          } else {
            if (abs(big(root.re)) < abs(m)) {
              m = big(root.re);
            }
          }
        }
      }
    }
    let r0 = ms[0];
    let r1 = ms[1];
    let r2 = ms[2];
    setm(r0);
    setm(r1);
    setm(r2);

    let m_ = big(m);
    console.log(`m: ${m.toNumber()}`);
    // 构建二次方程参数
    // const sqrt2mMinusA = MATHJS.sqrt(2 * m - A);
    // const sqrtM2MinusC = MATHJS.sqrt(m * m - C);
    const sqrt2mMinusA = MATHJS.sqrt(sub(mul(m_, 2), A) as BigNumber);
    const sqrtM2MinusC = MATHJS.sqrt(sub(mul(m_, m_), C) as BigNumber);


    // 情况1: B >= 0
    // const signB = B >= 0 ? 1 : -1;
    // const alpha = sqrt2mMinusA;
    // const beta = signB * sqrtM2MinusC;
    const alpha = sqrt2mMinusA;
    let beta = sqrtM2MinusC;
    if (B.lessThan(ZERO)) {
      beta = un(beta);
    }

    console.log(`alpha: ${alpha} beta: ${beta}`);

    // 解第一个二次方程: y² - αy + (m + β) = 0
    // const Δ1 = alpha * alpha - 4 * (m + beta);
    const Δ1 = sub(mul(alpha, alpha), mul(MATHJS.add(m_, beta), 4));
    console.log(`Δ1: ${Δ1}`);
    // 检查 Δ1 是否为复数
    if (MATHJS.typeOf(Δ1) === 'Complex') {
      let Δ = Δ1 as MATHJS.Complex;
      // 复数判别式，使用复数公式
      const sqrtDisc = MATHJS.sqrt(Δ);
      console.log(`sqrtDisc: ${sqrtDisc}`);
      const root1 = div(MATHJS.add(alpha, sqrtDisc), 2);
      const root2 = div(sub(alpha, sqrtDisc), 2);
      console.log(`root1:${root1.toString()} root2:${root2.toString()} `);
      roots.push(sub(root1, p_4) as any);
      roots.push(sub(root2, p_4) as any);
    }
    else if (largerEq(Δ1, ZERO)) {
      let Δ = Δ1 as BigNumber;
      // const root1 = (alpha + MATHJS.sqrt(Δ1)) / 2;
      // const root2 = (alpha - MATHJS.sqrt(Δ1)) / 2;
      const root1 = div(MATHJS.add(alpha, MATHJS.sqrt(Δ)), 2);
      const root2 = div(sub(alpha, MATHJS.sqrt(Δ)), 2);
      console.log(`缺项方程根： root1:${root1.toString()} root2:${root2.toString()} `);
      // roots.push(root1 - p / 4, root2 - p / 4);
      const r1 = sub(root1, p_4) as any;
      const r2 = sub(root2, p_4) as any;
      console.log(`缩放方程根： r1:${r1.toString()} r2:${r2.toString()} `);
      roots.push(r1);
      roots.push(r2);
    } else {
      let Δ = Δ1 as BigNumber;

      if (MATHJS.typeOf(alpha) === 'Complex') {
        // 如果 alpha 是复数，使用复数公式
        const sqrtDisc = MATHJS.sqrt(un(Δ));
        const root1 = div(MATHJS.add(alpha, sqrtDisc), 2);
        const root2 = div(sub(alpha, sqrtDisc), 2);
        console.log(`缺项方程根： root1:${root1.toString()} root2:${root2.toString()} `);
        const r1 = sub(root1, p_4) as any;
        const r2 = sub(root2, p_4) as any;
        console.log(`缩放方程根： r1:${r1.toString()} r2:${r2.toString()} `);
        roots.push(r1, r2);
      } else {
        // const realPart = alpha / 2;
        // const imagPart = MATHJS.sqrt(-Δ1) / 2;
        // roots.push(
        //     MATHJS.complex(realPart, imagPart) - p / 4,
        //     MATHJS.complex(realPart, -imagPart) - p / 4
        // );
        const realPart = div(alpha, 2) as BigNumber;
        const imagPart = div(MATHJS.sqrt(un(Δ)), 2) as BigNumber;
        console.log(`realPart:${realPart.toNumber()} imagPart:${imagPart.toNumber()} `);
        const root1 = MATHJS.complex(realPart.toNumber(), imagPart.toNumber());
        const root2 = MATHJS.complex(realPart.toNumber(), -imagPart.toNumber());
        console.log(`缺项方程根：root1:${root1.toString()} root2:${root2.toString()} `);
        const r1 = sub(root1, p_4) as any;
        const r2 = sub(root2, p_4) as any;
        console.log(`缩放方程根： r1:${r1.toString()} r2:${r2.toString()} `);

        roots.push(r1, r2);
      }
    }

    // 解第二个二次方程: y² + αy + (m - β) = 0
    // const Δ2 = alpha * alpha - 4 * (m - beta);
    const Δ2 = sub(mul(alpha, alpha), mul(sub(m_, beta), 4));
    console.log(`Δ2: ${Δ2}`);
    // 检查 Δ2 是否为复数
    if (MATHJS.typeOf(Δ2) === 'Complex') {
      let Δ = Δ2 as MATHJS.Complex;
      // 复数判别式，使用复数公式
      const sqrtDisc = MATHJS.sqrt(Δ);
      console.log(`sqrtDisc: ${sqrtDisc}`);
      const root3 = div(MATHJS.add(alpha, sqrtDisc), 2);
      const root4 = div(sub(alpha, sqrtDisc), 2);
      console.log(`缺项方程根：root3:${root3.toString()} root4:${root4.toString()} `);
      const r3 = sub(root3, p_4) as any;
      const r4 = sub(root4, p_4) as any;
      console.log(`缩放方程根： r3:${r3.toString()} r4:${r4.toString()} `);
      roots.push(r3, r4);
    }
    else if (largerEq(Δ2, ZERO)) {
      let Δ = Δ2 as BigNumber;
      // const root3 = (-alpha + MATHJS.sqrt(Δ2)) / 2;
      // const root4 = (-alpha - MATHJS.sqrt(Δ2)) / 2;
      // roots.push(root3 - p / 4, root4 - p / 4);
      const root3 = div(MATHJS.add(un(alpha), MATHJS.sqrt(Δ)), 2);
      const root4 = div(sub(un(alpha), MATHJS.sqrt(Δ)), 2);
      console.log(`缺项方程根：root3:${root3.toString()} root4:${root4.toString()} `);
      const r3 = sub(root3, p_4) as any;
      const r4 = sub(root4, p_4) as any;
      console.log(`缩放方程根： r3:${r3.toString()} r4:${r4.toString()} `);
      roots.push(r3, r4);
    } else {
      let Δ = Δ2 as BigNumber;

      if (MATHJS.typeOf(alpha) === 'Complex') {
        // 如果 alpha 是复数，使用复数公式
        const sqrtDisc = MATHJS.sqrt(un(Δ));
        const root3 = div(MATHJS.add(alpha, sqrtDisc), 2);
        const root4 = div(sub(alpha, sqrtDisc), 2);
        console.log(`缺项方程根：root3:${root3.toString()} root4:${root4.toString()} `);
        const r3 = sub(root3, p_4) as any;
        const r4 = sub(root4, p_4) as any;
        console.log(`缩放方程根： r3:${r3.toString()} r4:${r4.toString()} `);
        roots.push(r3, r4);
      } else {
        // const realPart = -alpha / 2;
        // const imagPart = MATHJS.sqrt(-Δ2) / 2;
        // roots.push(
        //     MATHJS.complex(realPart, imagPart) - p / 4,
        //     MATHJS.complex(realPart, -imagPart) - p / 4
        // );
        const realPart = div(alpha, -2) as BigNumber;
        const imagPart = div(MATHJS.sqrt(un(Δ)), 2) as BigNumber;
        console.log(`realPart:${realPart.toNumber()} imagPart:${imagPart.toNumber()}`);
        const root3 = MATHJS.complex(realPart.toNumber(), imagPart.toNumber());
        const root4 = MATHJS.complex(realPart.toNumber(), -imagPart.toNumber());
        console.log(`缺项方程根：root3:${root3.toString()} root4:${root4.toString()}`);
        const r3 = sub(root3, p_4) as any;
        const r4 = sub(root4, p_4) as any;
        console.log(`缩放方程根：r3:${r3.toString()} r4:${r4.toString()} `);
        roots.push(r3, r4);
      }
    }
    // 乘以缩放系数后的结果
    console.log(`乘以缩放系数后的原方程根：`);
    for (let i = 0; i < roots.length; i++) {
      roots[i] = mul(roots[i], t) as (BigNumber | MATHJS.Complex);
      console.log(`Root[${i}]：${roots[i]}`);
    }
    return roots;
  }

  /**
   * 使用特征值方法求解四次方程（更稳定）
   */
  static SolveQuarticStable(a: number, b: number, c: number, d: number, e: number): Array<MATHJS.Complex | BigNumber> {
    if (a === 0) throw new Error('a不能为0');

    // 构造伴随矩阵
    // const companionMatrix = [
    //     [0, 1, 0, 0],
    //     [0, 0, 1, 0],
    //     [0, 0, 0, 1],
    //     [-e / a, -d / a, -c / a, -b / a]
    // ];

    let companionMatrix = new Array<Array<BigNumber>>(4);
    let row0 = new Array<BigNumber>(4);
    let row1 = new Array<BigNumber>(4);
    let row2 = new Array<BigNumber>(4);
    let row3 = new Array<BigNumber>(4);
    row0[0] = big(0);
    row0[1] = big(1);
    row0[2] = big(0);
    row0[3] = big(0);

    row1[0] = big(0);
    row1[1] = big(0);
    row1[2] = big(1);
    row1[3] = big(0);

    row2[0] = big(0);
    row2[1] = big(0);
    row2[2] = big(0);
    row2[3] = big(1);

    row3[0] = div(big(-e), big(a)) as BigNumber;
    row3[1] = div(big(-d), big(a)) as BigNumber;
    row3[2] = div(big(-c), big(a)) as BigNumber;
    row3[3] = div(big(-b), big(a)) as BigNumber;

    companionMatrix[0] = row0;
    companionMatrix[1] = row1;
    companionMatrix[2] = row2;
    companionMatrix[3] = row3;
    // 计算特征值（即方程的根）
    try {
      const eigenValues = MATHJS.eigs(companionMatrix).values;
      let roots = new Array<MATHJS.Complex | BigNumber>();
      eigenValues.forEach(element => {
        if (MATHJS.typeOf(element) === 'Complex') {
          roots.push(element);
        }
        else {
          if (MATHJS.typeOf(element) === 'BigNumber') {
            roots.push(element);
          }
        }
      });
      roots.sort();
      return roots;
    } catch (error) {
      return null;
    }
  }

  /**
   * 使用math.js求解一元四次方程
   * @param {number} a - 四次项系数
   * @param {number} b - 三次项系数
   * @param {number} c - 二次项系数
   * @param {number} d - 一次项系数
   * @param {number} e - 常数项
   * @returns {Object} 解的结果
   */
  static SolveQuarticEquation(a: number, b: number, c: number, d: number, e: number): Array<MATHJS.Complex | BigNumber> {
    const stables = SolveEquation.SolveQuarticStable(a, b, c, d, e);
    if (!stables) {
      return SolveEquation.SolveQuarticNumberical(a, b, c, d, e);
    }
    const numbericals = SolveEquation.SolveQuarticNumberical(a, b, c, d, e);
    const roots1 = stables;
    const roots2 = numbericals;
    let mean1 = big(0);
    let mean2 = big(0);
    // 比较两个结果，选择更准确的那个
    roots1.forEach(root => {
      const v = MATHJS.add(
        MATHJS.add(
          MATHJS.add(
            MATHJS.add(
              mul(MATHJS.pow(root, 4), a),
              mul(MATHJS.pow(root, 3), b)),
            mul(MATHJS.pow(root, 2), c)),
          mul(root, d)),
        e);
      mean1 = MATHJS.add(mean1, abs(v)) as BigNumber;
    });
    mean1 = div(mean1, roots1.length) as BigNumber;
    roots2.forEach(root => {
      const v = MATHJS.add(
        MATHJS.add(
          MATHJS.add(
            MATHJS.add(
              mul(MATHJS.pow(root, 4), a),
              mul(MATHJS.pow(root, 3), b)),
            mul(MATHJS.pow(root, 2), c)),
          mul(root, d)),
        e);
      mean2 = MATHJS.add(mean2, abs(v)) as BigNumber;
    });
    mean2 = div(mean2, roots2.length) as BigNumber;
    if (mean1.lessThanOrEqualTo(mean2)) {
      return roots1;
    } else {
      return roots2
    }
  }

  static testExecQuarticSolver(a: number, b: number, c: number, d: number, e: number) {
    let str =
      (a >= 0 ? '   ' + a + 'x⁴' : ' - ' + (-a) + 'x⁴') +
      (b >= 0 ? ' + ' + b + 'x³' : ' - ' + (-b) + 'x³') +
      (c >= 0 ? ' + ' + c + 'x²' : ' - ' + (-c) + 'x²') +
      (d >= 0 ? ' + ' + d + 'x ' : ' - ' + (-d) + 'x ') +
      (e >= 0 ? ' + ' + e : ' - ' + (-e));
    const stables = SolveEquation.SolveQuarticStable(a, b, c, d, e);
    const numbericals = SolveEquation.SolveQuarticNumberical(a, b, c, d, e);
    // console.log('特征值法解:', stables);
    let mean1 = big(0);
    let mean2 = big(0);
    // 比较两个结果，选择更准确的那个
    if (stables) {
      stables.forEach(root => {
        const v = MATHJS.add(
          MATHJS.add(
            MATHJS.add(
              MATHJS.add(
                mul(MATHJS.pow(root, 4), a),
                mul(MATHJS.pow(root, 3), b)),
              mul(MATHJS.pow(root, 2), c)),
            mul(root, d)),
          e);
        // console.log('验证: x = ' + MATHJS.format(root, { precision: 20 }) + ' => ' + str + ' = ' + MATHJS.format(v, { precision: 20 }));
        mean1 = MATHJS.add(mean1, abs(v)) as BigNumber;
      });
      mean1 = div(mean1, stables.length) as BigNumber;
    } else {
      mean1 = big(Infinity);
    }
    // console.log('解析式法解:', numbericals);
    if (numbericals) {
      numbericals.forEach(root => {
        const v = MATHJS.add(
          MATHJS.add(
            MATHJS.add(
              MATHJS.add(
                mul(MATHJS.pow(root, 4), a),
                mul(MATHJS.pow(root, 3), b)),
              mul(MATHJS.pow(root, 2), c)),
            mul(root, d)),
          e);
        // console.log('验证: x = ' + MATHJS.format(root, { precision: 20 }) + ' => ' + str + ' = ' + MATHJS.format(v, { precision: 20 }));
        mean2 = MATHJS.add(mean2, abs(v)) as BigNumber;
      });
      mean2 = div(mean2, numbericals.length) as BigNumber;
    } else {
      mean2 = big(Infinity);
    }
    if (/*!mean1.lessThanOrEqualTo(1e-8) && stables || */!mean2.lessThanOrEqualTo(1e-10) && numbericals) {
      console.warn(str + ' = 0' + ' 特征值法平均距离 Mean1:', MATHJS.format(mean1, { precision: 20 }) + ', 解析法平均距离 Mean2:', MATHJS.format(mean2, { precision: 20 }));
    }
    if (mean1.lessThanOrEqualTo(mean2)) {
      return true;
    } else {
      return false;
    }
  }
  // 一元二次方程示例测试
  static testQuadraticSolver() {
    // 示例1: 两个不等实根 x² - 5x + 6 = 0
    SolveEquation.testExecQuadraticSolver(1, -5, 6);
    // 示例2: 两个相等实根 x² - 4x + 4 = 0
    SolveEquation.testExecQuadraticSolver(1, -4, 4);
    // 示例3: 两个共轭复根 x² + 2x + 5 = 0
    SolveEquation.testExecQuadraticSolver(1, 2, 5);
    // 示例4: 带小数的方程 2.5x² - 3.7x + 1.2 = 0
    SolveEquation.testExecQuadraticSolver(2.5, -3.7, 1.2);
    console.warn('一元二次方程测试开始：');
    for (let i = 0; i < 100000; i++) {
      let a = MATHJS.round(MATHJS.random(-100, 100), 6) as number;
      let b = MATHJS.round(MATHJS.random(-100, 100), 6) as number;
      let c = MATHJS.round(MATHJS.random(-100, 100), 6) as number;
      const r = SolveEquation.testExecQuadraticSolver(a, b, c);
    }
    console.warn('一元二次方程测试完成。');
  }
  // 一元三次方程示例测试
  static testCubicSolver() {
    // // 示例1: 三个实根 x³ - 6x² + 11x - 6 = 0 (根: 1, 2, 3)
    // SolveEquation.testExecCubicSolver(1, -6, 11, -6);
    // // 示例2: 一个实根，两个复根 x³ + x + 1
    // SolveEquation.testExecCubicSolver(1, 0, 1, 1);
    // // 示例3: 三个实根（有重根） x³ - 3x² + 3x - 1 = 0 (三重根: 1)
    // SolveEquation.testExecCubicSolver(1, -3, 3, -1);
    // // 示例4: 复杂系数 2x³ - 4x² + 3x - 5 = 0
    // SolveEquation.testExecCubicSolver(2, -4, 3, -5);
    // // 示例5: 实际应用问题 x³ - 12x² + 44x - 48 = 0
    // SolveEquation.testExecCubicSolver(1, -12, 44, -48);

    // // - 9x³ + 0x² + 0x  - 100 = 0 特征值法平均距离 Mean1: Infinity, 解析法平均距离 Mean2: 0.0011052094495531004
    // SolveEquation.testExecCubicSolver(-9, 0, 0, -100);
    //SolveEquation.ts:316    0.3999999999999999x³ + 99.8000000000001x² - 26.700000000000017x  - 88.3 = 0 特征值法平均距离 Mean1: 1.042603040938653668e-11, 解析法平均距离 Mean2: 6.1311785278424701e-10
    // SolveEquation.testExecCubicSolver(0.3999999999999999, 99.8000000000001, -26.700000000000017, -88.3);
    //   0.001149x³ + 57.502351x² + 28.184932x  - 15.124636 = 0 特征值法平均距离 Mean1: 8.6488589135372916562e-6, 解析法平均距离 Mean2: 3.0026258633791203094e-10
    SolveEquation.testExecCubicSolver(0.001149, 57.502351, 28.184932, -15.124636);
    // - 0.002228x³ + 76.185758x² + 25.433665x  - 95.830854 = 0 特征值法平均距离 Mean1: 1.8584409210089381079e-6, 解析法平均距离 Mean2: 5.4226744345087935356e-10
    SolveEquation.testExecCubicSolver(-0.002228, 76.185758, 25.433665, -95.830854);
    return
    let total = 0;
    let t = 0;
    let n = 0;
    console.warn('一元三次方程测试开始：');
    for (let i = 0; i < 100000; i++) {
      let a = MATHJS.round(MATHJS.random(-100, 100), 6) as number;
      let b = MATHJS.round(MATHJS.random(-100, 100), 6) as number;
      let c = MATHJS.round(MATHJS.random(-100, 100), 6) as number;
      let d = MATHJS.round(MATHJS.random(-100, 100), 6) as number;
      total++
      // let str =
      //     (a >= 0 ? '   ' + a + 'x³' : ' - ' + (-a) + 'x³') +
      //     (b >= 0 ? ' + ' + b + 'x²' : ' - ' + (-b) + 'x²') +
      //     (c >= 0 ? ' + ' + c + 'x ' : ' - ' + (-c) + 'x ') +
      //     (d >= 0 ? ' + ' + d : ' - ' + (-d));
      const r = SolveEquation.testExecCubicSolver(a, b, c, d);
      if (r) {
        t++;
        // console.log(' 示例: ' + str + ' = 0' + ' T total ' + total + ' t ' + t + ' n ' + n + ' ');
      } else {
        n++;
        // console.log(' 示例: ' + str + ' = 0' + ' N total ' + total + ' t ' + t + ' n ' + n + ' ');
      }

    }
    console.warn('一元三次方程测试完成，共执行 ' + total + ' 次，特征值法 ' + t + ' 次 占比 ' + (t / total * 100).toFixed(2) + '%，解析式法 ' + n + ' 次 占比 ' + (n / total * 100).toFixed(2) + '%。');
  }
  // 示例测试
  static testQuarticSolver() {
    // // 示例1: 四个实根 x⁴ - 10x³ + 35x² - 50x + 24 = 0 (根: 1, 2, 3, 4)
    // SolveEquation.testExecQuarticSolver(1, -10, 35, -50, 24);
    // // 示例2: 两个实根，两个复根 x⁴ + x² + x + 1 = 0
    // SolveEquation.testExecQuarticSolver(1, 0, 1, 1, 1);
    // // 示例3: 四个复根 x⁴ + 4 = 0
    // SolveEquation.testExecQuarticSolver(1, 0, 0, 0, 4);
    // // 示例4: 可因式分解的情况 x⁴ - 5x² + 4 = 0 (根: ±1, ±2)
    // SolveEquation.testExecQuarticSolver(1, 0, -5, 0, 4);
    // // 示例5: 实际应用问题
    // SolveEquation.testExecQuarticSolver(16, -32, 24, -8, 1);

    // // SolveEquation.ts: 672 - 10x⁴ - 69.67999999999995x³ - 100x² + 52.49000000000002x - 100 = 0 特征值法平均距离 Mean1: 1.0284767844525065e-11, 解析法平均距离 Mean2: 552.75155011099800951
    // SolveEquation.testExecQuarticSolver(-10, -69.67999999999995, -100, 52.49000000000002, -100);
    // //SolveEquation.ts:672  - 10x⁴ - 69.67999999999995x³ - 100x² + 64.22000000000003x  - 100 = 0 特征值法平均距离 Mean1: 1.32826333864848155e-11, 解析法平均距离 Mean2: 647.07718242019003752
    // SolveEquation.testExecQuarticSolver(-10, -69.67999999999995, -100, 64.22000000000003, -100);
    // SolveEquation.ts:671  - 0.021316x⁴ - 84.73132x³ + 8.180998x² - 93.804396x  + 59.968447 = 0 特征值法平均距离 Mean1: 3.2065983929869239287e-4, 解析法平均距离 Mean2: 3.2069402847129573346e-4
    // SolveEquation.testExecQuarticSolver(- 0.021316, - 84.73132, 8.180998, -93.804396, 59.968447);
    // SolveEquation.ts: 671    0.000772x⁴ - 24.907311x³ - 55.588001x² - 8.752378x + 0.546151 = 0 特征值法平均距离 Mean1: 0.022969309869110471851, 解析法平均距离 Mean2: 0.023022494440575580983
    // SolveEquation.testExecQuarticSolver(0.000772, -24.907311, -55.588001, -8.752378, 0.546151);
    //- 0.029619x⁴ - 2.692767x³ - 76.011744x² + 33.083562x  - 54.933977 = 0 特征值法平均距离 Mean1: 1.348831949311557875e-10, 解析法平均距离 Mean2: 1.733277643747921505e-10
    SolveEquation.testExecQuarticSolver(-0.029619, -2.692767, -76.011744, 33.083562, -54.933977);
    return
    let total = 0;
    let t = 0;
    let n = 0;
    console.warn('一元四次方程测试开始：');
    for (let i = 0; i < 100000; i++) {
      let a = MATHJS.round(MATHJS.random(-100, 100), 6) as number;
      let b = MATHJS.round(MATHJS.random(-100, 100), 6) as number;
      let c = MATHJS.round(MATHJS.random(-100, 100), 6) as number;
      let d = MATHJS.round(MATHJS.random(-100, 100), 6) as number;
      let e = MATHJS.round(MATHJS.random(-100, 100), 6) as number;
      total++;
      // let str =
      //     (a >= 0 ? '   ' + a + 'x⁴' : ' - ' + (-a) + 'x⁴') +
      //     (b >= 0 ? ' + ' + b + 'x³' : ' - ' + (-b) + 'x³') +
      //     (c >= 0 ? ' + ' + c + 'x²' : ' - ' + (-c) + 'x²') +
      //     (d >= 0 ? ' + ' + d + 'x ' : ' - ' + (-d) + 'x ') +
      //     (e >= 0 ? ' + ' + e : ' - ' + (-e));
      const r = SolveEquation.testExecQuarticSolver(a, b, c, d, e);
      if (r) {
        t++;
        // console.log(' 示例: ' + str + ' = 0' + ' T total ' + total + ' t ' + t + ' n ' + n + ' ');
      } else {
        n++;
        // console.log(' 示例: ' + str + ' = 0' + ' N total ' + total + ' t ' + t + ' n ' + n + ' ');
      }
    }
    console.warn('一元四次方程测试完成 共执行 ' + total + ' 次，特征值法 ' + t + ' 次 占比 ' + (t / total * 100).toFixed(2) + '%，解析式法 ' + n + ' 次 占比 ' + (n / total * 100).toFixed(2) + '%。');
  }
}
export { SolveEquation };