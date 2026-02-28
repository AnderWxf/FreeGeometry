import { bin } from "../../mathjs/lib/cjs/entry/pureFunctionsAny.generated";

/**
 * Command base class.
 * 
 */
class Command {
    protected _isCancel: boolean = false;
    protected _isDone: boolean = false;
    constructor() {
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
    }
}
export { Command };