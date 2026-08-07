import { Global } from "../../../../core/Global";
import { Command } from "../../Command";
import * as THREE from "three";
import type { CommandExecuter } from "../../CommandExecuter";
import type { UserData } from "../../../UserData";
import { GeomType } from "../../../../core/Constents";

class SceneClearPointCom extends Command {
  public olds: THREE.Object3D[];
  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
    this.olds = [];
  }
  async exec() {
    let scene = Global.scene;
    for (let i = scene.objects.length - 1; i >= 0; i--) {
      const o = scene.objects[i] as THREE.Object3D;
      let userData = o.userData as UserData;
      if (userData.type === GeomType.MATH_VECTOR2 || userData.type === GeomType.MATH_VECTOR3) {
        this.olds.push(o);
        scene.remove(o);
      }
    }
    this.done();
  }
  override undo() {
    if (this._isDone) {
      Global.scene.add(...this.olds);
    }
  }
  override redo() {
    if (this._isDone) {
      Global.scene.remove(...this.olds);
    }
  }
}
export { SceneClearPointCom }