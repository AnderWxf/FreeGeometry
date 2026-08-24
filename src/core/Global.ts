import { Select } from '../helper/Select';
import * as THREE from 'three';
import * as WEBGPU from 'three/src/three.WebGPU';
import type { CommandExecuter } from '../helper/command/CommandExecuter';
import type { Scene } from '../helper/Scene';

export class Global {
  static version: string = "0.0.1";
  static author: string = "wangxiaofeng";
  static email: string = "wxfbj@sohu.com";
  static website: string = "";
  static description: string = "A geometry library for 3D modeling.";

  static select: Select;        // 全局选择和高亮工具
  static scene: Scene;          // 全局选场景对象
  static renderer: WEBGPU.WebGPURenderer;
  static camera: THREE.Camera;
  static gpu: HTMLElement;
  static canvas: HTMLCanvasElement;

  static isShowAssists: boolean = true;// 在选中或者鼠标悬浮的时候显示辅助物体
  static comExector: CommandExecuter;// 全局命令执行器

  static filename: string = '';// 当前保存、导入、加载、执行的文件名
}

