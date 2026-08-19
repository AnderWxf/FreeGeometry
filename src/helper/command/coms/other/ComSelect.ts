import { Global } from "../../../../core/Global";
import { DataBase } from "../../../../geometry/data/DataBase";
import type { UserData } from "../../../UserData";
import { Command } from "../../Command";
import type { CommandExecuter } from "../../CommandExecuter";
import * as THREE from "three";

/**
 * Select processing command class.
 * 格式：命令类型 uuid0 uuid1 ...
 */
class ComSelect extends Command {
  public olds: THREE.Object3D[];
  public results: THREE.Object3D[];
  constructor(executer: CommandExecuter, text: string) {
    super(executer, text);
    this.olds = [];
    this.results = [];
  }

  async exec(): Promise<void> {
    let str = this._text;
    let paras = str.split(' ');

    // 保存以前的选择对象
    this.olds.push(...Global.select.selectedObjects);
    // 以前选择的取消选择
    Global.select.selectedObjects = [];
    for (let i = 0; i < this.olds.length; i++) {
      let obj = this.olds[i];
      let userData = obj.userData as UserData;
      if (userData.color || userData.color !== 0) {
        (obj as any).material?.color?.setHex(userData.color);
      }
    }

    // 从场景中选择需要的目标
    this.results = Global.scene.getObjectsByUUIDs(paras);
    // 设置选择状态
    Global.select.selectedObjects.push(...this.results);
    for (let i = 0; i < this.results.length; i++) {
      let obj = this.results[i];
      if (Global.select.overObjects.includes(obj)) {
        Global.select.overObjects.splice(Global.select.overObjects.indexOf(obj), 1);
      }
      (obj as any).material?.color?.setHex(THREE.Color.NAMES.aqua);
    }
    this.done();
  }

  override cancel() {
    super.cancel();
    this.unbind(window);

    this.olds = [];
    this.results = [];
  }

  override done() {
    super.done();
    this.unbind(window);
  }

  override undo() {
    if (this._isDone) {
      // 选择的取消选择
      Global.select.selectedObjects = [];
      for (let i = 0; i < this.results.length; i++) {
        let obj = this.results[i];
        let userData = obj.userData as UserData;
        if (userData.color || userData.color !== 0) {
          (obj as any).material?.color?.setHex(userData.color);
        }
      }
      // 设置选择状态
      Global.select.selectedObjects.push(...this.olds);
      for (let i = 0; i < this.olds.length; i++) {
        let obj = this.olds[i];
        if (Global.select.overObjects.includes(obj)) {
          Global.select.overObjects.splice(Global.select.overObjects.indexOf(obj), 1);
        }
        (obj as any).material?.color?.setHex(THREE.Color.NAMES.aqua);
      }
    }
  }
  override redo() {
    if (this._isDone) {
      // 以前选择的取消选择
      Global.select.selectedObjects = [];
      for (let i = 0; i < this.olds.length; i++) {
        let obj = this.olds[i];
        let userData = obj.userData as UserData;
        if (userData.color || userData.color !== 0) {
          (obj as any).material?.color?.setHex(userData.color);
        }
      }
      // 设置选择状态
      Global.select.selectedObjects.push(...this.results);
      for (let i = 0; i < this.results.length; i++) {
        let obj = this.results[i];
        if (Global.select.overObjects.includes(obj)) {
          Global.select.overObjects.splice(Global.select.overObjects.indexOf(obj), 1);
        }
        (obj as any).material?.color?.setHex(THREE.Color.NAMES.aqua);
      }
    }
  }
}
export { ComSelect };