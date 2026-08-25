import { Command } from "../../Command";
import { Global } from "../../../../core/Global";
import type { CommandExecuter } from "../../CommandExecuter";

/**
 * Stricp Execute command class.
 * 格式：命令类型 filename
 */
class SceneStricpExecCom extends Command {
  public results: string[];
  private _comms: Command[];
  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
    this.results = [];
    this._comms = [];
  }
  static this_: SceneStricpExecCom;
  static input_: HTMLInputElement;
  async exec() {
    SceneStricpExecCom.this_ = this;
    try {
      if (!SceneStricpExecCom.input_) {
        SceneStricpExecCom.input_ = document.createElement('input');
        SceneStricpExecCom.input_.type = 'file';
        SceneStricpExecCom.input_.hidden = true;
        SceneStricpExecCom.input_.accept = '.fg.txt,application/text';
      }
      SceneStricpExecCom.input_.addEventListener('change', this.onLoaded);
      SceneStricpExecCom.input_.addEventListener('cancel', this.onCancel);
      SceneStricpExecCom.input_.click();
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
    const this_ = SceneStricpExecCom.this_;
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
    if (!file.name.endsWith('.fg.txt') && file.type !== 'application/txt') {
      alert('请上传 fg 文件');
      this.cancel();
      return;
    }
    Global.filename = file.name;
    this._text = paras[0] + ' ' + file.name;
    // 触发 React 组件更新（通过自定义事件）
    window.dispatchEvent(new CustomEvent('filenameChanged', { detail: Global.filename }));
    const reader = new FileReader();

    reader.onload = function (e: any) {
      try {
        // 加载txt中的数据
        let txt = e.target.result as string;
        let str = txt.split('\n');
        for (let i = 0; i < str.length; i++) {
          let comm = str[i].trim();
          if (comm.length > 0) {
            this_.results.push(comm);
          }
        }
        this_._comms = Global.comExector.aotuExecute(this_.results);

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
  }
  override undo() {
    if (this._isDone) {
      for (let i = this._comms.length - 1; i >= 0; i--) {
        this._comms[i].undo();
      }
    }
  }
  override redo() {
    if (this._isDone) {
      for (let i = 0; i < this._comms.length; i++) {
        this._comms[i].redo();
      }
    }
  }
}
export { SceneStricpExecCom }