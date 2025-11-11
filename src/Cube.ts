import * as THREE from 'three';
import * as WEBGPU from 'three/src/three.WebGPU';
import { Vector2 } from "./math/Math"
import { Line2Data } from './geometry/data/base/curve2/Line2Data';
import { Line2Algo } from './geometry/algorithm/base/curve2/Line2Algo';
import CamToolBar from "./ui/CamToolBar";
import { CurveBuilder } from './geometry/algorithm/builder/CurveBuilder';
import { SurfaceBulder } from './geometry/algorithm/builder/SurfaceBulder';
import { PlaneSurfaceData } from './geometry/data/base/surface/PlaneSurfaceData';
import { Brep2Builder } from './geometry/algorithm/builder/Brep2Builder';
import { BrepMeshBuilder } from './helper/MeshBuilder';

export class Cube {
  public constructor() {
    // 创建一个场景
    const scene = new THREE.Scene();
    //通过scene.add(元素)添加元素

    const cam = CamToolBar;
    // 创建XZ平面的网格提
    scene.add(cam.grid_xz);
    scene.add(cam.grid_xy);
    scene.add(cam.grid_yz);


    // 创建一个直线段
    let lineEdge = Brep2Builder.BuildLineEdge2FromBeginEndPoint(new Vector2(0, 0), new Vector2(20, 20));
    let geoLineEdgeEdge = BrepMeshBuilder.BuildEdge2Mesh(lineEdge, THREE.Color.NAMES.red, 1);
    geoLineEdgeEdge.name = "Line2";
    scene.add(geoLineEdgeEdge);

    // 创建一个圆
    let circleEdge = Brep2Builder.BuildCircleEdge2FromCenterRadius(new Vector2(0, 0), 10);
    let geoCircleEdgeEdge = BrepMeshBuilder.BuildEdge2Mesh(circleEdge, THREE.Color.NAMES.green, 64);
    geoCircleEdgeEdge.name = "Circle2";
    scene.add(geoCircleEdgeEdge);

    // 创建一个圆弧
    let arcEdge = Brep2Builder.BuildCircleEdge2FromCenterBeginEndPoin(new Vector2(0, 0), new Vector2(15, 15), new Vector2(0, 15));
    let geoArcEdgeEdge = BrepMeshBuilder.BuildEdge2Mesh(arcEdge, THREE.Color.NAMES.blue, 16);
    geoArcEdgeEdge.name = "Arc2";
    scene.add(geoArcEdgeEdge);

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


    const mesh0 = new THREE.Mesh(geometry0, material0);
    mesh0.position.x = -2;
    mesh0.name = "Box";
    // scene.add(mesh0);

    const mesh1 = new THREE.Mesh(geometry1, material1);
    mesh1.position.x = 0;
    mesh1.name = "sphere";
    // scene.add(mesh1);

    const mesh2 = new THREE.Mesh(geometry2, material2);
    mesh2.position.x = 3;
    mesh2.name = "cylinder";
    // scene.add(mesh2);

    // 创建一个 WebGPU 渲染器
    const renderer = new WEBGPU.WebGPURenderer({ antialias: false });
    renderer.setClearColor(0x000000);
    renderer.samples = 4;

    // 设置渲染器的大小
    renderer.setSize(window.innerWidth, window.innerHeight);
    // 将渲染器的 DOM 元素添加到页面中
    document.getElementById('gpu').appendChild(renderer.domElement)

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
      if (cam.perspective.isActive) {
        cam.perspective.onFrame(delta);
        renderer.render(scene, cam.perspective.camera);
      }
      if (cam.orthographic.isActive) {
        cam.orthographic.onFrame(delta);
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

    let v2 = new Vector2();
    let line = new Line2Data();
    let plane = new PlaneSurfaceData();
    let lineAlg = CurveBuilder.Algorithm2ByData(line);
    let planeAlg = SurfaceBulder.BuildSurfaceAlgorithmByData(plane);
  }
}
