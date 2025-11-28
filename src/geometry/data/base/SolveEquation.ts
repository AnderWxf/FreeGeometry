import * as MATHJS from 'mathjs';

class SolveEquation {

    /**
     * 使用MATHJS.js求解一元二次方程
     * @param {number} a - 二次项系数
     * @param {number} b - 一次项系数  
     * @param {number} c - 常数项
     * @returns {Object} 解的结果
     */
    static SolveQuadraticEquation(a_: number | MATHJS.BigNumber, b_: number | MATHJS.BigNumber, c_: number | MATHJS.BigNumber) {
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

        let roots;
        let type;

        if (MATHJS.larger(discriminant, 0)) {
            // 两个不等实根
            type = '两个不等实根';
            const sqrtDiscriminant = MATHJS.sqrt(discriminant);
            const root1 = MATHJS.divide(
                MATHJS.add(-b, sqrtDiscriminant),
                MATHJS.multiply(2, a)
            );
            const root2 = MATHJS.divide(
                MATHJS.subtract(-b, sqrtDiscriminant),
                MATHJS.multiply(2, a)
            );
            roots = [root1, root2];
        } else if (MATHJS.equal(discriminant, 0)) {
            // 两个相等实根
            type = '两个相等实根';
            const root = MATHJS.divide(-b, MATHJS.multiply(2, a));
            roots = [root, root];
        } else {
            // 两个共轭复根
            type = '两个共轭复根';
            const realPart = MATHJS.divide(-b, MATHJS.multiply(2, a)) as MATHJS.BigNumber;
            const imaginaryPart = MATHJS.divide(
                MATHJS.sqrt(MATHJS.unaryMinus(discriminant)),
                MATHJS.multiply(2, a)
            ) as MATHJS.BigNumber;
            roots = [
                MATHJS.complex([realPart, imaginaryPart]),
                MATHJS.complex([realPart, -imaginaryPart])
            ];
        }

        return {
            方程: `${a}x² + ${b}x + ${c} = 0`,
            判别式: discriminant,
            根的类型: type,
            解: roots,
            解的数值形式: roots.map(root => MATHJS.format(root, { precision: 14 }))
        };
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
    static SolveCubicEquation(a_: number | MATHJS.BigNumber, b_: number | MATHJS.BigNumber, c_: number | MATHJS.BigNumber, d_: number | MATHJS.BigNumber) {
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
        const depressedP = MATHJS.subtract(q, MATHJS.divide(MATHJS.pow(p, 2), 3)) as MATHJS.BigNumber;//q - math.pow(p, 2) / 3;
        const depressedQ = MATHJS.add(MATHJS.subtract(MATHJS.divide(MATHJS.pow(p, 3), 2 / 27), MATHJS.divide(MATHJS.multiply(p, q), 3)), r) as MATHJS.BigNumber;    //(2 * MATHJS.pow(p, 3)) / 27 - (p * q) / 3 + r


        // 计算判别式
        const discriminant = MATHJS.add(MATHJS.pow(MATHJS.divide(depressedQ, 2), 2), MATHJS.pow(MATHJS.divide(depressedP, 3), 3)) as MATHJS.BigNumber;//math.pow(depressedQ / 2, 2) + math.pow(depressedP / 3, 3)

        let roots = [];
        let type;

        if (MATHJS.larger(discriminant, 0)) {
            // 一个实根，两个共轭复根
            type = '一个实根，两个共轭复根';
            const u = MATHJS.pow(MATHJS.add(MATHJS.divide(-depressedQ, 2), MATHJS.sqrt(discriminant)), 1 / 3) as MATHJS.BigNumber;
            const v = MATHJS.pow(MATHJS.subtract(-depressedQ / 2, MATHJS.sqrt(discriminant)), 1 / 3) as MATHJS.BigNumber;

            const realRoot = MATHJS.subtract(MATHJS.add(u, v), MATHJS.divide(p, 3));
            const realPart = MATHJS.divide(MATHJS.divide(-MATHJS.add(u, v), 2), MATHJS.divide(p, 3)) as MATHJS.BigNumber;//-(u + v) / 2 - p / 3
            const imaginaryPart = (MATHJS.multiply(MATHJS.subtract(u, v), MATHJS.divide(MATHJS.sqrt(3), 2))) as MATHJS.BigNumber;//(u - v) * MATHJS.sqrt(3) / 2
            const complexRoot1 = MATHJS.complex([realPart, imaginaryPart]);

            const complexRoot2 = MATHJS.complex([realPart, -imaginaryPart]);

            roots = [realRoot, complexRoot1, complexRoot2];
        } else if (MATHJS.equal(discriminant, 0)) {
            // 三个实根（至少两个相等）
            type = '三个实根（至少两个相等）';
            const u = MATHJS.pow(-depressedQ / 2, 1 / 3);
            const root1 = MATHJS.subtract(MATHJS.multiply(2, u), MATHJS.divide(p, 3));//2 * u - p / 3
            const root2 = MATHJS.subtract(-u, MATHJS.divide(p, 3)); //-u - p / 3;
            const root3 = MATHJS.subtract(-u, MATHJS.divide(p, 3)); //-u - p / 3;

            roots = [root1, root2, root3];
        } else {
            // 三个不等实根（需要三角函数解）
            type = '三个不等实根';
            // const r = MATHJS.sqrt(MATHJS.pow(-depressedP / 3, 3));
            // const theta = MATHJS.acos(-depressedQ / (2 * r));
            // const root1 = 2 * MATHJS.cubeRoot(r) * MATHJS.cos(theta / 3) - p / 3;
            // const root2 = 2 * MATHJS.cubeRoot(r) * MATHJS.cos((theta + 2 * MATHJS.pi) / 3) - p / 3;
            // const root3 = 2 * MATHJS.cubeRoot(r) * MATHJS.cos((theta + 4 * MATHJS.pi) / 3) - p / 3;

            const r = MATHJS.pow(MATHJS.pow(-MATHJS.divide(depressedP, 3), 3), 0.5) as MATHJS.BigNumber;
            const angle = MATHJS.divide(depressedQ, -MATHJS.multiply(r, 2)) as MATHJS.BigNumber;
            const theta = MATHJS.acos(angle);

            const theta_3 = MATHJS.divide(theta, 3) as MATHJS.BigNumber;
            const p_3 = MATHJS.divide(p, 3) as MATHJS.BigNumber;
            const p_2_3 = MATHJS.multiply(MATHJS.pow(r, 1 / 3), 2) as MATHJS.BigNumber;
            const r_2_3 = MATHJS.multiply(MATHJS.pow(r, 1 / 3), 2) as MATHJS.BigNumber;

            const root1 = MATHJS.subtract(MATHJS.multiply(p_2_3, MATHJS.cos(theta_3)), p_3);
            const root2 = MATHJS.subtract(MATHJS.multiply(r_2_3, MATHJS.cos(MATHJS.divide(MATHJS.add(theta, 2 * MATHJS.pi), 3) as MATHJS.BigNumber)), p_3);
            const root3 = MATHJS.subtract(MATHJS.multiply(r_2_3, MATHJS.cos(MATHJS.divide(MATHJS.add(theta, 4 * MATHJS.pi), 3) as MATHJS.BigNumber)), p_3);

            roots = [root1, root2, root3];
        }

        return {
            方程: `${a}x³ + ${b}x² + ${c}x + ${d} = 0`,
            简化形式: `x³ + ${p}x² + ${q}x + ${r} = 0`,
            判别式: discriminant,
            根的类型: type,
            解: roots,
            解的数值形式: roots.map(root => {
                if (typeof root === 'number') {
                    return MATHJS.format(root, { precision: 10 });
                } else {
                    return MATHJS.format(root, { precision: 10 });
                }
            })
        };
    }

    /**
     * 更稳定的三次方程求解方法（使用特征值方法）
     */
    static SolveCubicStable(a: number, b: number, c: number, d: number) {
        if (a === 0)
            throw new Error('a不能为0');

        // 构造伴随矩阵
        const companionMatrix = [
            [0, 1, 0],
            [0, 0, 1],
            [-d / a, -c / a, -b / a]
        ];

        try {
            // 计算特征值（即方程的根）
            const eigenValues = MATHJS.eigs(companionMatrix).values;
            return eigenValues;
        } catch (error) {
            // 如果特征值计算失败，回退到代数方法
            console.warn('特征值方法失败，使用代数方法:', error.message);
            return SolveEquation.SolveCubicEquation(a, b, c, d).解;
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
            console.log('稳定方法解:', SolveEquation.SolveCubicEquation(1, -6, 11, -6));
            console.log('\n' + '='.repeat(60) + '\n');

            // 示例2: 一个实根，两个复根
            console.log('示例2: x³ + x + 1 = 0');
            const result2 = SolveEquation.SolveCubicEquation(1, 0, 1, 1);
            console.log(result2);
            console.log('\n' + '='.repeat(60) + '\n');

            // 示例3: 三个实根（有重根）
            console.log('示例3: x³ - 3x² + 3x - 1 = 0 (三重根: 1)');
            const result3 = SolveEquation.SolveCubicEquation(1, -3, 3, -1);
            console.log(result3);
            console.log('\n' + '='.repeat(60) + '\n');

            // 示例4: 复杂系数
            console.log('示例4: 2x³ - 4x² + 3x - 5 = 0');
            const result4 = SolveEquation.SolveCubicEquation(2, -4, 3, -5);
            console.log(result4);
            console.log('\n' + '='.repeat(60) + '\n');

            // 示例5: 实际应用问题
            console.log('示例5: 体积问题 x³ - 12x² + 44x - 48 = 0');
            const result5 = SolveEquation.SolveCubicEquation(1, -12, 44, -48);
            console.log(result5);

        } catch (error) {
            console.error('错误:', error.message);
        }
    }
}
export { SolveEquation };