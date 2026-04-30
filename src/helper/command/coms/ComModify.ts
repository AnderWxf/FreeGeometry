import { Command } from "../Command";
import * as THREE from "three";
import type { CommandExecuter } from "../CommandExecuter";
import { Global } from "../../../core/Global";
import type { GeomType } from "../../../core/Constents";
import type { UserData } from "../../UserData";


/**
 * Modify command class.
 * 
 */
class ComModify extends Command {
    public old: THREE.Object3D;
    protected type: GeomType;
    protected result: THREE.Object3D;
    protected tempResult: THREE.Object3D;

    protected assists: THREE.Object3D[];
    protected assistIndex = -1;
    constructor(executer: CommandExecuter, text: string) {
        super(executer, text);
        this.assists = [];
    }
    onMouseMoveExec(event: MouseEvent) {
    };

    override cancel() {
        super.cancel();
        this.unbind(window);
        if (this.tempResult) {
            Global.scene.remove(this.tempResult);
        }
        this.assists.forEach(element => {
            this.result.children.push(element);
            element.visible = Global.isShowAssists;
        });

    }

    protected getIndex(pick: THREE.Object3D): number {
        for (let i = 0; i < this.old.children.length; i++) {
            if (pick.position.equals(this.old.children[i].position)) {
                return i;
            }
        }
        return -1;
    }

    override done() {
        super.done();
        this.unbind(window);
        Global.scene.add(this.result);
        Global.scene.remove(this.old);
        if (this.tempResult) {
            Global.scene.remove(this.tempResult);
        }
        let userData = this.result.userData as UserData;
        userData.assistPoints?.forEach(ap => {
            let assist = this.createAssistPoint({ p: ap.p.clone(), c: ap.c });
            this.assists.push(assist);
            this.result.children.push(assist);
            assist.visible = Global.isShowAssists;
        });
        if (Global.select.isEditor) {
            Global.select.pushSelectObject(this.result);
            Global.comExector.onEidtor();
        } else {
            Global.select.clear();
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