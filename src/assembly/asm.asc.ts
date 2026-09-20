// 接收 Float64Array 并返回其元素之和
export function sumArray(arr: Float64Array): f64 {
  let total: f64 = 0;
  for (let i = 0; i < arr.length; i++) {
    total += unchecked(arr[i]);
  }
  return total;
}

// 接收 Float64Array，每个元素乘以 2 后返回新数组
export function doubleArray(arr: Float64Array): Float64Array {
  const result = new Float64Array(arr.length);
  for (let i = 0; i < arr.length; i++) {
    result[i] = arr[i] * 2.0;
  }
  return result;
}

/**
 * u to [0,period)
 *
 * @return {number} The u ∈ [0,period).
 */
export function toPeriod(u: number, period: number, tol1: number): number {
  while (u < 0) {
    u += period;
  }
  while (u >= period) {
    u -= period;
  }

  let d1 = Math.abs(u);
  const b1 = d1 <= tol1;
  if (b1) {
    u = 0;
  }

  let d2 = u - period;
  d2 = Math.abs(d2);
  const b2 = d2 <= tol1;
  if (b2) {
    u = 0;
  }
  return u
}

/**
 * when u % period ∈ [a,b],
 * take u to [a,b], step is period.
 *
 * @return {number} The u ∈ [a,b].
 */
export function toRange(u: number, a: number, b: number, period: number): number {
  while (u < a) {
    u += period;
  }
  while (u > b) {
    u -= period;
  }
  return u
}

/**
 * Computes and returns the determinant of this matrix.
 *
 * @return {number} The determinant.
 */
export function detMatrix3(te: Float64Array): number {
  // 从内存中读取 f64，偏移量是 i * 8 字节
  const a = te[0];
  const b = te[1];
  const c = te[2];
  const d = te[3];
  const e = te[4];
  const f = te[5];
  const g = te[6];
  const h = te[7];
  const i = te[8];

  return a * e * i - a * f * h - b * d * i + b * f * g + c * d * h - c * e * g;
}
/**
 * Computes and returns the determinant of this matrix.
 *
 * @return {number} The determinant.
 */
export function detMatrix4(te: Float64Array): number {
  const n11 = te[0];
  const n12 = te[4];
  const n13 = te[8];
  const n14 = te[12];
  const n21 = te[1];
  const n22 = te[5];
  const n23 = te[9];
  const n24 = te[13];
  const n31 = te[2];
  const n32 = te[6];
  const n33 = te[10];
  const n34 = te[14];
  const n41 = te[3];
  const n42 = te[7];
  const n43 = te[11];
  const n44 = te[15];
  let ret = n41 * (n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34);
  ret += n42 * (n11 * n23 * n34 - n11 * n24 * n33 + n14 * n21 * n33 - n13 * n21 * n34 + n13 * n24 * n31 - n14 * n23 * n31);
  ret += n43 * (n11 * n24 * n32 - n11 * n22 * n34 - n14 * n21 * n32 + n12 * n21 * n34 + n14 * n22 * n31 - n12 * n24 * n31);
  ret += n44 * (-n13 * n22 * n31 - n11 * n23 * n32 + n11 * n22 * n33 + n13 * n21 * n32 - n12 * n21 * n33 + n12 * n23 * n31);
  return ret;
}
/**
 * Computes and returns the inverse of this matrix.
 *
 * @return {number[]} The inverse matrix.
 */
export function invertMatrix3(te: Float64Array): Float64Array {

  const n11 = te[0];
  const n21 = te[1];
  const n31 = te[2];
  const n12 = te[3];
  const n22 = te[4];
  const n32 = te[5];
  const n13 = te[6];
  const n23 = te[7];
  const n33 = te[8];

  const t11 = n33 * n22 - n32 * n23;
  const t12 = n32 * n13 - n33 * n12;
  const t13 = n23 * n12 - n22 * n13;
  const det = n11 * t11 + n21 * t12 + n31 * t13;
  let out = new Float64Array(te.length);
  if (det === 0) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    return out;
  }
  const detInv = 1 / det;
  out[0] = (t11 * detInv);
  out[1] = (n31 * n23 - n33 * n21) * detInv;
  out[2] = (n32 * n21 - n31 * n22) * detInv;
  out[3] = (t12 * detInv);
  out[4] = (n33 * n11 - n31 * n13) * detInv;
  out[5] = (n31 * n12 - n32 * n11) * detInv;
  out[6] = (t13 * detInv);
  out[7] = (n21 * n13 - n23 * n11) * detInv;
  out[8] = (n22 * n11 - n21 * n12) * detInv;
  return out;

}
/**
 * Computes and returns the inverse of this matrix.
 *
 * @return {number[]} The inverse matrix.
 */
export function invertMatrix4(te: Float64Array): Float64Array {

  // based on http://www.euclideanspace.com/maths/algebra/matrix/functions/inverse/fourD/index.htm
  const n11 = te[0];
  const n21 = te[1];
  const n31 = te[2];
  const n41 = te[3];
  const n12 = te[4];
  const n22 = te[5];
  const n32 = te[6];
  const n42 = te[7];
  const n13 = te[8];
  const n23 = te[9];
  const n33 = te[10];
  const n43 = te[11];
  const n14 = te[12];
  const n24 = te[13];
  const n34 = te[14];
  const n44 = te[15];

  const t11 = n23 * n34 * n42 - n24 * n33 * n42 + n24 * n32 * n43 - n22 * n34 * n43 - n23 * n32 * n44 + n22 * n33 * n44;
  const t12 = n14 * n33 * n42 - n13 * n34 * n42 - n14 * n32 * n43 + n12 * n34 * n43 + n13 * n32 * n44 - n12 * n33 * n44;
  const t13 = n13 * n24 * n42 - n14 * n23 * n42 + n14 * n22 * n43 - n12 * n24 * n43 - n13 * n22 * n44 + n12 * n23 * n44;
  const t14 = n14 * n23 * n32 - n13 * n24 * n32 - n14 * n22 * n33 + n12 * n24 * n33 + n13 * n22 * n34 - n12 * n23 * n34;

  const det = n11 * t11 + n21 * t12 + n31 * t13 + n41 * t14;
  let out = new Float64Array(te.length);
  if (det === 0) {
    out[0] = 0;
    out[1] = 0;
    out[2] = 0;
    out[3] = 0;
    out[4] = 0;
    out[5] = 0;
    out[6] = 0;
    out[7] = 0;
    out[8] = 0;
    out[9] = 0;
    out[10] = 0;
    out[11] = 0;
    out[12] = 0;
    out[13] = 0;
    out[14] = 0;
    out[15] = 0;
    return out;
  }

  const detInv = 1 / det;
  out[0] = (t11 * detInv);
  out[1] = (n24 * n33 * n41 - n23 * n34 * n41 - n24 * n31 * n43 + n21 * n34 * n43 + n23 * n31 * n44 - n21 * n33 * n44) * detInv;
  out[2] = (n22 * n34 * n41 - n24 * n32 * n41 + n24 * n31 * n42 - n21 * n34 * n42 - n22 * n31 * n44 + n21 * n32 * n44) * detInv;
  out[3] = (n23 * n32 * n41 - n22 * n33 * n41 - n23 * n31 * n42 + n21 * n33 * n42 + n22 * n31 * n43 - n21 * n32 * n43) * detInv;
  out[4] = (t12 * detInv);
  out[5] = (n13 * n34 * n41 - n14 * n33 * n41 + n14 * n31 * n43 - n11 * n34 * n43 - n13 * n31 * n44 + n11 * n33 * n44) * detInv;
  out[6] = (n14 * n32 * n41 - n12 * n34 * n41 - n14 * n31 * n42 + n11 * n34 * n42 + n12 * n31 * n44 - n11 * n32 * n44) * detInv;
  out[7] = (n12 * n33 * n41 - n13 * n32 * n41 + n13 * n31 * n42 - n11 * n33 * n42 - n12 * n31 * n43 + n11 * n32 * n43) * detInv;
  out[8] = (t13 * detInv);
  out[9] = (n14 * n23 * n41 - n13 * n24 * n41 - n14 * n21 * n43 + n11 * n24 * n43 + n13 * n21 * n44 - n11 * n23 * n44) * detInv;
  out[10] = (n12 * n24 * n41 - n14 * n22 * n41 + n14 * n21 * n42 - n11 * n24 * n42 - n12 * n21 * n44 + n11 * n22 * n44) * detInv;
  out[11] = (n13 * n22 * n41 - n12 * n23 * n41 - n13 * n21 * n42 + n11 * n23 * n42 + n12 * n21 * n43 - n11 * n22 * n43) * detInv;
  out[12] = (t14 * detInv);
  out[13] = (n13 * n24 * n31 - n14 * n23 * n31 + n14 * n21 * n33 - n11 * n24 * n33 - n13 * n21 * n34 + n11 * n23 * n34) * detInv;
  out[14] = (n14 * n22 * n31 - n12 * n24 * n31 - n14 * n21 * n32 + n11 * n24 * n32 + n12 * n21 * n34 - n11 * n22 * n34) * detInv;
  out[15] = (n12 * n23 * n31 - n13 * n22 * n31 + n13 * n21 * n32 - n11 * n23 * n32 - n12 * n21 * n33 + n11 * n22 * n33) * detInv;
  return out;
}

// 导出 Float64Array 的类型 ID，供 JS 侧调用 __newArray 时使用
export const FLOAT64ARRAY_ID = idof<Float64Array>();