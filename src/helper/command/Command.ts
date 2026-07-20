import { Global } from "../../core/Global";
import { type AssisPoint } from "../UserData";
import type { CommandExecuter } from "./CommandExecuter";
import * as THREE from "three";

/**
 * Command base class.
 * 
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
  protected createAssistPoint(a: AssisPoint): THREE.Mesh {
    const material = new THREE.MeshBasicMaterial({ color: a.c });
    const mesh = new THREE.Mesh(Command.geometry, material);
    mesh.position.x = a.p.x;
    mesh.position.y = a.p.y;
    mesh.name = "assist";
    mesh.userData.canPick = true;
    mesh.userData.isAssist = true;
    mesh.userData.color = a.c;
    mesh.userData.original = a.p;
    mesh.visible = Global.isShowAssists;
    return mesh;
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
  }
}
export { Command };