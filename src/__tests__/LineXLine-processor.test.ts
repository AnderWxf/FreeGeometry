// user-processor.test.ts
import { describe, expect, test } from 'vitest';
import fs from 'fs';
import path from 'path';
import { process } from './processors/LineXLine-001-processor';
import type { UserData } from '../helper/UserData';
import { unserialize } from '../geometry/data/base/Unserialize';
import { isEqualWith } from 'lodash';

function isCloseTo(received: any, expected: any, tolerance: number = 1e-12): boolean {
  return isEqualWith(received, expected, (objVal, othVal) => {
    // 如果是数字，用容差比较
    if (typeof objVal === 'number' && typeof othVal === 'number') {
      return Math.abs(objVal - othVal) <= tolerance;
    }
    // 返回 undefined 让 lodash 继续深度比较
    return undefined;
  });
}

function loadJSON(filename: string) {
  const filePath = path.join(__dirname, filename);
  let datas = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as [any];
  for (let i = 0; i < datas.length; i++) {
    let userData = datas[i].userData as UserData;
    userData.original = unserialize(userData.original)[0];
  }
  return datas as any;
}

describe('直线求交测试', () => {
  test('测试样例001', () => {
    const input = loadJSON('/data/curve/case-1-input.json');
    const expected = loadJSON('/data/curve/case-1-expected.json');
    const result = process(input);
    expect(isCloseTo(result, expected, 1e-12)).toBe(true);
  });
});