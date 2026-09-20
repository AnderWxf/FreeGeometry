@echo off
pushd %~dp0
npx asc src/assembly/asm.asc.ts --outFile wasm/assembly/asm.asc.wasm --bindings esm --sourceMap --debug
popd
pause
