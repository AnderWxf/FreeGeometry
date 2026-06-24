import { Global } from "../../../../core/Global";
import { type DocNode } from "../../../Doc";
import type { UserData } from "../../../UserData";
import { Command } from "../../Command";
import * as THREE from "three";

class SceneSaveCom extends Command {
  async exec() {
    let scene = Global.scene;
    let os = scene.objects;
    let data: DocNode[] = [];
    for (let i = 0; i < os.length; i++) {
      const o = os[i] as THREE.Object3D;
      data.push({ userData: o.userData as UserData });
    }
    // 1. 将数据对象转为格式化的 JSON 字符串
    const jsonString = JSON.stringify(data, null, 2);

    // 2. 创建一个 Blob 对象，它就像是文件数据
    const blob = new Blob([jsonString], { type: 'application/json' });
    // 3. 为这个 Blob 创建一个临时的 URL
    const url = URL.createObjectURL(blob);
    // 4. 创建一个隐藏的 <a> 标签，并设置下载属性
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Scene_' + new Date().toLocaleString() + '.json'; // 指定下载的文件名

    // 5. 模拟点击下载
    document.body.appendChild(link);
    link.click();

    // 6. 清理资源
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    this.done();
  }
}
export { SceneSaveCom }