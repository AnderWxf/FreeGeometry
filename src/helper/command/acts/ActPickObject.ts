import type { DataBase } from "../../../geometry/data/DataBase";
import { ActionContext3D, Active } from "../Active";
import * as THREE from "three";

/**
 * ActPickObject base class.
 * 
 */
class ActPickObject extends Active {
    result: THREE.Object3D;
    context: ActionContext3D;
    constructor() {
        super();
    }
    override async execute(context: ActionContext3D): Promise<void> {
        super.execute(context);
        this.bind(window);
        this.context = context;
        while (context.select.selectedObjects.length == 0 && !this._isCancel) {
            await new Promise(resolve => setTimeout(resolve, 10)); // 等待10ms
        }
        if (!this._isCancel)
            this.result = context.select.selectedObjects[0];
        this.unbind(window);
    }
    onMouseMove = (event: MouseEvent) => {
        if (this._isCancel) { return; }
    };
    bind(window: Window) {
        window.addEventListener("mousemove", this.onMouseMove);
    }
    unbind(window: Window) {
        window.removeEventListener("mousemove", this.onMouseMove);
    }
}
export { ActPickObject };