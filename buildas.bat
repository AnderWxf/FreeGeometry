@echo off
pushd %~dp0
deno.exe run -A jsr:@jrmarcum/wasmtk hybrid ./src/math/MathUtils.ts -o ./src/wasm/math
@REM deno.exe run -A jsr:@jrmarcum/wasmtk hybrid ./src/geometry/algorithm/relation/intersection/Iteration.ts -o ./src/wasm/geometry/algorithm/relation/intersection
popd
del  ./src/wasm/math/MathUtils_core.bindings.ts
del  ./src/wasm/math/MathUtils_runner.ts
copy ./dist/MathUtils_core.bindings.ts ./src/wasm/math
copy ./dist/MathUtils_runner.ts ./src/wasm/math
pause
