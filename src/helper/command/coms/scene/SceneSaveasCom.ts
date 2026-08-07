import { useState } from "react";
import { Global } from "../../../../core/Global";
import { type DocNode } from "../../../Doc";
import type { UserData } from "../../../UserData";
import { Command } from "../../Command";
import * as THREE from "three";

class SceneSaveasCom extends Command {
  static link: HTMLAnchorElement = null;
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

    let filename = 'Scene_' + new Date().toLocaleString() + '.json';
    filename = filename.replace(/[\/\\:*?"<>|]/g, '_'); // 替换非法字符
    Global.filename = filename;
    // 触发 React 组件更新（通过自定义事件）
    window.dispatchEvent(new CustomEvent('filenameChanged', { detail: Global.filename }));
    // 检测是否支持 File System Access API
    if ('showSaveFilePicker' in window) {
      const handle = await (window as any).showSaveFilePicker({
        suggestedName: filename,
        types: [{
          description: 'JSON Files',
          accept: { 'application/json': ['.json'] }
        }]
      });

      const writable = await handle.createWritable();
      await writable.write(JSON.stringify(data, null, 2));
      await writable.close();

    } else {
      // 2. 创建一个 Blob 对象，它就像是文件数据
      const blob = new Blob([jsonString], { type: 'application/json' });
      // 3. 为这个 Blob 创建一个临时的 URL
      const url = URL.createObjectURL(blob);
      // 4. 创建一个隐藏的 <a> 标签，并设置下载属性
      if (!SceneSaveasCom.link) {
        SceneSaveasCom.link = document.createElement('a');
        document.body.appendChild(SceneSaveasCom.link);
      }
      let link = SceneSaveasCom.link;
      link.href = url;
      link.download = filename; // 指定下载的文件名

      // 5. 模拟点击下载
      link.click();
    }
    this.done();
  }
}
export { SceneSaveasCom }