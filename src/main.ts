import * as THREE from 'three';
import * as WEBGPU from 'three/src/three.WebGPU';
import CamToolBar from "./ui/CamToolBar";
import { Select } from './helper/Select';
import { Global } from './core/Global';
import { CommandExecuter } from './helper/command/CommandExecuter';
import { Scene } from './helper/Scene';
// import App from './ui/PropsTrans';

// import CommandBar from './ui/CommandBar';


console.log("fg");

// 创建一个场景
const scene = new THREE.Scene();
Global.scene = new Scene(scene);

// const app = App();
// const ui: HTMLElement = document.getElementById('ui');
// ui.append(app.props);
const cam = CamToolBar;

const gpu: HTMLElement = document.getElementById('gpu');
Global.gpu = gpu;

// 创建一个 WebGPU 渲染器
const renderer = new WEBGPU.WebGPURenderer({ antialias: false });
Global.renderer = renderer;
Global.canvas = renderer.domElement;

renderer.setClearColor(0x000000);
renderer.samples = 4;

// 设置渲染器的大小
renderer.setSize(window.innerWidth, window.innerHeight);
// 将渲染器的 DOM 元素添加到页面中
gpu.appendChild(renderer.domElement);

cam.CamViewChange('前');

const select = new Select(scene);
Global.select = select;

let executer = new CommandExecuter();
executer.bind(window);
Global.comExector = executer;

// 创建XZ平面的网格提
scene.add(cam.grid_xz);
scene.add(cam.grid_xy);
scene.add(cam.grid_yz);

// 创建一个 Clock 对象
const clock = new THREE.Clock();
// 动画循环
function animate(): void {
  let delta = clock.getDelta();
  let fps = Math.round(1 / delta);

  // 定时刷新
  requestAnimationFrame(animate);
  // // 旋转立方体
  // mesh0.rotation.x += 0.01;
  // mesh0.rotation.y += 0.01;
  // // 旋转立球体
  // mesh1.rotation.x += 0.01;
  // mesh1.rotation.y += 0.01;
  // // 旋转圆柱体
  // mesh2.rotation.x += 0.01;
  // mesh2.rotation.y += 0.01;
  if (cam.perspective.isActive) {
    cam.perspective.onFrame(delta);
    select.camera = cam.perspective.camera;
    Global.camera = select.camera;
    renderer.render(scene, cam.perspective.camera);
  }
  if (cam.orthographic.isActive) {
    cam.orthographic.onFrame(delta);
    select.camera = cam.orthographic.camera;
    Global.camera = select.camera;
    renderer.render(scene, cam.orthographic.camera);
  }
}
// 执行动画
animate();

document.addEventListener('contextmenu', function (event) {
  event.preventDefault();
});

window.addEventListener("resize", (event) => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  if (cam.perspective.isActive) {
    cam.perspective.camera.aspect = window.innerWidth / window.innerHeight; // 宽高比
  }
  if (cam.orthographic.isActive) {
    cam.orthographic.camera.top = cam.orthographic.camera.right * window.innerHeight / window.innerWidth; // 宽高比
    cam.orthographic.camera.bottom = cam.orthographic.camera.left * window.innerHeight / window.innerWidth; // 宽高比
  }
});




// {
//   let m = new Matrix3();
//   m.compose(new Vector2(10, 20), 0.643501, new Vector2(2.5, 2.5));
//   m.set(
//     2.0, -1.5, 10,
//     1.5, 2.0, 20,
//     0, 0, 1
//   );
//   let pos = new Vector2();
//   let rot = 0;
//   let scale = new Vector2();
//   let result = m.decompose();
//   pos = result.position;
//   rot = result.rotation;
//   scale = result.scale;
// }
// {
//   let lm = new Matrix3();
//   lm.elements = [-1.6, -1.2, 0, 1.2, -1.6, 0, 0, 0, 1];
//   let m = new Matrix3();
//   m.elements = [1.4000000000000001, 0, 0, 0, 0, 0, 0, 0, 1];
//   let trans = new Transform2(new Vector2(), -2.498091544796509, new Vector2(2, 2));
//   lm.premultiply(m);
//   trans.fromLocalMatrix(lm);
//   let lm2 = trans.makeLocalMatrix();
//   console.log(lm2);
// }



// let v = new THREE.Vector2(0, 0);
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


