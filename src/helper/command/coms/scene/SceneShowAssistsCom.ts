import { Global } from "../../../../core/Global";
import type { UserData } from "../../../UserData";
import { Command } from "../../Command";
import * as THREE from "three";

/**
 * ShowAssists command class.
 * 格式：命令类型 true/false
 */
class SceneShowAssistsCom extends Command {
  async exec() {
    let str = this._text;
    let paras = str.split(' ');
    if (paras.length == 2) {
      if (paras[1] == 'true') {
        Global.isShowAssists = true;
      } else if (paras[1] == 'false') {
        Global.isShowAssists = false;
      }
    }
    // let scene = Global.scene;
    // let os = scene.allObjects;
    // for (let i = 0; i < os.length; i++) {
    //   const o = os[i] as THREE.Object3D;
    //   let userData = o.userData as UserData;
    //   if (userData.isAssist) {
    //     o.visible = Global.isShowAssists;
    //   }
    // }

    this._text = this._text + ' ' + Global.isShowAssists;

    this.done();
  }
}
export { SceneShowAssistsCom }