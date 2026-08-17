import { Global } from "../../../../core/Global";
import { DataBase } from "../../../../geometry/data/DataBase";
import type { UserData } from "../../../UserData";
import { Command } from "../../Command";
import type { CommandExecuter } from "../../CommandExecuter";
import * as THREE from "three";

/**
 * Undo processing command class.
 * 
 */
class ComUnDo extends Command {
  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
  }

  async exec(): Promise<void> {
    let str = this._text;
    let paras = str.split(' ');
    // 以前选择的取消选择
    Global.comExector.undo()
    this.done();
  }

  override cancel() {
    super.cancel();
    this.unbind(window);
  }

  override done() {
    super.done();
    this.unbind(window);
  }
  override undo() {
    Global.comExector.redo();
  }
  override redo() {
    if (this._isDone) {
      Global.comExector.undo();
    }
  }
}
export { ComUnDo };