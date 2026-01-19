import * as THREE from 'three';
import * as WEBGPU from 'three/src/three.WebGPU';
import { Vector2 } from "./math/Math"
import * as MATHJS from './mathjs';
import { Line2Data } from './geometry/data/base/curve2/Line2Data';
import { Line2Algo } from './geometry/algorithm/base/curve2/Line2Algo';
import CamToolBar from "./ui/CamToolBar";
import { CurveBuilder } from './geometry/algorithm/builder/CurveBuilder';
import { SurfaceBulder } from './geometry/algorithm/builder/SurfaceBulder';
import { PlaneSurfaceData } from './geometry/data/base/surface/PlaneSurfaceData';
import { Brep2Builder } from './geometry/algorithm/builder/Brep2Builder';
import { BrepMeshBuilder } from './helper/MeshBuilder';
import { MathUtils } from './math/MathUtils';
import { Curve2Inter, type InterOfCurve2 } from './geometry/algorithm/relation/intersection/Curve2Inter';
import { SolveEquation } from './geometry/algorithm/base/SolveEquation';
import type { Arc2Data } from './geometry/data/base/curve2/Arc2Data';
import type { Hyperbola2Data } from './geometry/data/base/curve2/Hyperbola2Data';
import type { Parabola2Data } from './geometry/data/base/curve2/Parabola2Data';
import type { Nurbs2Data } from './geometry/data/base/curve2/Nurbs2Data';

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

    // 创建一个基础材质
    const material0 = new THREE.MeshBasicMaterial({ color: THREE.Color.NAMES.red });

    // 基础材质（可配置颜色、贴图等）
    const material1 = new THREE.MeshBasicMaterial({ color: THREE.Color.NAMES.green });

    // 基础材质（可配置颜色、贴图等）
    const material2 = new THREE.MeshBasicMaterial({ color: THREE.Color.NAMES.blue });


    // 创建一个圆
    let circleEdge = Brep2Builder.BuildCircleEdge2FromCenterRadius(new Vector2(0, 0), 1);
    let geoCircleEdgeEdge = BrepMeshBuilder.BuildEdge2Mesh(circleEdge, THREE.Color.NAMES.green);
    geoCircleEdgeEdge.name = "Circle2";

    let circleEdge_ = Brep2Builder.BuildCircleEdge2FromCenterRadius(new Vector2(2, 0), 1);
    let geoCircleEdgeEdge_ = BrepMeshBuilder.BuildEdge2Mesh(circleEdge_, THREE.Color.NAMES.green);
    geoCircleEdgeEdge_.name = "Circle2";


    // 三点创建一个圆
    let circle1Edge = Brep2Builder.BuildCircleFromBeginMiddleEndPoint(new Vector2(0, 0), new Vector2(15, 15), new Vector2(0, 25));
    let geoCircle1EdgeEdge = BrepMeshBuilder.BuildEdge2Mesh(circle1Edge, THREE.Color.NAMES.yellow);
    geoCircle1EdgeEdge.name = "Circle2_Three_Point";

    // 创建一个圆弧
    let arcEdge = Brep2Builder.BuildCircleArcEdge2FromCenterBeginEndPoin(new Vector2(0, 0), new Vector2(13, 13), new Vector2(0, 13));
    arcEdge.u.y = arcEdge.u.x + Math.PI * 2;
    let geoArcEdgeEdge = BrepMeshBuilder.BuildEdge2Mesh(arcEdge, THREE.Color.NAMES.blue);
    geoArcEdgeEdge.name = "Arc2";

    // 根据三点创建一个椭圆
    let ellipseEdge = Brep2Builder.BuildEllipseEdge2FromCenterBeginEndPoint(new Vector2(0, 0), new Vector2(20, 0), new Vector2(0, 10));
    let geoEllipseEdge = BrepMeshBuilder.BuildEdge2Mesh(ellipseEdge, THREE.Color.NAMES.blueviolet);
    geoEllipseEdge.name = "Ellipse2_Three_Point";

    // 根据三点创建一个双曲线
    let hyperbolaRightEdge = Brep2Builder.BuildHyperbolaEdge2FromCenterABPoint(new Vector2(0, 0), new Vector2(15, 0), new Vector2(0, 30), -Math.PI / 2 + 1e-10, Math.PI * 1 / 2 - 1e-10);
    let geoHyperbolaRightEdgeEdge = BrepMeshBuilder.BuildEdge2Mesh(hyperbolaRightEdge, THREE.Color.NAMES.aqua);
    geoHyperbolaRightEdgeEdge.name = "Hyperbola2_Right_Three_Point";

    let hyperbolaLeftEdge = Brep2Builder.BuildHyperbolaEdge2FromCenterABPoint(new Vector2(0, 0), new Vector2(15, 0), new Vector2(0, 30), Math.PI / 2 + 1e-10, Math.PI * 3 / 2 - 1e-10);
    let geoHyperbolaLeftEdgeEdge = BrepMeshBuilder.BuildEdge2Mesh(hyperbolaLeftEdge, THREE.Color.NAMES.fuchsia);
    geoHyperbolaLeftEdgeEdge.name = "Hyperbola2_Left_Three_Point";


    // 根据两点创建一个抛物线
    let parabolaEdge = Brep2Builder.BuildParabolaEdge2FromCenterABPoint(new Vector2(0, 0), new Vector2(0, 10), 500, -500);
    let geoParabolaEdgeEdge = BrepMeshBuilder.BuildEdge2Mesh(parabolaEdge, THREE.Color.NAMES.coral);
    geoParabolaEdgeEdge.name = "Parabola2_Left_Three_Point";


    // 创建一个直线段
    let lineEdge = Brep2Builder.BuildLineEdge2FromBeginEndPoint(new Vector2(0, 0), new Vector2(20, 20));
    lineEdge.u.x = -100;
    lineEdge.u.y = 100;
    let geoLineEdgeEdge = BrepMeshBuilder.BuildEdge2Mesh(lineEdge, THREE.Color.NAMES.red);
    geoLineEdgeEdge.name = "Line2";
    geoLineEdgeEdge.frustumCulled = false;


    // 创建一个直线段
    let line1Edge = Brep2Builder.BuildLineEdge2FromBeginEndPoint(new Vector2(20, 0), new Vector2(0, 20));
    line1Edge.u.x = -100;
    line1Edge.u.y = 100;
    let geoLine1EdgeEdge = BrepMeshBuilder.BuildEdge2Mesh(line1Edge, THREE.Color.NAMES.red);
    geoLine1EdgeEdge.name = "Line2_1";

    // 创建一个Nurbs线段
    let nurbsEdge = Brep2Builder.BuildEdge2FromFittingPoints([
      new Vector2(0, 0),
      new Vector2(10, 10),
      new Vector2(20, 0),
      new Vector2(30, 10)
    ]);
    let geoNurbsEdge = BrepMeshBuilder.BuildEdge2Mesh(nurbsEdge, THREE.Color.NAMES.orange);
    geoNurbsEdge.name = "Nurbs2";

    // scene.add(geoCircleEdgeEdge);
    // scene.add(geoCircleEdgeEdge_);
    // scene.add(geoCircle1EdgeEdge);
    // scene.add(geoArcEdgeEdge);
    // scene.add(geoEllipseEdge);
    scene.add(geoLineEdgeEdge);
    scene.add(geoLine1EdgeEdge);
    // scene.add(geoHyperbolaLeftEdgeEdge);
    // scene.add(geoHyperbolaRightEdgeEdge);
    // scene.add(geoParabolaEdgeEdge);
    scene.add(geoNurbsEdge);

    let drawInters = (inters: Array<InterOfCurve2>) => {
      for (let i = 0; i < inters.length; i++) {
        // 创建一个球体
        const geometry = new THREE.SphereGeometry(0.1);
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = inters[i].p.x;
        mesh.position.y = inters[i].p.y;
        mesh.name = "inter_" + i;
        scene.add(mesh);
      }
    }


    // 基础材质（可配置颜色、贴图等）
    const material = new THREE.MeshBasicMaterial({ color: 0x0088ff });
    let begin = new Date().getTime();
    let inters = new Array<InterOfCurve2>();
    if (0) {
      inters.push(...Curve2Inter.LineXLine(lineEdge.curve, line1Edge.curve, 1e-4, 1e-10));
      console.warn("共找到交点数量：" + inters.length);
      inters.push(...Curve2Inter.LineXArc(lineEdge.curve, circleEdge.curve as Arc2Data, 1e-4, 1e-10));
      console.warn("共找到交点数量：" + inters.length);
      inters.push(...Curve2Inter.LineXArc(lineEdge.curve, circle1Edge.curve as Arc2Data, 1e-4, 1e-10));
      console.warn("共找到交点数量：" + inters.length);
      inters.push(...Curve2Inter.LineXArc(lineEdge.curve, arcEdge.curve as Arc2Data, 1e-4, 1e-10));
      console.warn("共找到交点数量：" + inters.length);
      inters.push(...Curve2Inter.LineXArc(lineEdge.curve, ellipseEdge.curve as Arc2Data, 1e-4, 1e-10));
      console.warn("共找到交点数量：" + inters.length);
      inters.push(...Curve2Inter.LineXHyperbola(lineEdge.curve, hyperbolaLeftEdge.curve as Hyperbola2Data, 1e-4, 1e-10));
      console.warn("共找到交点数量：" + inters.length);
      inters.push(...Curve2Inter.LineXHyperbola(lineEdge.curve, hyperbolaRightEdge.curve as Hyperbola2Data, 1e-4, 1e-10));
      console.warn("共找到交点数量：" + inters.length);
      inters.push(...Curve2Inter.LineXParabola(lineEdge.curve, parabolaEdge.curve as Parabola2Data, 1e-4, 1e-10));
      console.warn("共找到交点数量：" + inters.length);

      inters.push(...Curve2Inter.LineXArc(line1Edge.curve, circleEdge.curve as Arc2Data, 1e-4, 1e-10));
      console.warn("共找到交点数量：" + inters.length);
      inters.push(...Curve2Inter.LineXArc(line1Edge.curve, circle1Edge.curve as Arc2Data, 1e-4, 1e-10));
      console.warn("共找到交点数量：" + inters.length);
      inters.push(...Curve2Inter.LineXArc(line1Edge.curve, arcEdge.curve as Arc2Data, 1e-4, 1e-10));
      console.warn("共找到交点数量：" + inters.length);
      inters.push(...Curve2Inter.LineXArc(line1Edge.curve, ellipseEdge.curve as Arc2Data, 1e-4, 1e-10));
      console.warn("共找到交点数量：" + inters.length);
      inters.push(...Curve2Inter.LineXHyperbola(line1Edge.curve, hyperbolaLeftEdge.curve as Hyperbola2Data, 1e-4, 1e-10));
      console.warn("共找到交点数量：" + inters.length);
      inters.push(...Curve2Inter.LineXHyperbola(line1Edge.curve, hyperbolaRightEdge.curve as Hyperbola2Data, 1e-4, 1e-10));
      console.warn("共找到交点数量：" + inters.length);
      inters.push(...Curve2Inter.LineXParabola(line1Edge.curve, parabolaEdge.curve as Parabola2Data, 1e-4, 1e-10));
      console.warn("共找到交点数量：" + inters.length);

      inters.push(...Curve2Inter.QuadraticXQuadratic(circleEdge.curve as Arc2Data, circleEdge_.curve as Arc2Data, 1e-4, 1e-10, 2));
      console.warn("共找到交点数量：" + inters.length);
      inters.push(...Curve2Inter.QuadraticXQuadratic(circleEdge.curve as Arc2Data, circle1Edge.curve as Arc2Data, 1e-4, 1e-10, 2));
      console.warn("共找到交点数量：" + inters.length);
      inters.push(...Curve2Inter.QuadraticXQuadratic(circleEdge.curve as Arc2Data, arcEdge.curve as Arc2Data, 1e-4, 1e-10, 2));
      console.warn("共找到交点数量：" + inters.length);
      inters.push(...Curve2Inter.QuadraticXQuadratic(circleEdge.curve as Arc2Data, ellipseEdge.curve as Arc2Data, 1e-4, 1e-10));
      console.warn("共找到交点数量：" + inters.length);
      inters.push(...Curve2Inter.QuadraticXQuadratic(circleEdge.curve as Arc2Data, hyperbolaLeftEdge.curve as Hyperbola2Data, 1e-4, 1e-10));
      console.warn("共找到交点数量：" + inters.length);
      inters.push(...Curve2Inter.QuadraticXQuadratic(circleEdge.curve as Arc2Data, hyperbolaRightEdge.curve as Hyperbola2Data, 1e-4, 1e-10));
      console.warn("共找到交点数量：" + inters.length);
      inters.push(...Curve2Inter.QuadraticXQuadratic(circleEdge.curve as Arc2Data, parabolaEdge.curve as Parabola2Data, 1e-4, 1e-10));
      console.warn("共找到交点数量：" + inters.length);

      inters.push(...Curve2Inter.QuadraticXQuadratic(circleEdge_.curve as Arc2Data, circle1Edge.curve as Arc2Data, 1e-4, 1e-10, 2));
      console.warn("共找到交点数量：" + inters.length);
      inters.push(...Curve2Inter.QuadraticXQuadratic(circleEdge_.curve as Arc2Data, arcEdge.curve as Arc2Data, 1e-4, 1e-10, 2));
      console.warn("共找到交点数量：" + inters.length);
      inters.push(...Curve2Inter.QuadraticXQuadratic(circleEdge_.curve as Arc2Data, ellipseEdge.curve as Arc2Data, 1e-4, 1e-10));
      console.warn("共找到交点数量：" + inters.length);
      inters.push(...Curve2Inter.QuadraticXQuadratic(circleEdge_.curve as Arc2Data, hyperbolaLeftEdge.curve as Hyperbola2Data, 1e-4, 1e-10));
      console.warn("共找到交点数量：" + inters.length);
      inters.push(...Curve2Inter.QuadraticXQuadratic(circleEdge_.curve as Arc2Data, hyperbolaRightEdge.curve as Hyperbola2Data, 1e-4, 1e-10));
      console.warn("共找到交点数量：" + inters.length);
      inters.push(...Curve2Inter.QuadraticXQuadratic(circleEdge_.curve as Arc2Data, parabolaEdge.curve as Parabola2Data, 1e-4, 1e-10));
      console.warn("共找到交点数量：" + inters.length);
      inters.push(...Curve2Inter.QuadraticXQuadratic(circle1Edge.curve as Arc2Data, arcEdge.curve as Arc2Data, 1e-4, 1e-10, 2));
      console.warn("共找到交点数量：" + inters.length);
      inters.push(...Curve2Inter.QuadraticXQuadratic(circle1Edge.curve as Arc2Data, ellipseEdge.curve as Arc2Data, 1e-4, 1e-10));
      console.warn("共找到交点数量：" + inters.length);
      inters.push(...Curve2Inter.QuadraticXQuadratic(circle1Edge.curve as Arc2Data, hyperbolaLeftEdge.curve as Hyperbola2Data, 1e-4, 1e-10));
      console.warn("共找到交点数量：" + inters.length);
      inters.push(...Curve2Inter.QuadraticXQuadratic(circle1Edge.curve as Arc2Data, hyperbolaRightEdge.curve as Hyperbola2Data, 1e-4, 1e-10));
      console.warn("共找到交点数量：" + inters.length);
      inters.push(...Curve2Inter.QuadraticXQuadratic(circle1Edge.curve as Arc2Data, parabolaEdge.curve as Parabola2Data, 1e-4, 1e-10));
      console.warn("共找到交点数量：" + inters.length);

      inters.push(...Curve2Inter.QuadraticXQuadratic(arcEdge.curve as Arc2Data, ellipseEdge.curve as Arc2Data, 1e-4, 1e-10));
      console.warn("共找到交点数量：" + inters.length);
      inters.push(...Curve2Inter.QuadraticXQuadratic(arcEdge.curve as Arc2Data, hyperbolaLeftEdge.curve as Hyperbola2Data, 1e-4, 1e-10));
      console.warn("共找到交点数量：" + inters.length);
      inters.push(...Curve2Inter.QuadraticXQuadratic(arcEdge.curve as Arc2Data, hyperbolaRightEdge.curve as Hyperbola2Data, 1e-4, 1e-10));
      console.warn("共找到交点数量：" + inters.length);
      inters.push(...Curve2Inter.QuadraticXQuadratic(arcEdge.curve as Arc2Data, parabolaEdge.curve as Parabola2Data, 1e-4, 1e-10));
      console.warn("共找到交点数量：" + inters.length);

      inters.push(...Curve2Inter.QuadraticXQuadratic(ellipseEdge.curve as Arc2Data, hyperbolaLeftEdge.curve as Hyperbola2Data, 1e-4, 1e-10));
      console.warn("共找到交点数量：" + inters.length);
      inters.push(...Curve2Inter.QuadraticXQuadratic(ellipseEdge.curve as Arc2Data, hyperbolaRightEdge.curve as Hyperbola2Data, 1e-4, 1e-10));
      console.warn("共找到交点数量：" + inters.length);
      inters.push(...Curve2Inter.QuadraticXQuadratic(ellipseEdge.curve as Arc2Data, parabolaEdge.curve as Parabola2Data, 1e-4, 1e-10));
      console.warn("共找到交点数量：" + inters.length);

      inters.push(...Curve2Inter.QuadraticXQuadratic(hyperbolaLeftEdge.curve as Arc2Data, parabolaEdge.curve as Hyperbola2Data, 1e-4, 1e-10));
      console.warn("共找到交点数量：" + inters.length);
      inters.push(...Curve2Inter.QuadraticXQuadratic(hyperbolaRightEdge.curve as Arc2Data, parabolaEdge.curve as Parabola2Data, 1e-4, 1e-10));
      console.warn("共找到交点数量：" + inters.length);

      let end = new Date().getTime();
      console.warn("计算耗时：" + (end - begin) + " 毫秒，共找到交点数量：" + inters.length);
      console.warn("总计迭代：" + Curve2Inter.totaltimes);
    }
    inters.push(...Curve2Inter.LineXNurbs(lineEdge.curve as Line2Data, nurbsEdge.curve as Nurbs2Data, 1e-4, 1e-10, -1));
    inters.push(...Curve2Inter.LineXNurbs(line1Edge.curve as Line2Data, nurbsEdge.curve as Nurbs2Data, 1e-4, 1e-10, -1));
    console.warn("共找到交点数量：" + inters.length);
    drawInters(inters);

    // 创建一个立方体几何体
    const geometry0 = new THREE.BoxGeometry(1, 1, 1);
    // 创建一个球体
    const geometry1 = new THREE.SphereGeometry(1);
    //创建一个圆柱体
    const geometry2 = new THREE.CylinderGeometry(1, 1, 2.5);




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
    // SolveEquation.testQuadraticSolver();
    // SolveEquation.testCubicSolver();
    // SolveEquation.testQuarticSolver();
  }
}
