import * as MATHJS from '../../../mathjs';

class SolveEquation {

    /**
     * 使用MATHJS.js求解一元二次方程
     * @param {number} a - 二次项系数
     * @param {number} b - 一次项系数  
     * @param {number} c - 常数项
     * @returns {Object} 解的结果
     */
    static SolveQuadraticEquation(a_: number | MATHJS.BigNumber, b_: number | MATHJS.BigNumber, c_: number | MATHJS.BigNumber): Array<MATHJS.Complex | number> {
        let a = MATHJS.bignumber(a_);
        let b = MATHJS.bignumber(b_);
        let c = MATHJS.bignumber(c_);
        // 输入验证
        if (a.equals(0)) {
            throw new Error('这不是一元二次方程(a不能为0)');
        }

        // 计算判别式
        const discriminant = MATHJS.subtract(
            MATHJS.pow(b, 2),
            MATHJS.multiply(4, a, c)
        ) as MATHJS.BigNumber;

        let roots = new Array<MATHJS.Complex | number>();
        let type;

        if (MATHJS.larger(discriminant, 0)) {
            // 两个不等实根
            type = '两个不等实根';
            const sqrtDiscriminant = MATHJS.sqrt(discriminant);
            const root1 = MATHJS.divide(MATHJS.add(-b, sqrtDiscriminant), MATHJS.multiply(2, a)) as MATHJS.BigNumber;
            const root2 = MATHJS.divide(MATHJS.subtract(-b, sqrtDiscriminant), MATHJS.multiply(2, a)) as MATHJS.BigNumber;

            roots.push(root1.toNumber(), root2.toNumber());
        } else if (MATHJS.equal(discriminant, 0)) {
            // 两个相等实根
            type = '两个相等实根';
            const root = MATHJS.divide(-b, MATHJS.multiply(2, a)) as MATHJS.BigNumber;

            roots = [root.toNumber(), root.toNumber()];
        } else {
            // 两个共轭复根
            type = '两个共轭复根';
            const realPart = MATHJS.divide(-b, MATHJS.multiply(2, a)) as MATHJS.BigNumber;
            const imaginaryPart = MATHJS.divide(
                MATHJS.sqrt(MATHJS.unaryMinus(discriminant)),
                MATHJS.multiply(2, a)
            ) as MATHJS.BigNumber;

            roots.push(MATHJS.complex(realPart.toNumber(), imaginaryPart.toNumber()), MATHJS.complex(realPart.toNumber(), -imaginaryPart.toNumber()));
        }
        return roots;
        // return {
        //     方程: `${a}x² + ${b}x + ${c} = 0`,
        //     判别式: discriminant,
        //     根的类型: type,
        //     roots: roots,
        //     解的数值形式: roots.map(root => MATHJS.format(root, { precision: 14 }))
        // };
    }

    static test() {
        // 示例测试
        try {
            // 示例1: 两个不等实根
            console.log('示例1: x² - 5x + 6 = 0');
            console.log(SolveEquation.SolveQuadraticEquation(1, -5, 6));
            console.log('\n' + '='.repeat(50) + '\n');

            // 示例2: 两个相等实根
            console.log('示例2: x² - 4x + 4 = 0');
            console.log(SolveEquation.SolveQuadraticEquation(1, -4, 4));
            console.log('\n' + '='.repeat(50) + '\n');

            // 示例3: 两个共轭复根
            console.log('示例3: x² + 2x + 5 = 0');
            console.log(SolveEquation.SolveQuadraticEquation(1, 2, 5));
            console.log('\n' + '='.repeat(50) + '\n');

            // 示例4: 带小数的方程
            console.log('示例4: 2.5x² - 3.7x + 1.2 = 0');
            console.log(SolveEquation.SolveQuadraticEquation(2.5, -3.7, 1.2));

        } catch (error) {
            console.error('错误:', error.message);
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
    static SolveCubicEquation(a_: number | MATHJS.BigNumber, b_: number | MATHJS.BigNumber, c_: number | MATHJS.BigNumber, d_: number | MATHJS.BigNumber): Array<MATHJS.Complex | number> {
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

        // 进一步化为 depressed cubic: t³ + pt + q = 0 (通过代换 x = t - p/3)
        const depressedP = MATHJS.subtract(q, MATHJS.divide(MATHJS.pow(p, 2), 3)) as MATHJS.BigNumber;//q - MATHJS.pow(p, 2) / 3;
        const depressedQ = MATHJS.add(MATHJS.subtract(MATHJS.multiply(MATHJS.pow(p, 3), MATHJS.bignumber(2 / 27)), MATHJS.divide(MATHJS.multiply(p, q), 3)), r) as MATHJS.BigNumber;    //(2 * MATHJS.pow(p, 3)) / 27 - (p * q) / 3 + r


        // 计算判别式
        const discriminant = MATHJS.add(MATHJS.pow(MATHJS.divide(depressedQ, 2), 2), MATHJS.pow(MATHJS.divide(depressedP, 3), 3)) as MATHJS.BigNumber;//MATHJS.pow(depressedQ / 2, 2) + MATHJS.pow(depressedP / 3, 3)

        let roots = new Array<MATHJS.Complex | number>();
        let type;

        if (MATHJS.larger(discriminant, 0)) {
            // 一个实根，两个共轭复根
            type = '一个实根，两个共轭复根';
            // const u = MATHJS.cubeRoot(-depressedQ / 2 + MATHJS.sqrt(discriminant));
            // const v = MATHJS.cubeRoot(-depressedQ / 2 - MATHJS.sqrt(discriminant));      

            const dep_ = MATHJS.bignumber(MATHJS.divide(-depressedQ, 2));//-depressedQ / 2
            const sqrt_ = MATHJS.sqrt(discriminant);
            const u = MATHJS.cbrt(MATHJS.add(dep_, sqrt_));
            const v = MATHJS.cbrt(MATHJS.subtract(dep_, sqrt_));

            const realRoot = MATHJS.subtract(MATHJS.add(u, v), MATHJS.divide(p, 3)) as MATHJS.BigNumber;//u + v - p / 3
            const realPart = MATHJS.subtract(MATHJS.divide(MATHJS.add(u, v), -2), MATHJS.divide(p, 3)) as MATHJS.BigNumber;//-(u + v) / 2 - p / 3
            const imaginaryPart = (MATHJS.multiply(MATHJS.subtract(u, v), MATHJS.divide(MATHJS.bignumber(MATHJS.sqrt(3) as number), 2))) as MATHJS.BigNumber;//(u - v) * MATHJS.sqrt(3) / 2
            const complexRoot1 = MATHJS.complex(realPart.toNumber(), imaginaryPart.toNumber());
            const complexRoot2 = MATHJS.complex(realPart.toNumber(), -imaginaryPart.toNumber());
            roots.push(realRoot.toNumber(), complexRoot1, complexRoot2);
        } else if (MATHJS.equal(discriminant, 0)) {
            // 三个实根（至少两个相等）
            type = '三个实根（至少两个相等）';
            // const u = MATHJS.cubeRoot(-depressedQ / 2);
            // const root1 = 2 * u - p / 3;
            // const root2 = -u - p / 3;
            // const root3 = -u - p / 3;            
            const u = MATHJS.cbrt(MATHJS.divide(depressedQ, -2) as MATHJS.BigNumber);//-depressedQ / 2
            const p_3 = MATHJS.divide(p, 3) as MATHJS.BigNumber;
            const root1 = MATHJS.subtract(MATHJS.multiply(2, u), p_3) as MATHJS.BigNumber;//2 * u - p / 3
            const root2 = MATHJS.subtract(MATHJS.bignumber(-u), p_3) as MATHJS.BigNumber; //-u - p / 3;
            const root3 = MATHJS.subtract(MATHJS.bignumber(-u), p_3) as MATHJS.BigNumber; //-u - p / 3;

            roots.push(root1.toNumber(), root2.toNumber(), root3.toNumber());
        } else {
            // 三个不等实根（需要三角函数解）
            type = '三个不等实根';
            // const r = MATHJS.sqrt(MATHJS.pow(-depressedP / 3, 3));
            // const theta = MATHJS.acos(-depressedQ / (2 * r));
            // const root1 = 2 * MATHJS.cubeRoot(r) * MATHJS.cos(theta / 3) - p / 3;
            // const root2 = 2 * MATHJS.cubeRoot(r) * MATHJS.cos((theta + 2 * MATHJS.pi) / 3) - p / 3;
            // const root3 = 2 * MATHJS.cubeRoot(r) * MATHJS.cos((theta + 4 * MATHJS.pi) / 3) - p / 3;

            const r = MATHJS.bignumber(MATHJS.pow(MATHJS.pow(-MATHJS.divide(depressedP, 3), 3), 0.5) as MATHJS.BigNumber);
            const angle = MATHJS.divide(depressedQ, MATHJS.bignumber(-MATHJS.multiply(r, 2))) as MATHJS.BigNumber;
            const theta = MATHJS.acos(angle);

            const theta_3 = MATHJS.divide(theta, 3) as MATHJS.BigNumber;
            const p_3 = MATHJS.divide(p, 3) as MATHJS.BigNumber;
            const p_2_3 = MATHJS.multiply(MATHJS.pow(r, MATHJS.bignumber(1 / 3)), 2) as MATHJS.BigNumber;
            const r_2_3 = MATHJS.multiply(MATHJS.pow(r, MATHJS.bignumber(1 / 3)), 2) as MATHJS.BigNumber;

            const root1 = MATHJS.subtract(MATHJS.multiply(p_2_3, MATHJS.cos(theta_3)), p_3) as MATHJS.BigNumber;
            const root2 = MATHJS.subtract(MATHJS.multiply(r_2_3, MATHJS.cos(MATHJS.divide(MATHJS.add(theta, MATHJS.bignumber(2 * MATHJS.pi)), 3) as MATHJS.BigNumber)), p_3) as MATHJS.BigNumber;
            const root3 = MATHJS.subtract(MATHJS.multiply(r_2_3, MATHJS.cos(MATHJS.divide(MATHJS.add(theta, MATHJS.bignumber(4 * MATHJS.pi)), 3) as MATHJS.BigNumber)), p_3) as MATHJS.BigNumber;

            roots.push(root1.toNumber(), root2.toNumber(), root3.toNumber());
        }
        return roots;
        // return { 
        //     方程: `${a}x³ + ${b}x² + ${c}x + ${d} = 0`,
        //     简化形式: `x³ + ${p}x² + ${q}x + ${r} = 0`,
        //     判别式: discriminant,
        //     根的类型: type,
        //     roots: roots,
        //     解的数值形式: roots.map(root => {
        //         if (typeof root === 'number') {
        //             return MATHJS.format(root, { precision: 20 });
        //         } else {
        //             return MATHJS.format(root, { precision: 20 });
        //         }
        //     })
        // };
    }

    /**
     * 更稳定的三次方程求解方法（使用特征值方法）
     */
    static SolveCubicStable(a: number, b: number, c: number, d: number): Array<MATHJS.Complex | number> {
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
            let roots = new Array<MATHJS.Complex | number>();
            eigenValues.forEach(element => {
                if (MATHJS.typeOf(element) === 'Complex') {
                    roots.push(element);
                }
                else {
                    if (MATHJS.typeOf(element) === 'BigNumber') {
                        roots.push(element.toNumber());
                    } else {
                        roots.push(element);
                    }
                }
            });
            return roots;
        } catch (error) {
            // 如果特征值计算失败，回退到代数方法
            console.warn('特征值方法失败，使用代数方法:', error.message);
            return SolveEquation.SolveCubicEquation(a, b, c, d);
        }
    }

    // 示例测试
    static testCubicSolver() {
        console.log('一元三次方程求解器测试\n');

        try {
            // 示例1: 三个实根
            console.log('示例1: x³ - 6x² + 11x - 6 = 0 (根: 1, 2, 3)');
            const result1 = SolveEquation.SolveCubicEquation(1, -6, 11, -6);
            console.log(result1);
            console.log('稳定方法解:', SolveEquation.SolveCubicStable(1, -6, 11, -6));
            console.log('\n' + '='.repeat(60) + '\n');

            // 示例2: 一个实根，两个复根
            console.log('示例2: x³ + x + 1 = 0');
            const result2 = SolveEquation.SolveCubicEquation(1, 0, 1, 1);
            console.log(result2);
            console.log('稳定方法解:', SolveEquation.SolveCubicStable(1, 0, 1, 1));
            console.log('\n' + '='.repeat(60) + '\n');

            // 示例3: 三个实根（有重根）
            console.log('示例3: x³ - 3x² + 3x - 1 = 0 (三重根: 1)');
            const result3 = SolveEquation.SolveCubicEquation(1, -3, 3, -1);
            console.log(result3);
            console.log('稳定方法解:', SolveEquation.SolveCubicStable(1, -3, 3, -1));
            console.log('\n' + '='.repeat(60) + '\n');

            // 示例4: 复杂系数
            console.log('示例4: 2x³ - 4x² + 3x - 5 = 0');
            const result4 = SolveEquation.SolveCubicEquation(2, -4, 3, -5);
            console.log(result4);
            console.log('稳定方法解:', SolveEquation.SolveCubicStable(2, -4, 3, -5));
            console.log('\n' + '='.repeat(60) + '\n');

            // 示例5: 实际应用问题
            console.log('示例5: 体积问题 x³ - 12x² + 44x - 48 = 0');
            const result5 = SolveEquation.SolveCubicEquation(1, -12, 44, -48);
            console.log(result5);
            console.log('稳定方法解:', SolveEquation.SolveCubicStable(1, -12, 44, -48));

        } catch (error) {
            console.error('错误:', error.message);
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
    static SolveQuarticEquation(a_: number | MATHJS.BigNumber, b_: number | MATHJS.BigNumber, c_: number | MATHJS.BigNumber, d_: number | MATHJS.BigNumber, e_: number | MATHJS.BigNumber) {
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
        const cubicC = MATHJS.multiply(C, -1) as MATHJS.BigNumber;
        const cubicD = MATHJS.subtract(MATHJS.divide(MATHJS.multiply(A, C), 2), MATHJS.divide(MATHJS.multiply(B, B), 8)) as MATHJS.BigNumber;

        // 使用三次方程求解器
        const mRoots = SolveEquation.SolveCubicStable(cubicA, cubicB.toNumber(), cubicC.toNumber(), cubicD.toNumber());

        // 选择实数根作为m
        let m: number = -Infinity;
        for (let root of mRoots) {
            if (typeof root === 'number') {
                if (root > m) m = root;
                continue;
            }
            if (root.im === 0) {
                if (root.re > m) m = root.re;
                continue;
            }
        }

        if (m === undefined) {
            throw new Error('无法找到合适的实数预解根');
        }

        // 构建二次方程参数
        // const sqrt2mMinusA = MATHJS.sqrt(2 * m - A);
        // const sqrtM2MinusC = MATHJS.sqrt(m * m - C);
        const sqrt2mMinusA_ = MATHJS.sqrt(MATHJS.subtract(2 * m, A) as MATHJS.BigNumber);
        const sqrtM2MinusC_ = MATHJS.sqrt(MATHJS.subtract(m * m, C) as MATHJS.BigNumber);
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

        let roots = new Array<MATHJS.Complex | number>();
        // 情况1: B >= 0
        // const signB = B >= 0 ? 1 : -1;
        // const alpha = sqrt2mMinusA;
        // const beta = signB * sqrtM2MinusC;
        const signB = MATHJS.largerEq(B, 0) ? 1 : -1;
        const alpha = sqrt2mMinusA;
        const beta = MATHJS.multiply(sqrtM2MinusC, signB) as MATHJS.BigNumber;

        // 解第一个二次方程: y² + αy + (m + β) = 0
        // const discriminant1 = alpha * alpha - 4 * (m + beta);
        const discriminant1 = MATHJS.subtract(MATHJS.multiply(alpha, alpha), MATHJS.multiply(4, MATHJS.add(m, beta))) as MATHJS.BigNumber;
        if (MATHJS.largerEq(discriminant1, 0)) {
            // const root1 = (-alpha + MATHJS.sqrt(discriminant1)) / 2;
            // const root2 = (-alpha - MATHJS.sqrt(discriminant1)) / 2;
            const root1 = MATHJS.divide(MATHJS.add(-alpha, MATHJS.sqrt(discriminant1)), 2) as MATHJS.BigNumber;
            const root2 = MATHJS.divide(MATHJS.subtract(-alpha, MATHJS.sqrt(discriminant1)), 2) as MATHJS.BigNumber;

            // roots.push(root1 - p / 4, root2 - p / 4);
            const r1 = MATHJS.subtract(root1, p_4).toNumber();
            const r2 = MATHJS.subtract(root2, p_4).toNumber();
            roots.push(r1, r2);

        } else {
            // const realPart = -alpha / 2;
            // const imagPart = MATHJS.sqrt(-discriminant1) / 2;
            // roots.push(
            //     MATHJS.complex(realPart, imagPart) - p / 4,
            //     MATHJS.complex(realPart, -imagPart) - p / 4
            // );
            const realPart = MATHJS.subtract(MATHJS.divide(alpha, -2), p_4) as MATHJS.BigNumber;
            const imagPart = MATHJS.divide(MATHJS.sqrt(MATHJS.multiply(discriminant1, -1) as MATHJS.BigNumber), 2) as MATHJS.BigNumber;
            roots.push(
                MATHJS.complex(realPart.toNumber(), imagPart.toNumber()),
                MATHJS.complex(realPart.toNumber(), -imagPart.toNumber())
            );
        }

        // 解第二个二次方程: y² - αy + (m - β) = 0
        // const discriminant2 = alpha * alpha - 4 * (m - beta);
        const discriminant2 = MATHJS.subtract(MATHJS.multiply(alpha, alpha), MATHJS.multiply(4, MATHJS.subtract(m, beta))) as MATHJS.BigNumber;
        if (MATHJS.largerEq(discriminant2, 0)) {
            // const root3 = (alpha + MATHJS.sqrt(discriminant2)) / 2;
            // const root4 = (alpha - MATHJS.sqrt(discriminant2)) / 2;
            // roots.push(root3 - p / 4, root4 - p / 4);
            const root3 = MATHJS.divide(MATHJS.add(alpha, MATHJS.sqrt(discriminant2)), 2) as MATHJS.BigNumber;
            const root4 = MATHJS.divide(MATHJS.subtract(alpha, MATHJS.sqrt(discriminant2)), 2) as MATHJS.BigNumber;
            roots.push(MATHJS.subtract(root3, p_4).toNumber(), MATHJS.subtract(root4, p_4).toNumber());
        } else {
            // const realPart = alpha / 2;
            // const imagPart = MATHJS.sqrt(-discriminant2) / 2;
            // roots.push(
            //     MATHJS.complex(realPart, imagPart) - p / 4,
            //     MATHJS.complex(realPart, -imagPart) - p / 4
            // );
            const realPart = MATHJS.subtract(MATHJS.divide(alpha, 2), p_4) as MATHJS.BigNumber;
            const imagPart = MATHJS.divide(MATHJS.sqrt(MATHJS.multiply(discriminant2, -1) as MATHJS.BigNumber), 2) as MATHJS.BigNumber;
            roots.push(
                MATHJS.complex(realPart.toNumber(), imagPart.toNumber()),
                MATHJS.complex(realPart.toNumber(), -imagPart.toNumber())
            );

        }

        // 去重和排序
        roots = SolveEquation.RemoveDuplicates(roots);

        return {
            方程: `${a}x⁴ + ${b}x³ + ${c}x² + ${d}x + ${e} = 0`,
            简化形式: `x⁴ + ${p.toFixed(4)}x³ + ${q.toFixed(4)}x² + ${r.toFixed(4)}x + ${s.toFixed(4)} = 0`,
            预解方程: `m³ + ${cubicB.toFixed(4)}m² + ${cubicC.toFixed(4)}m + ${cubicD.toFixed(4)} = 0`,
            预解根: m,
            根的个数: roots.length,
            roots: roots,
            解的数值形式: roots.map(root => MATHJS.format(root, { precision: 10 }))
        };
    }

    /**
     * 去除重复根
     */
    static RemoveDuplicates(roots: Array<MATHJS.Complex | number>, tolerance = 1e-15): Array<MATHJS.Complex | number> {
        const uniqueRoots = [];

        for (let root of roots) {
            let isUnique = true;

            for (let uniqueRoot of uniqueRoots) {

                if (typeof uniqueRoot === 'number') {
                    if (typeof root === 'number') {
                        if (Math.abs(root - uniqueRoot) < tolerance) {
                            isUnique = false;
                            break;
                        }
                    } else {
                        if (root.im === 0 && Math.abs(root.re - uniqueRoot) < tolerance) {
                            isUnique = false;
                            break;
                        }
                    }
                } else {
                    if (typeof root === 'number') {
                        if (uniqueRoot.im === 0 && Math.abs(uniqueRoot.re - root) < tolerance) {
                            isUnique = false;
                            break;
                        }
                    } else {
                        if (Math.abs(root.re - uniqueRoot.re) < tolerance &&
                            Math.abs(root.im - uniqueRoot.im) < tolerance) {
                            isUnique = false;
                            break;
                        }
                    }
                }
            }

            if (isUnique) {
                uniqueRoots.push(root);
            }
        }
        uniqueRoots.sort();
        return uniqueRoots;
    }

    /**
     * 使用特征值方法求解四次方程（更稳定）
     */
    static SolveQuarticStable(a: number, b: number, c: number, d: number, e: number) {
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

        row3[0] = MATHJS.bignumber(-e / a);
        row3[1] = MATHJS.bignumber(-d / a);
        row3[2] = MATHJS.bignumber(-c / a);
        row3[3] = MATHJS.bignumber(-b / a);

        companionMatrix[0] = row0;
        companionMatrix[1] = row1;
        companionMatrix[2] = row2;
        companionMatrix[3] = row3;
        // 计算特征值（即方程的根）
        try {
            const eigenValues = MATHJS.eigs(companionMatrix).values;
            let roots = new Array<MATHJS.Complex | number>();
            eigenValues.forEach(element => {
                if (MATHJS.typeOf(element) === 'Complex') {
                    roots.push(element);
                }
                else {
                    if (MATHJS.typeOf(element) === 'BigNumber') {
                        roots.push(element.toNumber());
                    } else {
                        roots.push(element);
                    }
                }
            });
            return { eigenValues, roots };
        } catch (error) {
            // 如果特征值计算失败，回退到代数方法
            console.warn('特征值方法失败，使用代数方法:', error.message);
            return SolveEquation.SolveQuarticEquation(a, b, c, d, e);
        }
    }

    // 示例测试
    static testQuarticSolver() {
        console.log('一元四次方程求解器测试\n');

        // try {
        // 示例1: 四个实根
        console.log('示例1: x⁴ - 10x³ + 35x² - 50x + 24 = 0 (根: 1, 2, 3, 4)');
        const result1 = SolveEquation.SolveQuarticEquation(1, -10, 35, -50, 24);
        console.log(result1);
        console.log('特征值方法解:', SolveEquation.SolveQuarticStable(1, -10, 35, -50, 24));
        console.log('\n' + '='.repeat(80) + '\n');

        // 示例2: 两个实根，两个复根
        console.log('示例2: x⁴ + x² + x + 1 = 0');
        const result2 = SolveEquation.SolveQuarticEquation(1, 0, 1, 1, 1);
        console.log(result2);
        console.log('特征值方法解:', SolveEquation.SolveQuarticStable(1, 0, 1, 1, 1));
        console.log('\n' + '='.repeat(80) + '\n');

        // 示例3: 四个复根
        console.log('示例3: x⁴ + 4 = 0');
        const result3 = SolveEquation.SolveQuarticEquation(1, 0, 0, 0, 4);
        console.log(result3);
        console.log('特征值方法解:', SolveEquation.SolveQuarticStable(1, 0, 0, 0, 4));
        console.log('\n' + '='.repeat(80) + '\n');

        // 示例4: 可因式分解的情况
        console.log('示例4: x⁴ - 5x² + 4 = 0 (根: ±1, ±2)');
        const result4 = SolveEquation.SolveQuarticEquation(1, 0, -5, 0, 4);
        console.log(result4);
        console.log('特征值方法解:', SolveEquation.SolveQuarticStable(1, 0, -5, 0, 4));
        console.log('\n' + '='.repeat(80) + '\n');

        // 示例5: 实际应用问题
        console.log('示例5: 16x⁴ - 32x³ + 24x² - 8x + 1 = 0');
        const result5 = SolveEquation.SolveQuarticEquation(16, -32, 24, -8, 1);
        console.log(result5);
        console.log('特征值方法解:', SolveEquation.SolveQuarticStable(16, -32, 24, -8, 1));
        console.log('\n' + '='.repeat(80) + '\n');
        // } catch (error) {
        //     console.error('错误:', error.message);
        // }
    }


}
export { SolveEquation };