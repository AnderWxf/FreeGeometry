import { Global } from "../../../../core/Global";
import { Command } from "../../Command";
import type { CommandExecuter } from "../../CommandExecuter";

/**
 * Redo processing command class.
 * 格式：命令类型
 */
class ComReDo extends Command {
  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
    this._isNeedHistory = false;
  }

  async exec(): Promise<void> {
    let str = this._text;
    let paras = str.split(' ');
    Global.comExector.redo();
    this.done();
  }

  override cancel() {
    super.cancel();
    this.unbind(window);
  }

  override done() {
    super.done();
  }

  override undo() {
    if (this._isDone) {
      Global.comExector.undo();
    }
  }
  override redo() {
    if (this._isDone) {
      Global.comExector.redo();
    }
  }
}
export { ComReDo };