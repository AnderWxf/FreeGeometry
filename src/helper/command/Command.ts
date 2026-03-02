import { Global } from "../../core/Global";
import { bin } from "../../mathjs/lib/cjs/entry/pureFunctionsAny.generated";
import type { CommandExecuter } from "./CommandExecuter";

/**
 * Command base class.
 * 
 */
class Command {
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
    onKeyDown = (event: KeyboardEvent) => {
        switch (event.code) {
            case "Escape":
                this._isCancel = true;
                break;
        }
    }
    bind(window: Window) {
        window.addEventListener("keydown", this.onKeyDown);
    }
    unbind(window: Window) {
        window.removeEventListener("keydown", this.onKeyDown);
    }
    undo() { }
    redo() { }
    exec() { }
    done() {
        this.unbind(window);
        this._isDone = true;
        this._executer.recored(this);
    }
}
export { Command };