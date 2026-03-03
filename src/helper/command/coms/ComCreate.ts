import { Global } from "../../../core/Global";
import type { Vector2 } from "../../../math/Math";
import { Command } from "../Command";
import type { CommandExecuter } from "../CommandExecuter";
import * as THREE from "three";

/**
 * Create command class.
 * 
 */
class ComCreate extends Command {
    protected result: THREE.Object3D;
    protected assists: THREE.Object3D[];
    protected temp: THREE.Object3D;
    constructor(executer: CommandExecuter, text: string) {
        super(executer, text);
        this.assists = [];
    }
    onMouseMove = (event: MouseEvent) => {
    };

    protected createPoint(p: Vector2): THREE.Mesh {
        const geometry = new THREE.SphereGeometry(0.1);
        const material = new THREE.MeshBasicMaterial({ color: 0x0088ff });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.x = p.x;
        mesh.position.y = p.y;
        mesh.name = "point";
        mesh.userData.canPick = true;
        mesh.userData.original = p;
        return mesh;
    }
    protected cancel() {
        this.unbind(window);
        if (this.temp) {
            Global.scene.remove(this.temp);
        }
    }
    override done() {
        super.done();
        this.unbind(window);
        if (this.temp) {
            Global.scene.remove(this.temp);
        }
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