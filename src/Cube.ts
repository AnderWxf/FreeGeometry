import * as THREE from 'three';
import * as WEBGPU from 'three/src/three.WebGPU';
import * as GUI from "dat.gui";
import { Vector2 } from "./math/Math"
import { Line2Data } from './geometry/data/base/curve/curve2/Line2Data';
import { Line2Algo } from './geometry/algorithm/base/curve/curve2/Line2Algo';
import { CameraController } from './helper/CameraController';
import { Grid } from './helper/Grid';
export class Cube {
  public constructor() {
    // 创建一个场景
    const scene = new THREE.Scene();
    //通过scene.add(元素)添加元素
    // 创建一个透视相机
    const camera = new THREE.PerspectiveCamera(
      75, // 视场角（FOV）
      window.innerWidth / window.innerHeight, // 宽高比
      0.1, // 近裁剪面
      3000 // 远裁剪面
    );

    // 设置相机位置
    camera.position.set(5, 0, 5);
    camera.lookAt(new THREE.Vector3());
    const controller = new CameraController(camera);
    controller.bind(window);

    // 创建一个立方体几何体
    const geometry0 = new THREE.BoxGeometry(1, 1, 1);
    // 创建一个球体
    const geometry1 = new THREE.SphereGeometry(1);
    //创建一个圆柱体
    const geometry2 = new THREE.CylinderGeometry(1, 1, 2.5);

    // 创建一个基础材质
    const material0 = new THREE.MeshBasicMaterial({ color: THREE.Color.NAMES.red });

    // 基础材质（可配置颜色、贴图等）
    const material1 = new THREE.MeshBasicMaterial({ color: THREE.Color.NAMES.green });

    // 基础材质（可配置颜色、贴图等）
    const material2 = new THREE.MeshBasicMaterial({ color: THREE.Color.NAMES.blue });

    // 创建XZ平面的网格提
    const grid = new THREE.LineSegments(new Grid(100));
    grid.name = "Grid";
    (grid.material as THREE.LineBasicMaterial).vertexColors = true;
    scene.add(grid);

    const mesh0 = new THREE.Mesh(geometry0, material0);
    mesh0.position.x = -2;
    mesh0.name = "Box";
    scene.add(mesh0);

    const mesh1 = new THREE.Mesh(geometry1, material1);
    mesh1.position.x = 0;
    mesh1.name = "sphere";
    scene.add(mesh1);

    const mesh2 = new THREE.Mesh(geometry2, material2);
    mesh2.position.x = 3;
    mesh2.name = "cylinder";
    scene.add(mesh2);

    // 创建坐标轴辅助器
    const axesHelper = new THREE.AxesHelper(100);
    axesHelper.setColors(THREE.Color.NAMES.red, THREE.Color.NAMES.lime, THREE.Color.NAMES.blue);
    scene.add(axesHelper);

    // 创建一个 WebGL 渲染器
    // const renderer = new THREE.WebGLRenderer();
    const renderer = new WEBGPU.WebGPURenderer({ antialias: false });
    renderer.setClearColor(0x000000);
    renderer.samples = 4;

    // 设置渲染器的大小
    renderer.setSize(window.innerWidth - 20, window.innerHeight - 20);
    // 将渲染器的 DOM 元素添加到页面中
    document.body.appendChild(renderer.domElement);

    // 创建一个 Clock 对象
    const clock = new THREE.Clock();
    // 动画循环
    function animate(): void {
      let delta = clock.getDelta();
      let fps = Math.round(1 / delta);

      // 定时刷新
      requestAnimationFrame(animate);
      // 旋转立方体
      mesh0.rotation.x += 0.01;
      mesh0.rotation.y += 0.01;
      // 旋转立球体
      mesh1.rotation.x += 0.01;
      mesh1.rotation.y += 0.01;
      // 旋转圆柱体
      mesh2.rotation.x += 0.01;
      mesh2.rotation.y += 0.01;

      controller.onFrame(delta);
      //重新渲染
      renderer.render(scene, camera);
    }
    // 执行动画
    animate();


    document.addEventListener('contextmenu', function (event) {
      event.preventDefault();
    });

    window.addEventListener("resize", (event) => {
      renderer.setSize(window.innerWidth - 20, window.innerHeight - 20);
      camera.aspect = window.innerWidth / window.innerHeight; // 宽高比
    });

    // 添加滑动条控件
    // const gui = new GUI.GUI();
    // let n = gui.add(mesh0, 'name').name('名称');
    // let con = gui.add(mesh0.position, 'x').name('位置控制');

    let v2 = new Vector2();
    let line = new Line2Data();
    let lineAlg = new Line2Algo(line);
  }
}
