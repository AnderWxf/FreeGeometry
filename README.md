# FreeGeometry
Brep,Geometry

# Install:
npm install --save typescrpt

npm install --save three

npm install --save webpack

npm install --save antd

npm install --save vitest

npm install --save lodash

npm install --save assemblyscript


# Modify
mathjs
关掉有效数字大于15位时的检查
// // note: conversion from number to BigNumber can fail if x has >15 digits
// if ((0, _number.digits)(x) > 15) {
//   throw new TypeError('Cannot implicitly convert a number with >15 significant digits to BigNumber ' + '(value: ' + x + '). ' + 'Use function bignumber(x) to convert to BigNumber.');
// }

// // note: conversion from number to BigNumber can fail if x has >15 digits
// if (digits(x) > 15) {
//   throw new TypeError('Cannot implicitly convert a number with >15 significant digits to BigNumber ' + '(value: ' + x + '). ' + 'Use function bignumber(x) to convert to BigNumber.');
// }


# Build:
./build

if show errr, build again.

# Test:
npx vitest --ui

