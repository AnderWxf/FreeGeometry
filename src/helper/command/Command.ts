import { Global } from "../../core/Global";
import type { DataBase } from "../../geometry/data/DataBase";
import type { Vector2 } from "../../math/Math";
import { bin } from "../../mathjs/lib/cjs/entry/pureFunctionsAny.generated";
import type { CommandExecuter } from "./CommandExecuter";
import * as THREE from "three";

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

    protected createAssistPoint(p: Vector2): THREE.Mesh {
        const geometry = new THREE.SphereGeometry(0.1);
        const material = new THREE.MeshBasicMaterial({ color: 0x0088ff });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = p.x;
        mesh.position.y = p.y;
        mesh.name = "assist";
        mesh.userData.canPick = true;
        mesh.userData.isAssist = true;
        mesh.userData.original = p;
        return mesh;
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