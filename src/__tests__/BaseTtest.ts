// user-processor.test.ts
import fs from 'fs';
import path from 'path';
import type { UserData } from '../helper/UserData';
import { unserialize } from '../geometry/data/base/Unserialize';
import { isEqualWith } from 'lodash';
import { describe, expect, test } from 'vitest';
import { Vector2, Vector3 } from '../math/Math';
import { vec2 } from 'three/src/nodes/TSL';

function IsCloseTo(received: any, expected: any, tolerance: number = 1e-12): boolean {
  return isEqualWith(received, expected, (objVal, othVal) => {
    // 如果是数字，用容差比较
    if (typeof objVal === 'number' && typeof othVal === 'number') {
      return Math.abs(objVal - othVal) <= tolerance;
    }
    // 返回 undefined 让 lodash 继续深度比较
    return undefined;
  });
}

function LoadScene(filename: string) {
  const filePath = filename;
  let datas = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as [any];
  for (let i = 0; i < datas.length; i++) {
    let userData = datas[i].userData as UserData;
    userData.original = unserialize(userData.original)[0];
  }
  return datas as any;
}

function LoadJSON(filename: string) {
  const filePath = filename;
  let datas = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as [any];
  return datas as any;
}

type TestCase = {
  dir: string;
  name: string;
  inputFile: string;
  expectedFile: string;
};
// 扫描 data 目录，自动发现测试用例
function DiscoverTestCases(caseDir: string): TestCase[] {
  const dataDir = path.join(__dirname, 'data', caseDir);
  const files = fs.readdirSync(dataDir);
  // 匹配 pattern: xxx-input.json 和 xxx-expected.json
  const inputFiles = files.filter(f => f.endsWith('-input.json'));
  return inputFiles.map(inputFile => {
    const baseName = inputFile.replace('-input.json', '');
    return {
      dir: caseDir,
      name: baseName,
      inputFile: path.join(dataDir, inputFile),
      expectedFile: path.join(dataDir, `${baseName}-expected.json`),
    };
  });
}
// 执行描述Object
function ExecuteDescribe(typeName: string, typeDir: string, process: (input: any) => any) {
  describe(typeName, () => {
    const dataDir = path.join(__dirname, 'data', typeDir);
    const files = fs.readdirSync(dataDir);
    files.forEach(file => {
      const testCases = DiscoverTestCases(typeDir + '/' + file);
      // 如果没有找到测试用例，给出提示
      if (testCases.length === 0) {
        console.warn('⚠️ 未找到测试数据文件，请检查 data/ 目录');
      }
      describe(file, () => {
        const testCases = DiscoverTestCases(typeDir + '/' + file);
        // 如果没有找到测试用例，给出提示
        if (testCases.length === 0) {
          console.warn('⚠️ 未找到测试数据文件，请检查 data/ 目录');
        }
        for (let i = 0; i < testCases.length; i++) {
          let c = testCases[i];
          test(c.name, () => {
            const input = LoadScene(c.inputFile);
            const expected = LoadScene(c.expectedFile);
            const result = process(input);
            expect(IsCloseTo(result, expected, 1e-8)).toBe(true);
          });
        }
      });
    });
  });
}

// 执行描述Object 2维交点集合
function ExecuteDescribeInsertPoint2(typeName: string, typeDir: string, process: (input: any) => any) {
  describe(typeName, () => {
    const dataDir = path.join(__dirname, 'data', typeDir);
    const files = fs.readdirSync(dataDir);
    files.forEach(file => {
      const testCases = DiscoverTestCases(typeDir + '/' + file);
      // 如果没有找到测试用例，给出提示
      if (testCases.length === 0) {
        console.warn('⚠️ 未找到测试数据文件，请检查 data/ 目录');
      }
      describe(file, () => {
        const testCases = DiscoverTestCases(typeDir + '/' + file);
        // 如果没有找到测试用例，给出提示
        if (testCases.length === 0) {
          console.warn('⚠️ 未找到测试数据文件，请检查 data/ 目录');
        }
        for (let i = 0; i < testCases.length; i++) {
          let c = testCases[i];
          test(c.name, () => {
            const input = LoadScene(c.inputFile);
            const expected = LoadScene(c.expectedFile) as [any];
            const result = process(input) as [any];
            // 交点距离判定，
            for (let j = expected.length - 1; j >= 0; j--) {
              let exp = expected[j].userData as UserData;
              for (let k = result.length - 1; k >= 0; k--) {
                let ret = result[k].userData as UserData;
                if (exp.original instanceof Vector2
                  && ret.original instanceof Vector2
                  && exp.original.distanceTo(ret.original) < 1e-4
                ) {
                  result.splice(k, 1);
                  expected.splice(j, 1);
                  break;
                }
              }
            }
            expect(IsCloseTo(result, expected, 1e-8)).toBe(true);
          });
        }
      });
    });
  });
}

// 执行描述Object 3维交点集合
function ExecuteDescribeInsertPoint3(typeName: string, typeDir: string, process: (input: any) => any) {
  describe(typeName, () => {
    const dataDir = path.join(__dirname, 'data', typeDir);
    const files = fs.readdirSync(dataDir);
    files.forEach(file => {
      const testCases = DiscoverTestCases(typeDir + '/' + file);
      // 如果没有找到测试用例，给出提示
      if (testCases.length === 0) {
        console.warn('⚠️ 未找到测试数据文件，请检查 data/ 目录');
      }
      describe(file, () => {
        const testCases = DiscoverTestCases(typeDir + '/' + file);
        // 如果没有找到测试用例，给出提示
        if (testCases.length === 0) {
          console.warn('⚠️ 未找到测试数据文件，请检查 data/ 目录');
        }
        for (let i = 0; i < testCases.length; i++) {
          let c = testCases[i];
          test(c.name, () => {
            const input = LoadScene(c.inputFile);
            const expected = LoadScene(c.expectedFile) as [any];
            const result = process(input) as [any];
            // 交点距离判定，
            for (let j = expected.length - 1; j >= 0; j--) {
              let exp = expected[j].userData as UserData;
              for (let k = result.length - 1; k >= 0; k--) {
                let ret = result[k].userData as UserData;
                if (exp.original instanceof Vector3
                  && ret.original instanceof Vector3
                  && exp.original.distanceTo(ret.original) < 1e-4
                ) {
                  result.splice(k, 1);
                  expected.splice(j, 1);
                  break;
                }
              }
            }
            expect(IsCloseTo(result, expected, 1e-8)).toBe(true);
          });
        }
      });
    });
  });
}
// 执行描述Bool
function ExecuteDescribeBools(typeName: string, typeDir: string, process: (input: any) => any) {
  describe(typeName, () => {
    const dataDir = path.join(__dirname, 'data', typeDir);
    const files = fs.readdirSync(dataDir);
    files.forEach(file => {
      const testCases = DiscoverTestCases(typeDir + '/' + file);
      // 如果没有找到测试用例，给出提示
      if (testCases.length === 0) {
        console.warn('⚠️ 未找到测试数据文件，请检查 data/ 目录');
      }
      describe(file, () => {
        const testCases = DiscoverTestCases(typeDir + '/' + file);
        // 如果没有找到测试用例，给出提示
        if (testCases.length === 0) {
          console.warn('⚠️ 未找到测试数据文件，请检查 data/ 目录');
        }
        for (let i = 0; i < testCases.length; i++) {
          let c = testCases[i];
          test(c.name, () => {
            const input = LoadScene(c.inputFile);
            const expected = LoadJSON(c.expectedFile);
            const result = process(input);
            expect(result).toEqual(expected);
          });
        }
      });
    });
  });
}

export {
  IsCloseTo,
  LoadScene,
  DiscoverTestCases,
  ExecuteDescribe,
  ExecuteDescribeBools,
  ExecuteDescribeInsertPoint2,
  ExecuteDescribeInsertPoint3,
};
export type { TestCase };
