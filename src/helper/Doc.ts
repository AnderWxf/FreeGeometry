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
class Doc {

  static async Save(): Promise<any> {
    let scene = Global.scene;
    let os = scene.objects;
    let data: Node[] = [];
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
  }

  static async Load(): Promise<any> {
    try {
      document.getElementById('fileInput').addEventListener('change', Doc.LoadChange);
      document.getElementById('fileInput').click();
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

  static LoadChange(event: any): void {
    const file = event.target.files[0];
    if (!file) {
      alert('请选择一个文件');
      return;
    }

    // 验证文件类型
    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      alert('请上传 JSON 文件');
      return;
    }

    const reader = new FileReader();
    reader.onload = function (e: any) {
      try {
        const jsonData = JSON.parse(e.target.result);
        console.log('✅ 加载成功:', jsonData);
      } catch (error) {
        alert('文件格式错误：不是有效的 JSON');
        console.error('解析失败:', error);
      }
    };
    reader.onerror = function () {
      alert('读取文件失败，请重试');
    };
    reader.readAsText(file);
  }
}
export {
  Doc,
};