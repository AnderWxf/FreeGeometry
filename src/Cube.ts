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
import { Arc2Data } from './geometry/data/base/curve2/Arc2Data';
import { Hyperbola2Data } from './geometry/data/base/curve2/Hyperbola2Data';
import { Parabola2Data } from './geometry/data/base/curve2/Parabola2Data';
import { Nurbs2Data } from './geometry/data/base/curve2/Nurbs2Data';
import type { Curve2Data } from './geometry/data/base/Curve2Data';
import type { Edge2 } from './geometry/data/brep/Brep2';
import type { Curve2Algo } from './geometry/algorithm/base/Curve2Algo';

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

    // 创建一个直线段
    let line2Edge = Brep2Builder.BuildLineEdge2FromBeginEndPoint(new Vector2(0, 10.94), new Vector2(10, 10.94));
    line2Edge.u.x = -100;
    line2Edge.u.y = 100;
    let geoLine2EdgeEdge = BrepMeshBuilder.BuildEdge2Mesh(line2Edge, THREE.Color.NAMES.red);
    geoLine2EdgeEdge.name = "Line2_2";

    // 创建一个Nurbs线段
    let nurbsEdge = Brep2Builder.BuildEdge2FromFittingPoints([
      new Vector2(0, 0),
      new Vector2(10, 10),
      new Vector2(20, 0),
      new Vector2(30, 10)
    ]);
    let geoNurbsEdge = BrepMeshBuilder.BuildEdge2Mesh(nurbsEdge, THREE.Color.NAMES.mediumseagreen, 256);
    let geoNurbsTangents = BrepMeshBuilder.BuildEdge2Tangents(nurbsEdge, THREE.Color.NAMES.orangered, 8);

    let nurbsEdge1 = Brep2Builder.BuildEdge2FromFittingPoints([
      new Vector2(0, 10),
      new Vector2(10, 0),
      new Vector2(20, 10),
      new Vector2(30, 0)
    ]);
    let geoNurbsEdge1 = BrepMeshBuilder.BuildEdge2Mesh(nurbsEdge1, THREE.Color.NAMES.orange, 256);
    let geoNurbsTangents1 = BrepMeshBuilder.BuildEdge2Tangents(nurbsEdge1, THREE.Color.NAMES.orangered, 8);

    scene.add(geoLineEdgeEdge);
    scene.add(geoLine1EdgeEdge);
    scene.add(geoLine2EdgeEdge);
    scene.add(geoCircleEdgeEdge);
    scene.add(geoCircleEdgeEdge_);
    scene.add(geoCircle1EdgeEdge);
    scene.add(geoArcEdgeEdge);
    scene.add(geoEllipseEdge);
    scene.add(geoHyperbolaLeftEdgeEdge);
    scene.add(geoHyperbolaRightEdgeEdge);
    scene.add(geoParabolaEdgeEdge);
    scene.add(geoNurbsEdge); //scene.add(geoNurbsTangents);
    scene.add(geoNurbsEdge1); //scene.add(geoNurbsTangents1);

    let curves = new Array<Curve2Data>();
    curves.push(lineEdge.curve);
    curves.push(line1Edge.curve);
    curves.push(line2Edge.curve);
    curves.push(circleEdge.curve);
    curves.push(circleEdge_.curve);
    curves.push(circle1Edge.curve);
    curves.push(arcEdge.curve);
    curves.push(ellipseEdge.curve);
    curves.push(hyperbolaLeftEdge.curve);
    curves.push(hyperbolaRightEdge.curve);
    curves.push(parabolaEdge.curve);
    curves.push(nurbsEdge.curve);
    curves.push(nurbsEdge1.curve);

    let edges = new Array<Edge2>();
    // edges.push(lineEdge);
    // edges.push(line1Edge);
    // edges.push(line2Edge);
    // edges.push(circleEdge);
    // edges.push(circleEdge_);
    // edges.push(circle1Edge);
    // edges.push(arcEdge);
    // edges.push(ellipseEdge);
    // edges.push(hyperbolaLeftEdge);
    // edges.push(hyperbolaRightEdge);
    // edges.push(parabolaEdge);
    // edges.push(nurbsEdge);

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
    let curveInter = true;
    let edgeInter = false;
    if (curveInter) {
      let begin = new Date().getTime();
      let inters = new Array<InterOfCurve2>();
      for (let i = 0; i < curves.length - 1; i++) {
        let c0 = curves[i];
        for (let j = i + 1; j < curves.length; j++) {
          let c1 = curves[j];
          let beginij = new Date().getTime();
          if (c0 instanceof Line2Data) {
            if (c1 instanceof Line2Data) {
              inters.push(...Curve2Inter.LineXLine(c0, c1, 1e-4, 1e-10));
            }
            else if (c1 instanceof Arc2Data) {
              inters.push(...Curve2Inter.LineXArc(c0, c1, 1e-4, 1e-10));
            }
            else if (c1 instanceof Hyperbola2Data) {
              inters.push(...Curve2Inter.LineXHyperbola(c0, c1, 1e-4, 1e-10));
            }
            else if (c1 instanceof Parabola2Data) {
              inters.push(...Curve2Inter.LineXParabola(c0, c1, 1e-4, 1e-10));
            }
            else if (c1 instanceof Nurbs2Data) {
              inters.push(...Curve2Inter.LineXNurbs(c0, c1, 1e-4, 1e-10));
            }
          }
          else if (c0 instanceof Arc2Data || c0 instanceof Hyperbola2Data || c0 instanceof Parabola2Data) {
            if (c0 instanceof Arc2Data && c1 instanceof Arc2Data) {
              if (c0.radius.x === c0.radius.y && c1.radius.x === c1.radius.y) {
                inters.push(...Curve2Inter.QuadraticXQuadratic(c0, c1, 1e-4, 1e-10, 2));
              } else {
                inters.push(...Curve2Inter.QuadraticXQuadratic(c0, c1, 1e-4, 1e-10, 4));
              }
            }
            else if (c1 instanceof Arc2Data || c1 instanceof Hyperbola2Data || c1 instanceof Parabola2Data) {
              inters.push(...Curve2Inter.QuadraticXQuadratic(c0, c1, 1e-4, 1e-10));
            }
            else if (c1 instanceof Nurbs2Data) {
              inters.push(...Curve2Inter.QuadraticXNurbs(c0, c1, 1e-4, 1e-10));
            }
          }
          else if (c0 instanceof Nurbs2Data) {
            if (c1 instanceof Nurbs2Data) {
              inters.push(...Curve2Inter.NurbsXNurbs(c0, c1, 1e-4, 1e-10));
            }
          }
          let end = new Date().getTime();
          console.warn("i j: " + i + " " + j + " 单次耗时：" + (end - beginij) + " ms，共找到交点数量：" + inters.length);
        }
      }

      let end = new Date().getTime();
      console.warn("曲线交计算耗时：" + (end - begin) + " ms，共找到交点数量：，共找到交点数量：" + inters.length);
      console.warn("总计迭代：" + Curve2Inter.totaltimes);
      drawInters(inters);
    }
    if (edgeInter) {
      let begin = new Date().getTime();
      let inters = new Array<InterOfCurve2>();
      for (let i = 0; i < edges.length - 1; i++) {
        let e0 = edges[i];
        for (let j = i + 1; j < edges.length; j++) {
          let e1 = edges[j];
          let beginij = new Date().getTime();
          inters.push(...Curve2Inter.CurveXCurve(e0.curve, e1.curve, MathUtils.clamp(Math.round(Brep2Builder.Length(e0)), 32, 256), 1e-4, 1e-10, e0.u.x, e0.u.y));
          let end = new Date().getTime();
          console.warn("i j: " + i + " " + j + " 单次耗时：" + (end - beginij) + " ms，共找到交点数量：" + inters.length);
        }
      }

      let end = new Date().getTime();
      console.warn("边交计算耗时：" + (end - begin) + " ms，共找到交点数量：，共找到交点数量：" + inters.length);
      console.warn("总计迭代：" + Curve2Inter.totaltimes);
      drawInters(inters);
    }
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
