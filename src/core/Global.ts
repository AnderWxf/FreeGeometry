import { Select } from '../helper/Select';
import * as THREE from 'three';
import * as WEBGPU from 'three/src/three.WebGPU';
import type { CommandExecuter } from '../helper/command/CommandExecuter';

export class Global {
    static version: string = "0.0.1";
    static author: string = "wangxiaofeng";
    static email: string = "wxfbj@sohu.com";
    static website: string = "";
    static description: string = "A geometry library for 3D modeling.";

    static select: Select;
    static scene: THREE.Scene;
    static renderer: WEBGPU.WebGPURenderer;
    static camera: THREE.Camera;
    static gpu: HTMLElement;
    static canvas: HTMLCanvasElement;

    static isShowAssists: boolean = true;
    static comExector: CommandExecuter;
}

