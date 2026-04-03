import { Global } from "../../../core/Global";
import { Command } from "../Command";
import type { CommandExecuter } from "../CommandExecuter";
import * as THREE from "three";

/**
 * Batch processing command class.
 * 
 */
class ComBatch extends Command {
    public olds: THREE.Object3D[];
    protected results: THREE.Object3D[];
    protected tempResults: THREE.Object3D[];
    protected isDeleteOld = true;
    constructor(executer: CommandExecuter, text: string) {
        super(executer, text);
        this.olds = [];
        this.results = [];
        this.tempResults = [];
    }

    async exec(): Promise<void> {

    }
    onMouseMoveExec(event: MouseEvent) {
    };

    protected cancel() {
        this.unbind(window);
        Global.scene.remove(...this.tempResults);

        this.olds = null;
        this.results = null;
        this.tempResults = null;
    }

    override done() {
        super.done();
        this.unbind(window);
        Global.scene.add(...this.results);
        if (this.isDeleteOld)
            Global.scene.remove(...this.olds);
        Global.scene.remove(...this.tempResults);

        this.tempResults = [];
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
            Global.scene.remove(...this.results);
            if (this.isDeleteOld)
                Global.scene.add(...this.olds);
        }
    }
    override redo() {
        if (this._isDone) {
            Global.scene.add(...this.results);
            if (this.isDeleteOld)
                Global.scene.remove(...this.olds);
        }
    }
}
export { ComBatch };