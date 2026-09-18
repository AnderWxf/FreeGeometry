@echo off
pushd %~dp0
npx asc src/assembly/asm.asc.ts --outFile ./build/assembly/asm.asc.wasm --bindings esm
popd
pause
