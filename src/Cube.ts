import * as THREE from 'three';
import * as WEBGPU from 'three/src/three.WebGPU';

export class Cube{
  public constructor(){
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

  //设置相机位置
  // camera.position.set(100, 100, 100); 

  // 创建一个立方体几何体
  const geometry0 = new THREE.BoxGeometry(1, 1, 1);
  // 创建一个球体
  const geometry1 = new THREE.SphereGeometry(1);
  //创建一个圆柱体
  const geometry2 = new THREE.CylinderGeometry(1,1,2.5);

  // 创建一个基础材质
  const material0 = new THREE.MeshBasicMaterial({ color: 0xff0000 });

  // 基础材质（可配置颜色、贴图等）
  const material1 = new THREE.MeshBasicMaterial({ color: 0x00ff00 });

    // 基础材质（可配置颜色、贴图等）
  const material2 = new THREE.MeshBasicMaterial({ color: 0x0000ff });

  // 创建网格对象
  const mesh0 = new THREE.Mesh(geometry0, material0);
  mesh0.position.x = -2;
  scene.add(mesh0);

  const mesh1 = new THREE.Mesh(geometry1, material1);
  mesh1.position.x = 0;
  scene.add(mesh1);

  const mesh2 = new THREE.Mesh(geometry2, material2);
  mesh2.position.x = 3;
  scene.add(mesh2);

  // 设置相机位置
  camera.position.z = 5;

  // 创建一个 WebGL 渲染器
  // const renderer = new THREE.WebGLRenderer();
  const renderer = new WEBGPU.WebGPURenderer({ antialias: false});
  renderer.setClearColor(0x000000);
  renderer.samples = 4;
  
  // 设置渲染器的大小
  renderer.setSize(window.innerWidth - 20, window.innerHeight - 20);
  // 将渲染器的 DOM 元素添加到页面中
  document.body.appendChild(renderer.domElement);
  // 动画循环
  function animate():void {
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
    //重新渲染
    renderer.render(scene, camera);
  }
   // 执行动画
  animate();
  }  
}
