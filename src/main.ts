import { Cube } from "./Cube";
import verb from 'verb-nurbs';
import * as THREE from 'three';

let v = new THREE.Vector2(0, 0);
// // 创建 NURBS 曲线
// const curve = new verb.geom.NurbsCurve({
//   degree: 3, // 3次曲线
//   knots: [0, 0, 0, 0, 1, 1, 1, 1], // 节点向量
//   controlPoints: [
//     [0, 0, 0, 1],     // 控制点 (x, y, z, w)
//     [1, 0, 0, 1],
//     [1, 1, 0, 1],
//     [0, 1, 0, 1]
//   ]
// }
// );
// // 计算整个圆弧的长度
// const length0 = verb.eval.Analyze.rationalCurveArcLength(curve, 0, 1);
// console.log('长度:', length0); // 输出:

// // 创建一个圆弧
// const arc = verb.eval.Make.arc(
//   [0, 0, 0],      // 圆心
//   [1, 0, 0],      // X轴方向
//   [0, 1, 0],      // Y轴方向
//   5,              // 半径
//   0,              // 起始角度
//   Math.PI / 2       // 结束角度 (90度)
// );

// // 计算整个圆弧的长度（应该是 πr/2 = 7.854）
// const length = verb.eval.Analyze.rationalCurveArcLength(arc, 1);
// console.log('圆弧长度:', length); // 输出: 7.854...

// // 计算前1/4段的长度
// const quarterLength = verb.eval.Analyze.rationalCurveArcLength(arc, 0.25);
// console.log('前1/4段长度:', quarterLength);

// // 创建曲线（使用精确值）
// const curve1 = new verb.geom.NurbsCurve({
//   degree: 3, // 3次曲线
//   knots: [0, 0, 0, 0, 1, 1, 1, 1], // 节点向量
//   controlPoints: [
//     [0, 0, 1],                    // P0
//     [9.999999999999998, 33.33333333333333, 1],  // P1
//     [20, -23.333333333333336, 1], // P2
//     [30, 10, 1]                   // P3
//   ]
// });

// // 计算整个弧长
// const arcLength = verb.eval.Analyze.rationalCurveArcLength(curve1._data, 1);
// console.log('弧长:', arcLength); // 

export class main {
  constructor() {
    console.log("fg");
    new Cube();
  }
}

new main();

