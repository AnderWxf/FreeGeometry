import { Global } from "../core/Global";
import type { UserData } from "./UserData";
import * as THREE from 'three';
declare global {
  interface Window {
    showSaveFilePicker?: (options?: any) => Promise<FileSystemFileHandle>;
    showOpenFilePicker?: (options?: any) => Promise<FileSystemFileHandle>;
  }
}
type Node = {
  userData: UserData,
}
class Document {
  async Save(): Promise<any> {
    let scene = Global.scene;
    let os = scene.objects;
    let data: Node[] = [];
    for (let i = 0; i < os.length; i++) {
      const o = os[i] as THREE.Object3D;
      data.push({ userData: o.userData as UserData });
    }
    try {
      // 1. 弹出“另存为”窗口让用户选择位置
      const fileHandle = await window.showSaveFilePicker({
        suggestedName: 'data.json',
        types: [{
          description: 'JSON files',
          accept: { 'application/json': ['.json'] },
        }],
      });

      // 2. 创建可写流
      const writable = await fileHandle.createWritable();

      // 3. 写入 JSON 数据
      const jsonString = JSON.stringify(data, null, 2);
      await writable.write(jsonString);

      // 4. 关闭文件流
      await writable.close();
      console.log('文件保存成功！');
    } catch (error) {
      // 用户取消或出错
      if (error.name !== 'AbortError') {
        console.error('保存失败:', error);
      }
    }
  }

  /**
   * 使用 File System Access API 加载 JSON 文件
   */
  async load(): Promise<any> {
    try {
      // 1. 检查浏览器是否支持
      if (!window.showOpenFilePicker) {
        throw new Error('当前浏览器不支持 File System Access API，请使用 Chrome/Edge 86+');
      }

      // 2. 打开文件选择器（限制为 JSON 文件）
      const fileHandle = await window.showOpenFilePicker({
        types: [{
          description: 'JSON Files',
          accept: {
            'application/json': ['.json'],
            'text/json': ['.json']
          }
        }],
        multiple: false, // 只允许选择一个文件
        excludeAcceptAllOption: true // 隐藏"所有文件"选项
      });

      // 3. 获取文件内容
      const file = await fileHandle.getFile();
      const text = await file.text();

      // 4. 解析 JSON
      const data = JSON.parse(text);
      console.log('文件加载成功:', data);
      return data;

    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.log('用户取消了文件选择');
          return null;
        }
        console.error('加载文件失败:', error);
        throw error;
      }
    }
  }
}
export {
  Document,
};