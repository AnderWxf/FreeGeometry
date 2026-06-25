import { ImportJson } from "../../../Doc";
import { Command } from "../../Command";
import * as THREE from "three";
import { Global } from "../../../../core/Global";
import type { CommandExecuter } from "../../CommandExecuter";
class SceneLoadCom extends Command {
  public olds: THREE.Object3D[];
  public results: THREE.Object3D[];
  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
    this.olds = [];
    this.results = [];
  }
  static this_: SceneLoadCom;
  async exec() {
    SceneLoadCom.this_ = this;
    try {
      document.getElementById('fileInput').addEventListener('change', this.onLoaded);
      document.getElementById('fileInput').click();
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
    const this_ = SceneLoadCom.this_;
    reader.onload = function (e: any) {
      try {
        // 保存原有数据，并清空场景
        let scene = Global.scene;
        this_.olds.push(...scene.objects);
        scene.clear();
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
      Global.scene.add(...this.olds);
    }
  }
  override redo() {
    if (this._isDone) {
      Global.scene.add(...this.results);
      Global.scene.remove(...this.olds);
    }
  }
}
export { SceneLoadCom }