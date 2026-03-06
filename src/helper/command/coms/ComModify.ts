import type { DataBase } from "../../../geometry/data/DataBase";
import { Command } from "../Command";
import * as THREE from "three";
import type { CommandExecuter } from "../CommandExecuter";
import { Global } from "../../../core/Global";
import type { Vector2 } from "../../../math/Math";

/**
 * Modify command class.
 * 
 */
class ComModify extends Command {
    protected data: DataBase;
    protected old: THREE.Object3D;
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
        Global.select.isEditor = false;
    }
    override done() {
        super.done();
        this.unbind(window);
        if (this.tempResult) {
            Global.scene.remove(this.tempResult);
        }
        this.assists.forEach(element => {
            this.result.children.push(element);
            element.visible = Global.isShowAssists;
        });
        Global.select.isEditor = false;
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
            Global.scene.add(this.old);
        }
    }
    override redo() {
        if (this._isDone) {
            Global.scene.add(this.result);
            Global.scene.remove(this.old);
        }
    }
}
export { ComModify };