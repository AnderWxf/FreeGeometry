import { Global } from "../../../../core/Global";
import type { UserData } from "../../../UserData";
import { Command } from "../../Command";
import * as THREE from "three";

class SceneShowAssistsCom extends Command {
  async exec() {
    let scene = Global.scene;
    let os = scene.allObjects;
    for (let i = 0; i < os.length; i++) {
      const o = os[i] as THREE.Object3D;
      let userData = o.userData as UserData;
      if (userData.isAssist) {
        o.visible = Global.isShowAssists;
      }
    }
    this.done();
  }
}
export { SceneShowAssistsCom }