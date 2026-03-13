import { Global } from "../../core/Global";
import { Brep2Builder } from "../../geometry/algorithm/builder/Brep2Builder";
import type { DataBase } from "../../geometry/data/DataBase";
import type { Vector2 } from "../../math/Math";
import { bin } from "../../mathjs/lib/cjs/entry/pureFunctionsAny.generated";
import { BrepMeshBuilder } from "../MeshBuilder";
import type { CommandExecuter } from "./CommandExecuter";
import * as THREE from "three";

/**
 * Command base class.
 * 
 */
class Command {
    static geometry = new THREE.SphereGeometry(0.1);
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

    // 创建一个辅助点
    protected createAssistPoint(p: Vector2, color: number = THREE.Color.NAMES.darkblue): THREE.Mesh {
        const material = new THREE.MeshBasicMaterial({ color: color });
        const mesh = new THREE.Mesh(Command.geometry, material);
        mesh.position.x = p.x;
        mesh.position.y = p.y;
        mesh.name = "assist";
        mesh.userData.canPick = true;
        mesh.userData.isAssist = true;
        mesh.userData.color = color;
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