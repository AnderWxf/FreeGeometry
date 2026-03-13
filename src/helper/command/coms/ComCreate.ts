import { Global } from "../../../core/Global";
import { Command } from "../Command";
import type { CommandExecuter } from "../CommandExecuter";
import * as THREE from "three";

/**
 * Create command class.
 * 
 */
class ComCreate extends Command {
    protected result: THREE.Object3D;
    protected tempResult: THREE.Object3D;
    protected assists: THREE.Object3D[];

    constructor(executer: CommandExecuter, text: string) {
        super(executer, text);
        this.assists = [];
    }
    onMouseMove = (event: MouseEvent) => {
    };

    protected cancel() {
        this.unbind(window);
        if (this.tempResult) {
            Global.scene.remove(this.tempResult);
        }
    }
    override done() {
        super.done();
        this.unbind(window);
        Global.scene.add(this.result);
        if (this.tempResult) {
            Global.scene.remove(this.tempResult);
        }
        this.assists.forEach(element => {
            if (Global.scene.children.includes(element)) {
                Global.scene.remove(element);
            }
            this.result.children.push(element);
            element.visible = Global.isShowAssists;
        });
    }
    override bind(window: Window) {
        super.bind(window);
        window.addEventListener("mousemove", this.onMouseMove);
    }
    override unbind(window: Window) {
        super.unbind(window);
        window.removeEventListener("mousemove", this.onMouseMove);
    }
    override undo() {
        if (this._isDone) {
            Global.scene.remove(this.result);
        }
    }
    override redo() {
        if (this._isDone) {
            Global.scene.add(this.result);
        }
    }
}
export { ComCreate };