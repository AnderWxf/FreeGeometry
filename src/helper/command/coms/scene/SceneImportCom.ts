import { ImportJson, type DocNode } from "../../../Doc";
import { Command } from "../../Command";
import * as THREE from "three";
import { Global } from "../../../../core/Global";
import type { CommandExecuter } from "../../CommandExecuter";

class SceneImportCom extends Command {
  public results: THREE.Object3D[];
  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
    this.results = [];
  }
  static this_: SceneImportCom;
  async exec() {
    SceneImportCom.this_ = this;
    try {
      const fileInput = document.getElementById('fileInput');
      // 克隆元素（包括所有子节点）
      const newfileInput = fileInput.cloneNode(true) as HTMLElement;
      // 用克隆的元素替换原元素
      fileInput.parentNode.replaceChild(newfileInput, fileInput);
      newfileInput.addEventListener('change', this.onLoaded);
      newfileInput.click();
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          console.log('用户取消了文件选择');
        }
        console.error('加载文件失败:', error);
        this.cancel();
        throw error;
      }
    }
  }
  onLoaded(event: any): void {
    const file = event.target.files[0];
    if (!file) {
      alert('请选择一个文件');
      this.cancel();
      return;
    }
    // 验证文件类型
    if (!file.name.endsWith('.json') && file.type !== 'application/json') {
      alert('请上传 JSON 文件');
      this.cancel();
      return;
    }
    const reader = new FileReader();
    const this_ = SceneImportCom.this_;
    reader.onload = function (e: any) {
      try {
        // 加载json中的数据
        this_.results = ImportJson(e.target.result);
        this_.done();
      } catch (error) {
        console.log('文件格式错误：不是有效的 JSON');
        console.error('解析失败:', error);
        this_.cancel();
      }
    };
    reader.onerror = function () {
      console.log('读取文件失败，请重试');
      this_.cancel();
    };
    reader.readAsText(file);
  }

  override done() {
    super.done();
    Global.scene.add(...this.results);
  }
  override undo() {
    if (this._isDone) {
      Global.scene.remove(...this.results);
    }
  }
  override redo() {
    if (this._isDone) {
      Global.scene.add(...this.results);
    }
  }
}
export { SceneImportCom }