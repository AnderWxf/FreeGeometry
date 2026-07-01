import { Global } from "../../../../core/Global";
import { Command } from "../../Command";
import * as THREE from "three";
import type { CommandExecuter } from "../../CommandExecuter";

class SceneClearCom extends Command {
  public olds: THREE.Object3D[];
  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
    this.olds = [];
  }
  async exec() {
    let scene = Global.scene;
    this.olds.push(...scene.objects);
    scene.clear();
    this.done();
  }
  override undo() {
    if (this._isDone) {
      Global.scene.add(...this.olds);
    }
  }
  override redo() {
    if (this._isDone) {
      Global.scene.remove(...this.olds);
    }
  }
}
export { SceneClearCom }