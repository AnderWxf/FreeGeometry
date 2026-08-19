import * as THREE from "three";
import { Global } from "../../../../core/Global";
import type { CommandExecuter } from "../../CommandExecuter";
import { Command } from "../../Command";


/**
 * Delete objets command class.
 * 格式：命令类型 uuid0 uuid1 ...
 */
class ComDelete extends Command {
  public results: THREE.Object3D[];
  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
    this.results = [];
  }
  async exec(): Promise<void> {
    this.bind(window);
    let str = this._text;
    let paras = str.split(' ');
    // 指定了对象
    if (paras.length >= 2) {
      let objs = Global.scene.getObjectsByUUIDs(paras.slice(1));
      this.results.push(...objs);
    } else {
      let selectedObjects = Global.select.selectedObjects;
      this.results.push(...selectedObjects);
    }

    this._text = paras[0] ;
    for (let i = 0; i < this.results.length; i++) {
      this._text += ' ' + this.results[i].uuid;
    }

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