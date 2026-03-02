import * as THREE from "three";
import { ActionContext3D } from "../Active";
import { Global } from "../../../core/Global";
import { ActPickPoint2 } from "../acts/ActPickPoint2";
import { Brep2Builder } from "../../../geometry/algorithm/builder/Brep2Builder";
import { Vector2 } from "../../../math/Math";
import { BrepMeshBuilder } from "../../MeshBuilder";
import { ComDelete } from "./ComDelete";
import type { CommandExecuter } from "../CommandExecuter";

/**
 * Delete objets command class.
 * 
 */
class DeleteObjectsCom extends ComDelete {
    result: THREE.Object3D[];
    constructor(executer: CommandExecuter, text: string) {
        super(executer, text);
        this.result = [];
    }
    async exec(): Promise<void> {
        this.bind(window);
        let selectedObjects = Global.select.selectedObjects;
        this.result.push(...selectedObjects);
        for (let i = 0; i < this.result.length; i++) {
            Global.scene.remove(this.result[i]);
        }
        this.done();
    }
    protected cancel() {
        this.unbind(window);
    }

    override undo() {
        if (this._isDone) {
            for (let i = 0; i < this.result.length; i++) {
                Global.scene.add(this.result[i]);
            }
        }
    }
    override redo() {
        if (this._isDone) {
            for (let i = 0; i < this.result.length; i++) {
                Global.scene.remove(this.result[i]);
            }
        }
    }
}
export { DeleteObjectsCom };