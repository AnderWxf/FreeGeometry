import * as MATHJS from '../../../mathjs';

class SolveEquation {

    /**
     * 使用MATHJS.js求解一元二次方程
     * @param {number} a - 二次项系数
     * @param {number} b - 一次项系数  
     * @param {number} c - 常数项
     * @returns {Object} 解的结果
     */
    static SolveQuadraticEquation(a_: number | MATHJS.BigNumber, b_: number | MATHJS.BigNumber, c_: number | MATHJS.BigNumber): Array<MATHJS.Complex | MATHJS.BigNumber> {
        let a = MATHJS.bignumber(a_);
        let b = MATHJS.bignumber(b_);
        let c = MATHJS.bignumber(c_);
        // 输入验证
        if (a.equals(0)) {
            throw new Error('这不是一元二次方程(a不能为0)');
        }
        let _b = MATHJS.unaryMinus(b);
        let _2a = MATHJS.multiply(a, 2);
        // 计算判别式
        const discriminant = MATHJS.subtract(MATHJS.multiply(b, b), MATHJS.multiply(a, c, 4)) as MATHJS.BigNumber;

        let roots = new Array<MATHJS.Complex | MATHJS.BigNumber>();
        let type;

        if (MATHJS.larger(discriminant, 0)) {
            // 两个不等实根
            type = '两个不等实根';
            const sqrtDiscriminant = MATHJS.sqrt(discriminant);
            const root1 = MATHJS.divide(MATHJS.add(_b, sqrtDiscriminant), _2a) as MATHJS.BigNumber;
            const root2 = MATHJS.divide(MATHJS.subtract(_b, sqrtDiscriminant), _2a) as MATHJS.BigNumber;
            roots.push(root1, root2);
        } else if (MATHJS.equal(discriminant, 0)) {
            // 两个相等实根
            type = '两个相等实根';
            const root = MATHJS.divide(_b, _2a) as MATHJS.BigNumber;
            roots = [root, root];
        } else {
            // 两个共轭复根
            type = '两个共轭复根';
            const realPart = MATHJS.divide(_b, _2a) as MATHJS.BigNumber;
            const imaginaryPart = MATHJS.divide(MATHJS.sqrt(MATHJS.unaryMinus(discriminant)), _2a) as MATHJS.BigNumber;
            roots.push(MATHJS.complex(realPart.toNumber(), imaginaryPart.toNumber()), MATHJS.complex(realPart.toNumber(), -imaginaryPart.toNumber()));
        }
        return roots;
    }
    static testExecQuadraticSolver(a: number, b: number, c: number) {
        let str =
            (a >= 0 ? '   ' + a + 'x²' : ' - ' + (-a) + 'x²') +
            (b >= 0 ? ' + ' + b + 'x ' : ' - ' + (-b) + 'x ') +
            (c >= 0 ? ' + ' + c + '  ' : ' - ' + (-c) + '  ');
        const numbericals = SolveEquation.SolveQuadraticEquation(a, b, c);
        let mean2 = MATHJS.bignumber(0);
        // console.log('解析式法解:', numbericals);
        if (numbericals) {
            numbericals.forEach(root => {
                const v = MATHJS.add(
                    MATHJS.add(
                        MATHJS.multiply(MATHJS.pow(root, 2), a),
                        MATHJS.multiply(root, b)),
                    c);
                // console.log('验证: x = ' + MATHJS.format(root, { precision: 20 }) + ' => ' + str + ' = ' + MATHJS.format(v, { precision: 20 }));
                mean2 = MATHJS.add(mean2, MATHJS.abs(v)) as MATHJS.BigNumber;
            });
            mean2 = MATHJS.divide(mean2, numbericals.length) as MATHJS.BigNumber;
        } else {
            mean2 = MATHJS.bignumber(Infinity);
        }
        if (!mean2.lessThanOrEqualTo(1e-10)) {
            console.warn(str + ' = 0' + ' 解析法平均距离 Mean2:', MATHJS.format(mean2, { precision: 20 }));
        }
        return false;
    }
    /**
     * 使用MATHJS.js求解一元三次方程
     * @param {number} a - 三次项系数
     * @param {number} b - 二次项系数
     * @param {number} c - 一次项系数
     * @param {number} d - 常数项
     * @returns {Object} 解的结果
     */
    static SolveCubicNumberical(a_: number | MATHJS.BigNumber, b_: number | MATHJS.BigNumber, c_: number | MATHJS.BigNumber, d_: number | MATHJS.BigNumber): Array<MATHJS.Complex | MATHJS.BigNumber> {
        let a = MATHJS.bignumber(a_);
        let b = MATHJS.bignumber(b_);
        let c = MATHJS.bignumber(c_);
        let d = MATHJS.bignumber(d_);
        // 输入验证
        if (a.equals(0)) {
            throw new Error('这不是一元三次方程（a不能为0）');
        }

        // 将方程化为简化形式: x³ + px² + qx + r = 0
        const p = MATHJS.divide(b, a) as MATHJS.BigNumber;
        const q = MATHJS.divide(c, a) as MATHJS.BigNumber;
        const r = MATHJS.divide(d, a) as MATHJS.BigNumber;
        const p_3 = MATHJS.divide(p, 3) as MATHJS.BigNumber;

        // 进一步化为 depressed cubic: t³ + pt + q = 0 (通过代换 x = t - p/3)

        //depressedP = q - MATHJS.pow(p, 2) / 3;
        const depressedP = MATHJS.subtract(q, MATHJS.divide(MATHJS.multiply(p, p), 3)) as MATHJS.BigNumber;
        //depressedQ = (2 * MATHJS.pow(p, 3)) / 27 - (p * q) / 3 + r
        const depressedQ = MATHJS.add(MATHJS.subtract(MATHJS.multiply(MATHJS.multiply(MATHJS.multiply(p, p), p), MATHJS.divide(MATHJS.bignumber(2), MATHJS.bignumber(27))), MATHJS.divide(MATHJS.multiply(p, q), 3)), r) as MATHJS.BigNumber;

        // 计算判别式
        //discriminant = MATHJS.pow(depressedQ / 2, 2) + MATHJS.pow(depressedP / 3, 3)
        const depressedQ_2 = MATHJS.divide(depressedQ, 2) as MATHJS.BigNumber;
        const depressedP_3 = MATHJS.divide(depressedP, 3) as MATHJS.BigNumber;

        const discriminant = MATHJS.add(MATHJS.multiply(depressedQ_2, depressedQ_2), MATHJS.multiply(MATHJS.multiply(depressedP_3, depressedP_3), depressedP_3)) as MATHJS.BigNumber;

        let roots = new Array<MATHJS.Complex | MATHJS.BigNumber>();
        if (MATHJS.larger(discriminant, 0)) {
            // 一个实根，两个共轭复根
            // const u = MATHJS.cubeRoot(-depressedQ / 2 + MATHJS.sqrt(discriminant));
            // const v = MATHJS.cubeRoot(-depressedQ / 2 - MATHJS.sqrt(discriminant));      

            const dep_ = MATHJS.unaryMinus(depressedQ_2);//-depressedQ / 2
            const sqrt_ = MATHJS.sqrt(discriminant);
            const u = MATHJS.cbrt(MATHJS.add(dep_, sqrt_));
            const v = MATHJS.cbrt(MATHJS.subtract(dep_, sqrt_));

            const realRoot = MATHJS.subtract(MATHJS.add(u, v), p_3) as MATHJS.BigNumber;//u + v - p / 3
            const realPart = MATHJS.subtract(MATHJS.divide(MATHJS.add(u, v), -2), p_3) as MATHJS.BigNumber;//-(u + v) / 2 - p / 3
            const imaginaryPart = (MATHJS.multiply(MATHJS.subtract(u, v), MATHJS.divide(MATHJS.bignumber(MATHJS.sqrt(3) as number), 2))) as MATHJS.BigNumber;//(u - v) * MATHJS.sqrt(3) / 2
            const complexRoot1 = MATHJS.complex(realPart.toNumber(), imaginaryPart.toNumber());
            const complexRoot2 = MATHJS.complex(realPart.toNumber(), -imaginaryPart.toNumber());
            roots.push(realRoot, complexRoot1, complexRoot2);

        } else if (MATHJS.equal(discriminant, 0)) {
            // 三个实根（至少两个相等）
            // const u = MATHJS.cubeRoot(-depressedQ / 2);
            // const root1 = 2 * u - p / 3;
            // const root2 = -u - p / 3;
            // const root3 = -u - p / 3;            
            const u = MATHJS.cbrt(MATHJS.unaryMinus(depressedQ_2));//-depressedQ / 2
            const root1 = MATHJS.subtract(MATHJS.multiply(2, u), p_3) as MATHJS.BigNumber;//2 * u - p / 3
            const root2 = MATHJS.subtract(MATHJS.unaryMinus(u), p_3) as MATHJS.BigNumber; //-u - p / 3;
            const root3 = MATHJS.subtract(MATHJS.unaryMinus(u), p_3) as MATHJS.BigNumber; //-u - p / 3;

            roots.push(root1, root2, root3);
        } else {
            // 三个不等实根（需要三角函数解）
            // const r = MATHJS.sqrt(MATHJS.pow(-depressedP / 3, 3));
            // const theta = MATHJS.acos(-depressedQ / (2 * r));
            // const root1 = 2 * MATHJS.cubeRoot(r) * MATHJS.cos(theta / 3) - p / 3;
            // const root2 = 2 * MATHJS.cubeRoot(r) * MATHJS.cos((theta + 2 * MATHJS.pi) / 3) - p / 3;
            // const root3 = 2 * MATHJS.cubeRoot(r) * MATHJS.cos((theta + 4 * MATHJS.pi) / 3) - p / 3;

            const r = MATHJS.sqrt(MATHJS.pow(MATHJS.unaryMinus(depressedP_3), 3) as MATHJS.BigNumber);
            let angle = MATHJS.divide(depressedQ, MATHJS.multiply(r, -2)) as MATHJS.BigNumber;
            angle = MATHJS.max(MATHJS.bignumber(-1), MATHJS.min(MATHJS.bignumber(1), angle));
            const theta = MATHJS.acos(angle);

            const theta_3 = MATHJS.divide(theta, 3) as MATHJS.BigNumber;
            const r_2_3 = MATHJS.multiply(MATHJS.cbrt(r), 2) as MATHJS.BigNumber;
            const pi_2 = MATHJS.add(MATHJS.bignumber(MATHJS.pi), MATHJS.bignumber(MATHJS.pi)) as MATHJS.BigNumber;
            const pi_4 = MATHJS.add(pi_2, pi_2) as MATHJS.BigNumber;

            const root1 = MATHJS.subtract(MATHJS.multiply(r_2_3, MATHJS.cos(theta_3)), p_3) as MATHJS.BigNumber;
            const root2 = MATHJS.subtract(MATHJS.multiply(r_2_3, MATHJS.cos(MATHJS.divide(MATHJS.add(theta, pi_2), 3) as MATHJS.BigNumber)), p_3) as MATHJS.BigNumber;
            const root3 = MATHJS.subtract(MATHJS.multiply(r_2_3, MATHJS.cos(MATHJS.divide(MATHJS.add(theta, pi_4), 3) as MATHJS.BigNumber)), p_3) as MATHJS.BigNumber;
            roots.push(root1, root2, root3);
        }
        roots.sort();
        return roots;
    }
    /**
     * 更稳定的三次方程求解方法（使用特征值方法）
     */
    static SolveCubicStable(a: number, b: number, c: number, d: number): Array<MATHJS.Complex | MATHJS.BigNumber> {
        if (a === 0)
            throw new Error('a不能为0');

        // 构造伴随矩阵
        // const companionMatrix = [
        //     [0, 1, 0],
        //     [0, 0, 1],
        //     [-d / a, -c / a, -b / a]
        // ];
        let companionMatrix = new Array<Array<MATHJS.BigNumber>>(3);
        let row0 = new Array<MATHJS.BigNumber>(3);
        let row1 = new Array<MATHJS.BigNumber>(3);
        let row2 = new Array<MATHJS.BigNumber>(3);
        row0[0] = MATHJS.bignumber(0);
        row0[1] = MATHJS.bignumber(1);
        row0[2] = MATHJS.bignumber(0);
        row1[0] = MATHJS.bignumber(0);
        row1[1] = MATHJS.bignumber(0);
        row1[2] = MATHJS.bignumber(1);
        row2[0] = MATHJS.bignumber(-d / a);
        row2[1] = MATHJS.bignumber(-c / a);
        row2[2] = MATHJS.bignumber(-b / a);
        companionMatrix[0] = row0;
        companionMatrix[1] = row1;
        companionMatrix[2] = row2;
        try {
            // 计算特征值（即方程的根）
            const eigenValues = MATHJS.eigs(companionMatrix).values;
            let roots = new Array<MATHJS.Complex | MATHJS.BigNumber>();
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
    static SolveCubicEquation(a: number, b: number, c: number, d: number): Array<MATHJS.Complex | MATHJS.BigNumber> {
        const stables = SolveEquation.SolveCubicStable(a, b, c, d);
        if (!stables) {
            return SolveEquation.SolveCubicNumberical(a, b, c, d)
        }
        const numbericals = SolveEquation.SolveCubicNumberical(a, b, c, d);
        const roots1 = stables;
        const roots2 = numbericals;
        let mean1 = MATHJS.bignumber(0);
        let mean2 = MATHJS.bignumber(0);
        // 比较两个结果，选择更准确的那个
        roots1.forEach(root => {
            const v = MATHJS.add(
                MATHJS.add(
                    MATHJS.add(
                        MATHJS.multiply(MATHJS.pow(root, 4), a),
                        MATHJS.multiply(MATHJS.pow(root, 3), b)),
                    MATHJS.multiply(MATHJS.pow(root, 2), c)),
                MATHJS.multiply(root, d));
            mean1 = MATHJS.add(mean1, MATHJS.abs(v)) as MATHJS.BigNumber;
        });
        mean1 = MATHJS.divide(mean1, roots1.length) as MATHJS.BigNumber;
        roots2.forEach(root => {
            const v =
                MATHJS.add(
                    MATHJS.add(
                        MATHJS.add(
                            MATHJS.multiply(MATHJS.pow(root, 4), a),
                            MATHJS.multiply(MATHJS.pow(root, 3), b)),
                        MATHJS.multiply(MATHJS.pow(root, 2), c)),
                    MATHJS.multiply(root, d));
            mean2 = MATHJS.add(mean2, MATHJS.abs(v)) as MATHJS.BigNumber;
        });
        mean2 = MATHJS.divide(mean2, roots2.length) as MATHJS.BigNumber;
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
        let mean1 = MATHJS.bignumber(0);
        let mean2 = MATHJS.bignumber(0);
        if (stables) {
            stables.forEach(root => {
                const v = MATHJS.add(
                    MATHJS.add(
                        MATHJS.add(
                            MATHJS.multiply(MATHJS.pow(root, 3), a),
                            MATHJS.multiply(MATHJS.pow(root, 2), b)),
                        MATHJS.multiply(root, c)),
                    d);
                // console.log('验证: x = ' + MATHJS.format(root, { precision: 20 }) + ' => ' + str + ' = ' + MATHJS.format(v, { precision: 20 }));
                mean1 = MATHJS.add(mean1, MATHJS.abs(v)) as MATHJS.BigNumber;
            });
            mean1 = MATHJS.divide(mean1, stables.length) as MATHJS.BigNumber;
        } else {
            mean1 = MATHJS.bignumber(Infinity);
        }
        const numbericals = SolveEquation.SolveCubicNumberical(a, b, c, d);
        // console.log('解析式法解:', numbericals);
        if (numbericals) {
            numbericals.forEach(root => {
                const v = MATHJS.add(
                    MATHJS.add(
                        MATHJS.add(
                            MATHJS.multiply(MATHJS.pow(root, 3), a),
                            MATHJS.multiply(MATHJS.pow(root, 2), b)),
                        MATHJS.multiply(root, c)),
                    d);
                // console.log('验证: x = ' + MATHJS.format(root, { precision: 20 }) + ' => ' + str + ' = ' + MATHJS.format(v, { precision: 20 }));
                mean2 = MATHJS.add(mean2, MATHJS.abs(v)) as MATHJS.BigNumber;
            });
            mean2 = MATHJS.divide(mean2, numbericals.length) as MATHJS.BigNumber;
        } else {
            mean2 = MATHJS.bignumber(Infinity);
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
    static SolveQuarticNumberical(a_: number | MATHJS.BigNumber, b_: number | MATHJS.BigNumber, c_: number | MATHJS.BigNumber, d_: number | MATHJS.BigNumber, e_: number | MATHJS.BigNumber): Array<MATHJS.Complex | MATHJS.BigNumber> {
        let a = MATHJS.bignumber(a_);
        let b = MATHJS.bignumber(b_);
        let c = MATHJS.bignumber(c_);
        let d = MATHJS.bignumber(d_);
        let e = MATHJS.bignumber(e_);
        // 输入验证
        if (a.equals(0)) {
            throw new Error('这不是一元四次方程（a不能为0）');
        }

        // 将方程化为简化形式: x⁴ + px³ + qx² + rx + s = 0
        // const p = b / a;
        // const q = c / a;
        // const r = d / a;
        // const s = e / a;

        const p = MATHJS.divide(b, a) as MATHJS.BigNumber;
        const q = MATHJS.divide(c, a) as MATHJS.BigNumber;
        const r = MATHJS.divide(d, a) as MATHJS.BigNumber;
        const s = MATHJS.divide(e, a) as MATHJS.BigNumber;

        const p_4 = MATHJS.divide(p, 4) as MATHJS.BigNumber;

        // 转换为缺项四次方程: y⁴ + Ay² + By + C = 0 (通过代换 x = y - p/4)
        // const A = q - (3 * p * p) / 8;
        // const B = r + (p * p * p) / 8 - (p * q) / 2;
        // const C = s - (3 * p * p * p * p) / 256 + (p * p * q) / 16 - (p * r) / 4;

        const A = MATHJS.subtract(q, MATHJS.divide(MATHJS.multiply(MATHJS.multiply(p, p), 3), 8)) as MATHJS.BigNumber;
        const B = MATHJS.subtract(MATHJS.add(r, MATHJS.divide(MATHJS.pow(p, 3), 8)), MATHJS.divide(MATHJS.multiply(p, q), 2)) as MATHJS.BigNumber;
        const C = MATHJS.subtract(MATHJS.add(MATHJS.subtract(s, MATHJS.divide(MATHJS.multiply(MATHJS.pow(p, 4), 3), 256)), MATHJS.divide(MATHJS.multiply(MATHJS.pow(p, 2), q), 16)), MATHJS.divide(MATHJS.multiply(p, r), 4)) as MATHJS.BigNumber;

        // 求解三次预解方程: m³ - (A/2)m² - Cm + (A*C/2 - B²/8) = 0
        // const cubicA = 1;
        // const cubicB = -A / 2;
        // const cubicC = -C;
        // const cubicD = (A * C) / 2 - (B * B) / 8;

        const cubicA = 1;
        const cubicB = MATHJS.divide(A, -2) as MATHJS.BigNumber;
        const cubicC = MATHJS.unaryMinus(C);
        const cubicD = MATHJS.subtract(MATHJS.divide(MATHJS.multiply(A, C), 2), MATHJS.divide(MATHJS.multiply(B, B), 8)) as MATHJS.BigNumber;

        // 使用三次方程求解器
        // const mRoots = SolveEquation.SolveCubicEquation(cubicA, cubicB.toNumber(), cubicC.toNumber(), cubicD.toNumber());
        const mRoots = SolveEquation.SolveCubicNumberical(cubicA, cubicB, cubicC, cubicD);

        // 选择实数根作为m
        let m: MATHJS.BigNumber = MATHJS.bignumber(-Infinity);
        for (let root of mRoots) {
            if (MATHJS.typeOf(root) === 'BigNumber') {
                if (MATHJS.larger(root, m))
                    m = root as MATHJS.BigNumber;
                continue;
            }
            if (MATHJS.typeOf(root) === 'Complex') {
                root = root as MATHJS.Complex;
                if (root.im === 0) {
                    if (MATHJS.larger(root.re, m))
                        m = MATHJS.bignumber(root.re);
                    continue;
                }
            }
        }

        if (m === undefined) {
            throw new Error('无法找到合适的实数预解根');
        }
        let m_ = MATHJS.bignumber(m);
        // 构建二次方程参数
        // const sqrt2mMinusA = MATHJS.sqrt(2 * m - A);
        // const sqrtM2MinusC = MATHJS.sqrt(m * m - C);
        const sqrt2mMinusA_ = MATHJS.sqrt(MATHJS.subtract(MATHJS.multiply(m_, 2), A) as MATHJS.BigNumber);
        const sqrtM2MinusC_ = MATHJS.sqrt(MATHJS.subtract(MATHJS.multiply(m_, m_), C) as MATHJS.BigNumber);
        let sqrt2mMinusA: MATHJS.BigNumber;
        let sqrtM2MinusC: MATHJS.BigNumber;
        if (MATHJS.isNumeric(sqrt2mMinusA_)) {
            sqrt2mMinusA = sqrt2mMinusA_;
        } else {
            sqrt2mMinusA = MATHJS.bignumber((sqrt2mMinusA_ as MATHJS.Complex).re);
        }
        if (MATHJS.isNumeric(sqrtM2MinusC_)) {
            sqrtM2MinusC = sqrtM2MinusC_;
        } else {
            sqrtM2MinusC = MATHJS.bignumber((sqrtM2MinusC_ as MATHJS.Complex).re);
        }

        let roots = new Array<MATHJS.Complex | MATHJS.BigNumber>();
        // 情况1: B >= 0
        // const signB = B >= 0 ? 1 : -1;
        // const alpha = sqrt2mMinusA;
        // const beta = signB * sqrtM2MinusC;
        const alpha = sqrt2mMinusA;
        let beta = sqrtM2MinusC;
        if (B.lessThan(0)) {
            beta = MATHJS.unaryMinus(beta);
        }

        // 解第一个二次方程: y² - αy + (m + β) = 0
        // const discriminant1 = alpha * alpha - 4 * (m + beta);
        const discriminant1 = MATHJS.subtract(MATHJS.multiply(alpha, alpha), MATHJS.multiply(MATHJS.add(m_, beta), 4)) as MATHJS.BigNumber;
        if (MATHJS.largerEq(discriminant1, 0)) {
            // const root1 = (alpha + MATHJS.sqrt(discriminant1)) / 2;
            // const root2 = (alpha - MATHJS.sqrt(discriminant1)) / 2;
            const root1 = MATHJS.divide(MATHJS.add(alpha, MATHJS.sqrt(discriminant1)), 2);
            const root2 = MATHJS.divide(MATHJS.subtract(alpha, MATHJS.sqrt(discriminant1)), 2);
            // roots.push(root1 - p / 4, root2 - p / 4);
            const r1 = MATHJS.subtract(root1, p_4) as any;
            const r2 = MATHJS.subtract(root2, p_4) as any;
            roots.push(r1);
            roots.push(r2);
        } else {
            // const realPart = alpha / 2;
            // const imagPart = MATHJS.sqrt(-discriminant1) / 2;
            // roots.push(
            //     MATHJS.complex(realPart, imagPart) - p / 4,
            //     MATHJS.complex(realPart, -imagPart) - p / 4
            // );
            const realPart = MATHJS.subtract(MATHJS.divide(alpha, 2), p_4) as MATHJS.BigNumber;
            const imagPart = MATHJS.divide(MATHJS.sqrt(MATHJS.unaryMinus(discriminant1)), 2) as MATHJS.BigNumber;
            const root1 = MATHJS.complex(realPart.toNumber(), imagPart.toNumber());
            const root2 = MATHJS.complex(realPart.toNumber(), -imagPart.toNumber());
            roots.push(root1, root2);
        }

        // 解第二个二次方程: y² + αy + (m - β) = 0
        // const discriminant2 = alpha * alpha - 4 * (m - beta);
        const discriminant2 = MATHJS.subtract(MATHJS.multiply(alpha, alpha), MATHJS.multiply(MATHJS.subtract(m_, beta), 4)) as MATHJS.BigNumber;
        if (MATHJS.largerEq(discriminant2, 0)) {
            // const root3 = (-alpha + MATHJS.sqrt(discriminant2)) / 2;
            // const root4 = (-alpha - MATHJS.sqrt(discriminant2)) / 2;
            // roots.push(root3 - p / 4, root4 - p / 4);
            const root3 = MATHJS.divide(MATHJS.add(MATHJS.unaryMinus(alpha), MATHJS.sqrt(discriminant2)), 2);
            const root4 = MATHJS.divide(MATHJS.subtract(MATHJS.unaryMinus(alpha), MATHJS.sqrt(discriminant2)), 2);
            const r3 = MATHJS.subtract(root3, p_4) as any;
            const r4 = MATHJS.subtract(root4, p_4) as any;
            roots.push(r3);
            roots.push(r4);
        } else {
            // const realPart = -alpha / 2;
            // const imagPart = MATHJS.sqrt(-discriminant2) / 2;
            // roots.push(
            //     MATHJS.complex(realPart, imagPart) - p / 4,
            //     MATHJS.complex(realPart, -imagPart) - p / 4
            // );
            const realPart = MATHJS.subtract(MATHJS.divide(alpha, -2), p_4) as MATHJS.BigNumber;
            const imagPart = MATHJS.divide(MATHJS.sqrt(MATHJS.unaryMinus(discriminant2)), 2) as MATHJS.BigNumber;
            const root3 = MATHJS.complex(realPart.toNumber(), imagPart.toNumber());
            const root4 = MATHJS.complex(realPart.toNumber(), -imagPart.toNumber());
            roots.push(root3, root4);
        }
        roots.sort();
        return roots;
    }

    /**
     * 使用特征值方法求解四次方程（更稳定）
     */
    static SolveQuarticStable(a: number, b: number, c: number, d: number, e: number): Array<MATHJS.Complex | MATHJS.BigNumber> {
        if (a === 0) throw new Error('a不能为0');

        // 构造伴随矩阵
        // const companionMatrix = [
        //     [0, 1, 0, 0],
        //     [0, 0, 1, 0],
        //     [0, 0, 0, 1],
        //     [-e / a, -d / a, -c / a, -b / a]
        // ];

        let companionMatrix = new Array<Array<MATHJS.BigNumber>>(4);
        let row0 = new Array<MATHJS.BigNumber>(4);
        let row1 = new Array<MATHJS.BigNumber>(4);
        let row2 = new Array<MATHJS.BigNumber>(4);
        let row3 = new Array<MATHJS.BigNumber>(4);
        row0[0] = MATHJS.bignumber(0);
        row0[1] = MATHJS.bignumber(1);
        row0[2] = MATHJS.bignumber(0);
        row0[3] = MATHJS.bignumber(0);

        row1[0] = MATHJS.bignumber(0);
        row1[1] = MATHJS.bignumber(0);
        row1[2] = MATHJS.bignumber(1);
        row1[3] = MATHJS.bignumber(0);

        row2[0] = MATHJS.bignumber(0);
        row2[1] = MATHJS.bignumber(0);
        row2[2] = MATHJS.bignumber(0);
        row2[3] = MATHJS.bignumber(1);

        row3[0] = MATHJS.divide(MATHJS.bignumber(-e), MATHJS.bignumber(a)) as MATHJS.BigNumber;
        row3[1] = MATHJS.divide(MATHJS.bignumber(-d), MATHJS.bignumber(a)) as MATHJS.BigNumber;
        row3[2] = MATHJS.divide(MATHJS.bignumber(-c), MATHJS.bignumber(a)) as MATHJS.BigNumber;
        row3[3] = MATHJS.divide(MATHJS.bignumber(-b), MATHJS.bignumber(a)) as MATHJS.BigNumber;

        companionMatrix[0] = row0;
        companionMatrix[1] = row1;
        companionMatrix[2] = row2;
        companionMatrix[3] = row3;
        // 计算特征值（即方程的根）
        try {
            const eigenValues = MATHJS.eigs(companionMatrix).values;
            let roots = new Array<MATHJS.Complex | MATHJS.BigNumber>();
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
    static SolveQuarticEquation(a: number, b: number, c: number, d: number, e: number): Array<MATHJS.Complex | MATHJS.BigNumber> {
        const stables = SolveEquation.SolveQuarticStable(a, b, c, d, e);
        if (!stables) {
            return SolveEquation.SolveQuarticNumberical(a, b, c, d, e);
        }
        const numbericals = SolveEquation.SolveQuarticNumberical(a, b, c, d, e);
        const roots1 = stables;
        const roots2 = numbericals;
        let mean1 = MATHJS.bignumber(0);
        let mean2 = MATHJS.bignumber(0);
        // 比较两个结果，选择更准确的那个
        roots1.forEach(root => {
            const v = MATHJS.add(
                MATHJS.add(
                    MATHJS.add(
                        MATHJS.add(
                            MATHJS.multiply(MATHJS.pow(root, 4), a),
                            MATHJS.multiply(MATHJS.pow(root, 3), b)),
                        MATHJS.multiply(MATHJS.pow(root, 2), c)),
                    MATHJS.multiply(root, d)),
                e);
            mean1 = MATHJS.add(mean1, MATHJS.abs(v)) as MATHJS.BigNumber;
        });
        mean1 = MATHJS.divide(mean1, roots1.length) as MATHJS.BigNumber;
        roots2.forEach(root => {
            const v = MATHJS.add(
                MATHJS.add(
                    MATHJS.add(
                        MATHJS.add(
                            MATHJS.multiply(MATHJS.pow(root, 4), a),
                            MATHJS.multiply(MATHJS.pow(root, 3), b)),
                        MATHJS.multiply(MATHJS.pow(root, 2), c)),
                    MATHJS.multiply(root, d)),
                e);
            mean2 = MATHJS.add(mean2, MATHJS.abs(v)) as MATHJS.BigNumber;
        });
        mean2 = MATHJS.divide(mean2, roots2.length) as MATHJS.BigNumber;
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
        let mean1 = MATHJS.bignumber(0);
        let mean2 = MATHJS.bignumber(0);
        // 比较两个结果，选择更准确的那个
        if (stables) {
            stables.forEach(root => {
                const v = MATHJS.add(
                    MATHJS.add(
                        MATHJS.add(
                            MATHJS.add(
                                MATHJS.multiply(MATHJS.pow(root, 4), a),
                                MATHJS.multiply(MATHJS.pow(root, 3), b)),
                            MATHJS.multiply(MATHJS.pow(root, 2), c)),
                        MATHJS.multiply(root, d)),
                    e);
                // console.log('验证: x = ' + MATHJS.format(root, { precision: 20 }) + ' => ' + str + ' = ' + MATHJS.format(v, { precision: 20 }));
                mean1 = MATHJS.add(mean1, MATHJS.abs(v)) as MATHJS.BigNumber;
            });
            mean1 = MATHJS.divide(mean1, stables.length) as MATHJS.BigNumber;
        } else {
            mean1 = MATHJS.bignumber(Infinity);
        }
        // console.log('解析式法解:', numbericals);
        if (numbericals) {
            numbericals.forEach(root => {
                const v = MATHJS.add(
                    MATHJS.add(
                        MATHJS.add(
                            MATHJS.add(
                                MATHJS.multiply(MATHJS.pow(root, 4), a),
                                MATHJS.multiply(MATHJS.pow(root, 3), b)),
                            MATHJS.multiply(MATHJS.pow(root, 2), c)),
                        MATHJS.multiply(root, d)),
                    e);
                // console.log('验证: x = ' + MATHJS.format(root, { precision: 20 }) + ' => ' + str + ' = ' + MATHJS.format(v, { precision: 20 }));
                mean2 = MATHJS.add(mean2, MATHJS.abs(v)) as MATHJS.BigNumber;
            });
            mean2 = MATHJS.divide(mean2, numbericals.length) as MATHJS.BigNumber;
        } else {
            mean2 = MATHJS.bignumber(Infinity);
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