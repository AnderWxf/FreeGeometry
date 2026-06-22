import * as THREE from "three";
import { Global } from "../../../core/Global";
import type { CommandExecuter } from "../CommandExecuter";
import { Command } from "../Command";


/**
 * Delete objets command class.
 * 
 */
class ComDelete extends Command {
  public results: THREE.Object3D[];
  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
    this.results = [];
  }
  async exec(): Promise<void> {
    this.bind(window);
    let selectedObjects = Global.select.selectedObjects;
    this.results.push(...selectedObjects);
    for (let i = 0; i < this.results.length; i++) {
      Global.scene.remove(this.results[i]);
    }
    this.done();
  }
  override cancel() {
    this.unbind(window);
  }

  override undo() {
    if (this._isDone) {
      for (let i = 0; i < this.results.length; i++) {
        Global.scene.add(this.results[i]);
      }
    }
  }
  override redo() {
    if (this._isDone) {
      for (let i = 0; i < this.results.length; i++) {
        Global.scene.remove(this.results[i]);
      }
    }
  }
}
export { ComDelete };