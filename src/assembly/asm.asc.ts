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

// 导出 Float64Array 的类型 ID，供 JS 侧调用 __newArray 时使用
export const FLOAT64ARRAY_ID = idof<Float64Array>();