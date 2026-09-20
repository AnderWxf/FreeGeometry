/** Exported memory */
export declare const memory: WebAssembly.Memory;
/**
 * src/assembly/asm.asc/sumArray
 * @param arr `~lib/typedarray/Float64Array`
 * @returns `f64`
 */
export declare function sumArray(arr: Float64Array): number;
/**
 * src/assembly/asm.asc/doubleArray
 * @param arr `~lib/typedarray/Float64Array`
 * @returns `~lib/typedarray/Float64Array`
 */
export declare function doubleArray(arr: Float64Array): Float64Array;
/**
 * src/assembly/asm.asc/toPeriod
 * @param u `f64`
 * @param period `f64`
 * @param tol1 `f64`
 * @returns `f64`
 */
export declare function toPeriod(u: number, period: number, tol1: number): number;
/**
 * src/assembly/asm.asc/toRange
 * @param u `f64`
 * @param a `f64`
 * @param b `f64`
 * @param period `f64`
 * @returns `f64`
 */
export declare function toRange(u: number, a: number, b: number, period: number): number;
/**
 * src/assembly/asm.asc/detMatrix3
 * @param te `~lib/typedarray/Float64Array`
 * @returns `f64`
 */
export declare function detMatrix3(te: Float64Array): number;
/**
 * src/assembly/asm.asc/detMatrix4
 * @param te `~lib/typedarray/Float64Array`
 * @returns `f64`
 */
export declare function detMatrix4(te: Float64Array): number;
/**
 * src/assembly/asm.asc/invertMatrix3
 * @param te `~lib/typedarray/Float64Array`
 */
export declare function invertMatrix3(te: Float64Array): void;
/**
 * src/assembly/asm.asc/invertMatrix4
 * @param te `~lib/typedarray/Float64Array`
 */
export declare function invertMatrix4(te: Float64Array): void;
/** src/assembly/asm.asc/FLOAT64ARRAY_ID */
export declare const FLOAT64ARRAY_ID: {
  /** @type `u32` */
  get value(): number
};
