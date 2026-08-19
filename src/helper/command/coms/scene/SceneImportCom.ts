import { ImportJson } from "../../../Doc";
import { Command } from "../../Command";
import * as THREE from "three";
import { Global } from "../../../../core/Global";
import type { CommandExecuter } from "../../CommandExecuter";

/**
 * Import command class.
 * 格式：命令类型 filename
 */
class SceneImportCom extends Command {
  public results: THREE.Object3D[];
  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
    this.results = [];
  }
  static this_: SceneImportCom;
  static input_: HTMLInputElement;
  async exec() {

    let str = this._text;
    let paras = str.split(' ');

    SceneImportCom.this_ = this;
    try {
      if (!SceneImportCom.input_) {
        SceneImportCom.input_ = document.createElement('input');
        SceneImportCom.input_.type = 'file';
        SceneImportCom.input_.hidden = true;
        SceneImportCom.input_.accept = '.json,application/json';
      }
      SceneImportCom.input_.addEventListener('change', this.onLoaded);
      SceneImportCom.input_.addEventListener('cancel', this.onCancel);
      SceneImportCom.input_.click();
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
  onCancel(event: any): void {
    // 清理监听器，防止内存泄漏
    event.target.removeEventListener('change', this.onLoaded);
    event.target.removeEventListener('cancel', this.onCancel);
  }
  onLoaded(event: any): void {
    const this_ = SceneImportCom.this_;
    let str = this_._text;
    let paras = str.split(' ');

    this_.onCancel(event);
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
    this._text = paras[0] + ' ' + file.name;
    const reader = new FileReader();

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