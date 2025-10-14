@echo off
pushd %~dp0
npx webpack --config webpack.dev.js
popd
pause
