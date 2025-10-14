@echo off
pushd %~dp0
npx webpack --config webpack.prod.js
popd
pause
