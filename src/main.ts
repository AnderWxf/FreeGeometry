import { Cube } from "./Cube";
import verb from 'verb-nurbs';
import * as THREE from 'three';

let v = new THREE.Vector2(0, 0);
// 创建 NURBS 曲线
const curve = new verb.geom.NurbsCurve({
  degree: 3, // 维度
  knots: [0, 0, 0, 0, 1, 1, 1, 1], // 节点向量
  controlPoints: [
    [0, 0, 0, 1],     // 控制点 (x, y, z, w)
    [1, 0, 0, 1],
    [1, 1, 0, 1],
    [0, 1, 0, 1]
  ]
}
);

export class main {
  constructor() {
    console.log("fg");
    new Cube();
  }
}

new main();

