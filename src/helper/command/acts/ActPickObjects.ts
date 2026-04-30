import { ActionContext3D, Active } from "../Active";
import * as THREE from "three";

/**
 * ActPickObjects base class.
 * 
 */
class ActPickObjects extends Active {
    results: Array<THREE.Object3D>;
    context: ActionContext3D;
    protected _isDone: boolean = false;
    constructor() {
        super();
    }
    override async execute(context: ActionContext3D): Promise<void> {
        super.execute(context);
        this.bind(window);
        this.context = context;
        this.results = [];
        context.select.clear();
        await new Promise(resolve => setTimeout(resolve, 10)); // 等待10ms
        // 等待用户选择对象完成
        while (!this._isDone && !this._isCancel) {
            await new Promise(resolve => setTimeout(resolve, 10)); // 等待10ms
        }
        if (!this._isCancel)
            this.results.push(...context.select.selectedObjects);
        this.unbind(window);
    }
    onKeyDown = (event: KeyboardEvent) => {
        switch (event.code) {
            case "Escape":
                this._isCancel = true;
                break;
            case "Enter":
            case "NumpadEnter":
                this._isDone = true;
                break;
        }
    }
    bind(window: Window) {
        window.addEventListener("keydown", this.onKeyDown);
    }
    unbind(window: Window) {
        window.removeEventListener("keydown", this.onKeyDown);
    }
}
export { ActPickObjects };