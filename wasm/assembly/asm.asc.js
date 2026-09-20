async function instantiate(module, imports = {}) {
  const adaptedImports = {
    env: Object.setPrototypeOf({
      abort(message, fileName, lineNumber, columnNumber) {
        // ~lib/builtins/abort(~lib/string/String | null?, ~lib/string/String | null?, u32?, u32?) => void
        message = __liftString(message >>> 0);
        fileName = __liftString(fileName >>> 0);
        lineNumber = lineNumber >>> 0;
        columnNumber = columnNumber >>> 0;
        (() => {
          // @external.js
          throw Error(`${message} in ${fileName}:${lineNumber}:${columnNumber}`);
        })();
      },
    }, Object.assign(Object.create(globalThis), imports.env || {})),
  };
  const { exports } = await WebAssembly.instantiate(module, adaptedImports);
  const memory = exports.memory || imports.env.memory;
  const adaptedExports = Object.setPrototypeOf({
    sumArray(arr) {
      // src/assembly/asm.asc/sumArray(~lib/typedarray/Float64Array) => f64
      arr = __lowerTypedArray(Float64Array, 4, 3, arr) || __notnull();
      return exports.sumArray(arr);
    },
    doubleArray(arr) {
      // src/assembly/asm.asc/doubleArray(~lib/typedarray/Float64Array) => ~lib/typedarray/Float64Array
      arr = __lowerTypedArray(Float64Array, 4, 3, arr) || __notnull();
      return __liftTypedArray(Float64Array, exports.doubleArray(arr) >>> 0);
    },
    detMatrix3(te) {
      // src/assembly/asm.asc/detMatrix3(~lib/typedarray/Float64Array) => f64
      te = __lowerTypedArray(Float64Array, 4, 3, te) || __notnull();
      return exports.detMatrix3(te);
    },
    detMatrix4(te) {
      // src/assembly/asm.asc/detMatrix4(~lib/typedarray/Float64Array) => f64
      te = __lowerTypedArray(Float64Array, 4, 3, te) || __notnull();
      return exports.detMatrix4(te);
    },
    invertMatrix3(te) {
      // src/assembly/asm.asc/invertMatrix3(~lib/typedarray/Float64Array) => ~lib/typedarray/Float64Array
      te = __lowerTypedArray(Float64Array, 4, 3, te) || __notnull();
      return __liftTypedArray(Float64Array, exports.invertMatrix3(te) >>> 0);
    },
    invertMatrix4(te) {
      // src/assembly/asm.asc/invertMatrix4(~lib/typedarray/Float64Array) => ~lib/typedarray/Float64Array
      te = __lowerTypedArray(Float64Array, 4, 3, te) || __notnull();
      return __liftTypedArray(Float64Array, exports.invertMatrix4(te) >>> 0);
    },
    FLOAT64ARRAY_ID: {
      // src/assembly/asm.asc/FLOAT64ARRAY_ID: u32
      valueOf() { return this.value; },
      get value() {
        return exports.FLOAT64ARRAY_ID.value >>> 0;
      }
    },
  }, exports);
  function __liftString(pointer) {
    if (!pointer) return null;
    const
      end = pointer + new Uint32Array(memory.buffer)[pointer - 4 >>> 2] >>> 1,
      memoryU16 = new Uint16Array(memory.buffer);
    let
      start = pointer >>> 1,
      string = "";
    while (end - start > 1024) string += String.fromCharCode(...memoryU16.subarray(start, start += 1024));
    return string + String.fromCharCode(...memoryU16.subarray(start, end));
  }
  function __liftTypedArray(constructor, pointer) {
    if (!pointer) return null;
    return new constructor(
      memory.buffer,
      __getU32(pointer + 4),
      __dataview.getUint32(pointer + 8, true) / constructor.BYTES_PER_ELEMENT
    ).slice();
  }
  function __lowerTypedArray(constructor, id, align, values) {
    if (values == null) return 0;
    const
      length = values.length,
      buffer = exports.__pin(exports.__new(length << align, 1)) >>> 0,
      header = exports.__new(12, id) >>> 0;
    __setU32(header + 0, buffer);
    __dataview.setUint32(header + 4, buffer, true);
    __dataview.setUint32(header + 8, length << align, true);
    new constructor(memory.buffer, buffer, length).set(values);
    exports.__unpin(buffer);
    return header;
  }
  function __notnull() {
    throw TypeError("value must not be null");
  }
  let __dataview = new DataView(memory.buffer);
  function __setU32(pointer, value) {
    try {
      __dataview.setUint32(pointer, value, true);
    } catch {
      __dataview = new DataView(memory.buffer);
      __dataview.setUint32(pointer, value, true);
    }
  }
  function __getU32(pointer) {
    try {
      return __dataview.getUint32(pointer, true);
    } catch {
      __dataview = new DataView(memory.buffer);
      return __dataview.getUint32(pointer, true);
    }
  }
  return adaptedExports;
}
export const {
  memory,
  sumArray,
  doubleArray,
  toPeriod,
  toRange,
  detMatrix3,
  detMatrix4,
  invertMatrix3,
  invertMatrix4,
  FLOAT64ARRAY_ID,
} = await (async url => instantiate(
  await (async () => {
    const isNodeOrBun = typeof process != "undefined" && process.versions != null && (process.versions.node != null || process.versions.bun != null);
    if (isNodeOrBun) { return globalThis.WebAssembly.compile(await (await import("node:fs/promises")).readFile(url)); }
    else { return await globalThis.WebAssembly.compileStreaming(globalThis.fetch(url)); }
  })(), {
}
))("./wasm/assembly/asm.asc.wasm"/*new URL("asm.asc.wasm", import.meta.url)*/);
