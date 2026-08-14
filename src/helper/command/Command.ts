import { Global } from "../../core/Global";
import { CreateAssistPoint, type AssisPoint } from "../UserData";
import type { CommandExecuter } from "./CommandExecuter";
import * as THREE from "three";

/**
 * Command base class.
 * 命令格式：
 * 创建命令：命令类型 p0.x p0.y p1.x p1.y ... UUID0 UUID1 ...
 * 修改命令：命令类型 UUID 控制点索引 p.x p.y
 * 变换命令：命令类型 p0.x p0.y p1.x p1.y UUID0 UUID1 ...
 * 布尔运算：命令类型 UUID0 UUID1 ...
 * 度量命令：命令类型 UUID0 UUID1 ...
 * 计算命令：命令类型 UUID0 UUID1 ...
 * 场景命令：命令类型 ...
 * 其他命令：命令类型 ...
 * 
 * 命令可以撤销重做。
 * 
 * 命令类型后面的额参数都是可选的，命令类型后面可以没有参数，也可以有多个参数。
 * 当命令类型后面有参数时，参数之间用空格分隔，参数的类型可以是数字、字符串、布尔值。
 * 当命令类型后面没有参数时需要人工在空间选中对象或者控制点，完成命令的执行。
 * 当命令执行完成后，应该在_text中记录命令的执行结果，方便脚本保存。
 *  
 * 命令的序列集合组成脚本，脚本可以保存为文本文件，文本文件可以加载为脚本执行。
 */
class Command {
  static geometry = new THREE.SphereGeometry(0.1);
  public results: any;
  protected _text: string;
  protected _isCancel: boolean = false;
  protected _isDone: boolean = false;
  protected _executer: CommandExecuter;
  constructor(executer: CommandExecuter, text: string) {
    this._executer = executer;
    this._text = text;
  }
  get text(): string {
    return this._text;
  }
  get isCancel(): boolean {
    return this._isCancel;
  }
  get isDone(): boolean {
    return this._isDone;
  }
  // 创建一个辅助点
  protected createAssistPoint(a: AssisPoint, isAssist: boolean = true): THREE.Mesh {
    return CreateAssistPoint(a, isAssist);
  }
  onMouseMove = (event: MouseEvent) => {
    this.onMouseMoveExec(event);
  };
  onMouseMoveExec(event: MouseEvent) {
  };
  onKeyDown = (event: KeyboardEvent) => {
    this.onKeyDownExec(event);
  }
  onKeyDownExec(event: KeyboardEvent) {
    switch (event.code) {
      case "Escape":
        this._isCancel = true;
        if (this._executer.isExecutingMe(this)) {
          this._executer.clear();
        }
        Global.select.clear();
        break;
    }
  }
  onKeyUp = (event: KeyboardEvent) => {
    this.onKeyUpExec(event);
  }
  onKeyUpExec(event: KeyboardEvent) {
  }
  bind(window: Window) {
    window.addEventListener("keydown", this.onKeyDown);
    window.addEventListener("keyup", this.onKeyUp);
    window.addEventListener("mousemove", this.onMouseMove);
  }
  unbind(window: Window) {
    window.removeEventListener("keydown", this.onKeyDown);
    window.removeEventListener("keyup", this.onKeyUp);
    window.removeEventListener("mousemove", this.onMouseMove);
  }
  undo() { }
  redo() { }
  exec() { }
  cancel() {
    this.unbind(window);
    this._isCancel = true;
  }
  done() {
    this.unbind(window);
    this._isDone = true;
    this._executer.recored(this);
    console.log('Command done: ' + this._text);
  }
}
export { Command };